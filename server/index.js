import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateGeminiPlanning, GeminiProviderError } from './ai/providers/gemini.js';

function loadLocalEnv() {
  const loaded = {};

  for (const fileName of ['.env', '.env.local']) {
    const filePath = resolve(process.cwd(), fileName);
    if (!existsSync(filePath)) continue;

    for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const separator = trimmed.indexOf('=');
      if (separator < 1) continue;

      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      loaded[key] = value;
    }
  }

  for (const [key, value] of Object.entries(loaded)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  response.end(JSON.stringify(payload));
}

async function readJson(request, limit = 128 * 1024) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > limit) {
      const error = new Error('요청 데이터가 너무 큽니다.');
      error.code = 'request_too_large';
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  if (!chunks.length) return {};

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('요청 JSON 형식이 올바르지 않습니다.');
    error.code = 'invalid_json';
    error.status = 400;
    throw error;
  }
}

function validateProject(project) {
  if (!project || typeof project !== 'object' || Array.isArray(project)) {
    const error = new Error('음악 프로젝트 정보가 필요합니다.');
    error.code = 'project_required';
    error.status = 400;
    throw error;
  }

  const hasIdentity = [project.name, project.idea].some((value) => typeof value === 'string' && value.trim());
  if (!hasIdentity) {
    const error = new Error('프로젝트 이름 또는 곡 아이디어를 입력하세요.');
    error.code = 'project_identity_required';
    error.status = 400;
    throw error;
  }
}

loadLocalEnv();

const port = Number(process.env.BRIGHT_MUSIC_API_PORT || 8788);
const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/health') {
    sendJson(response, 200, {
      ok: true,
      service: 'bright-music-api',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/planning/generate') {
    try {
      const body = await readJson(request);
      validateProject(body.project);
      const result = await generateGeminiPlanning(body.project);
      sendJson(response, 200, result);
    } catch (error) {
      const status = error instanceof GeminiProviderError
        ? error.status
        : Number(error?.status) || 500;
      sendJson(response, status, {
        error: {
          code: error?.code || 'planning_generation_failed',
          message: error?.message || 'AI 음악 기획 생성 중 오류가 발생했습니다.',
        },
      });
    }
    return;
  }

  sendJson(response, 404, {
    error: { code: 'not_found', message: '요청한 API를 찾을 수 없습니다.' },
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`[Bright Music API] http://127.0.0.1:${port}`);
  console.log(`[Bright Music API] Gemini: ${process.env.GEMINI_API_KEY ? 'configured' : 'not configured'}`);
});
