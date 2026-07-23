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

export function createPlanningDraft(project) {
  const keyword = project.idea.trim() || project.name;
  return {
    titleCandidates: [
      project.name || '새로운 노래',
      `${project.mood.split(',')[0].trim()}의 밤`,
      `${keyword.slice(0, 18)} 그리고 우리`,
    ],
    concept: `${project.listeningContext}에 어울리는 ${project.genre} 곡입니다. ${project.mood}의 정서를 유지하면서 첫 10초 안에 분위기가 드러나도록 구성합니다.`,
    lyricsMode: 'suno',
    customLyrics: '',
    sunoPrompt: `${project.genre}, ${project.mood}, ${project.bpm} BPM, ${project.vocalType}, ${project.language}, intimate vocal, memorable chorus, short intro, polished modern production`,
    negativePrompt: project.negativePrompt,
    coverPrompt: `cinematic album cover for ${project.genre}, ${project.mood}, minimal composition, emotional night atmosphere, no text, square format`,
    youtubeTitle: `${project.name || '새 노래'} | ${project.genre} AI Music`,
    youtubeDescription: `${project.idea}\n\nCreated with Bright Music.`,
    generationSource: 'template',
  };
}

export function statusLabel(status) {
  return projectStatusLabels[status] || status;
}

export function stepActive(current, target) {
  return projectStatusOrder.indexOf(current) >= projectStatusOrder.indexOf(target);
}
