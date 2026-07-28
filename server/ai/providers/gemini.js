import { buildPlanningPrompt } from '../../../src/ai/planning/promptBuilder.js';
import { parsePlanningDraft } from '../../../src/ai/planning/parser.js';
import { planningResponseSchema } from '../../../src/ai/planning/planningSchema.js';

const DEFAULT_MODEL = 'gemini-3.6-flash';
const DEFAULT_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

export class GeminiProviderError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'GeminiProviderError';
    this.code = options.code || 'gemini_request_failed';
    this.status = options.status || 502;
  }
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function retryDelay(response, attempt) {
  const retryAfter = Number(response.headers.get('retry-after'));
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return Math.min(retryAfter * 1000, 20_000);
  }

  return Math.min(1_000 * (2 ** attempt), 8_000);
}

function extractOutputText(interaction) {
  if (typeof interaction?.output_text === 'string' && interaction.output_text.trim()) {
    return interaction.output_text;
  }

  const modelSteps = Array.isArray(interaction?.steps)
    ? interaction.steps.filter((step) => step?.type === 'model_output')
    : [];
  const lastStep = modelSteps.at(-1);
  const textParts = Array.isArray(lastStep?.content)
    ? lastStep.content.filter((part) => part?.type === 'text' && typeof part.text === 'string')
    : [];

  return textParts.map((part) => part.text).join('\n').trim();
}

async function requestInteraction(payload, apiKey, options = {}) {
  const endpoint = process.env.GEMINI_API_URL || DEFAULT_ENDPOINT;
  const maxAttempts = 3;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 60_000);
    const abort = () => controller.abort();
    options.signal?.addEventListener('abort', abort, { once: true });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        return data;
      }

      if (RETRYABLE_STATUS.has(response.status) && attempt < maxAttempts - 1) {
        await sleep(retryDelay(response, attempt));
        continue;
      }

      throw new GeminiProviderError(
        data?.error?.message || `Gemini API 요청이 실패했습니다. (${response.status})`,
        {
          code: data?.error?.status || 'gemini_api_error',
          status: response.status === 429 ? 429 : 502,
        },
      );
    } catch (error) {
      if (error instanceof GeminiProviderError) throw error;
      if (options.signal?.aborted) {
        throw new GeminiProviderError('AI 음악 기획 요청이 취소되었습니다.', {
          code: 'planning_request_aborted',
          status: 499,
        });
      }
      if (attempt < maxAttempts - 1) {
        await sleep(Math.min(1_000 * (2 ** attempt), 8_000));
        continue;
      }
      throw new GeminiProviderError(
        error?.name === 'AbortError'
          ? 'Gemini 응답 시간이 초과되었습니다.'
          : 'Gemini API에 연결하지 못했습니다.',
        { code: error?.name === 'AbortError' ? 'gemini_timeout' : 'gemini_unavailable' },
      );
    } finally {
      clearTimeout(timeout);
      options.signal?.removeEventListener('abort', abort);
    }
  }

  throw new GeminiProviderError('Gemini API 요청을 완료하지 못했습니다.');
}

export async function generateGeminiPlanning(project, options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    throw new GeminiProviderError('서버에 GEMINI_API_KEY가 설정되지 않았습니다.', {
      code: 'gemini_not_configured',
      status: 503,
    });
  }

  const interaction = await requestInteraction({
    model,
    input: buildPlanningPrompt(project),
    store: false,
    response_format: {
      type: 'text',
      mime_type: 'application/json',
      schema: planningResponseSchema,
    },
  }, apiKey, options);

  const outputText = extractOutputText(interaction);
  if (!outputText) {
    throw new GeminiProviderError('Gemini 응답에 음악 기획 결과가 없습니다.', {
      code: 'gemini_empty_response',
    });
  }

  let parsed;
  try {
    parsed = JSON.parse(outputText);
  } catch {
    throw new GeminiProviderError('Gemini가 올바른 JSON 기획을 반환하지 않았습니다.', {
      code: 'gemini_invalid_json',
    });
  }

  const generatedAt = new Date().toISOString();
  let plan;
  try {
    plan = parsePlanningDraft(parsed, {
      source: 'gemini',
      provider: 'gemini',
      model: interaction?.model || model,
      generatedAt,
    });
  } catch (error) {
    throw new GeminiProviderError(`Gemini 기획 결과 검증에 실패했습니다: ${error.message}`, {
      code: 'gemini_invalid_planning',
    });
  }

  return {
    plan,
    provider: 'gemini',
    model: interaction?.model || model,
    generatedAt,
    usage: interaction?.usage || null,
    interactionId: interaction?.id || null,
  };
}
