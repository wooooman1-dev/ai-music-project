import { parsePlanningDraft } from './parser';

const PLANNING_INPUT_FIELDS = [
  'name',
  'idea',
  'genre',
  'mood',
  'bpm',
  'vocalType',
  'language',
  'listeningContext',
  'negativePrompt',
];

function createPlanningInput(project) {
  return Object.fromEntries(PLANNING_INPUT_FIELDS.map((field) => [field, project?.[field] ?? '']));
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function createGeminiPlanningDraft(project, options = {}) {
  const response = await fetch('/api/planning/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project: createPlanningInput(project) }),
    signal: options.signal,
  });

  const payload = await readJson(response);

  if (!response.ok) {
    const error = new Error(payload?.error?.message || 'AI 음악 기획을 생성하지 못했습니다.');
    error.code = payload?.error?.code || 'planning_request_failed';
    error.status = response.status;
    throw error;
  }

  return parsePlanningDraft(payload?.plan, {
    source: 'gemini',
    provider: payload?.provider || 'gemini',
    model: payload?.model || null,
    generatedAt: payload?.generatedAt,
  });
}
