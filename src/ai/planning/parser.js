const REQUIRED_TEXT_FIELDS = [
  'concept',
  'marketability',
  'targetAudience',
  'emotionalArc',
  'hookStrategy',
  'chorusStrategy',
  'instrumentation',
  'vocalDirection',
  'songStructure',
  'sunoPrompt',
  'negativePrompt',
  'coverPrompt',
  'youtubeTitle',
  'youtubeDescription',
];

function requireText(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`AI planning response is missing ${field}.`);
  }

  return value.trim();
}

export function parsePlanningDraft(value, metadata = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('AI planning response must be a JSON object.');
  }

  const titleCandidates = Array.isArray(value.titleCandidates)
    ? value.titleCandidates.map((title) => typeof title === 'string' ? title.trim() : '').filter(Boolean)
    : [];

  if (titleCandidates.length !== 3) {
    throw new Error('AI planning response must contain exactly three title candidates.');
  }

  if (new Set(titleCandidates.map((title) => title.toLocaleLowerCase())).size !== 3) {
    throw new Error('AI planning response must contain three distinct title candidates.');
  }

  const normalized = {
    titleCandidates,
    lyricsMode: value.lyricsMode === 'custom' ? 'custom' : 'suno',
    customLyrics: typeof value.customLyrics === 'string' ? value.customLyrics : '',
  };

  for (const field of REQUIRED_TEXT_FIELDS) {
    normalized[field] = requireText(value[field], field);
  }

  return {
    ...normalized,
    generationSource: metadata.source || 'gemini',
    generationProvider: metadata.provider || 'gemini',
    generationModel: metadata.model || null,
    generatedAt: metadata.generatedAt || new Date().toISOString(),
  };
}
