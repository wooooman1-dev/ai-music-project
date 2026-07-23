export const initialProjectForm = {
  name: '',
  idea: '',
  genre: 'Dream Pop',
  mood: '몽환적, 차분함',
  bpm: '92',
  vocalType: '여성 보컬',
  language: '한국어',
  listeningContext: '늦은 밤 혼자 듣는 음악',
  negativePrompt: '과도한 고음, 공격적인 드럼, 지나치게 긴 인트로',
};

export const projectStatusLabels = {
  DRAFT: '초안',
  PLAN_REVIEW: '기획 검토',
  MUSIC_GENERATION: 'Suno 생성',
  AUDIO_REVIEW: '음원 검토',
  AUDIO_SELECTED: '최종 음원 선택',
};

export const projectStatusOrder = Object.keys(projectStatusLabels);

export function createMusicProject(form) {
  const now = new Date().toISOString();
  return {
    ...form,
    id: crypto.randomUUID(),
    status: 'DRAFT',
    createdAt: now,
    updatedAt: now,
    plan: null,
    planApprovedAt: null,
    audioVersions: [],
    selectedAudioId: null,
    cover: null,
    video: null,
    publishing: null,
    analytics: null,
  };
}

export function statusLabel(status) {
  return projectStatusLabels[status] || status;
}

export function stepActive(current, target) {
  return projectStatusOrder.indexOf(current) >= projectStatusOrder.indexOf(target);
}
