export function createTemplatePlanningDraft(project) {
  const keyword = project.idea.trim() || project.name;
  const primaryMood = project.mood.split(',')[0].trim();

  return {
    titleCandidates: [
      project.name || '새로운 노래',
      `${primaryMood}의 밤`,
      `${keyword.slice(0, 18)} 그리고 우리`,
    ],
    concept: `${project.listeningContext}에 어울리는 ${project.genre} 곡입니다. ${project.mood}의 정서를 유지하면서 첫 10초 안에 분위기가 드러나도록 구성합니다.`,
    marketability: `${project.listeningContext} 플레이리스트와 감정 중심 음악 콘텐츠에 적합합니다. 장르의 익숙함을 유지하되 짧은 인트로와 명확한 훅으로 차별화합니다.`,
    targetAudience: `${project.genre}와 ${project.mood} 분위기를 선호하며 ${project.listeningContext} 상황에서 음악을 찾는 청취자입니다.`,
    emotionalArc: '절제된 도입에서 감정을 천천히 쌓고, 코러스에서 핵심 감정을 선명하게 드러낸 뒤 잔향이 남는 엔딩으로 마무리합니다.',
    hookStrategy: '첫 10초 안에 대표 악기 리프와 보컬 모티프를 제시하고, 짧고 반복 가능한 멜로디를 곡 전체에 재등장시킵니다.',
    chorusStrategy: '벌스보다 넓은 음역과 레이어를 사용하고, 한 번에 기억되는 짧은 핵심 문구를 반복해 감정적 보상을 만듭니다.',
    instrumentation: `${project.genre}의 핵심 질감을 만드는 신스 또는 기타, 절제된 베이스와 드럼, 넓은 공간계 효과를 중심으로 구성합니다.`,
    vocalDirection: `${project.vocalType}의 친밀한 톤을 유지하고 벌스는 가까이, 코러스는 더블링과 백킹 보컬로 넓게 확장합니다.`,
    songStructure: '짧은 인트로 → 벌스 1 → 프리코러스 → 코러스 → 벌스 2 → 코러스 → 짧은 브리지 → 최종 코러스 → 아웃트로',
    lyricsMode: 'suno',
    customLyrics: '',
    sunoPrompt: `${project.genre}, ${project.mood}, ${project.bpm} BPM, ${project.vocalType}, ${project.language}, intimate vocal, memorable chorus, short intro, polished modern production`,
    negativePrompt: project.negativePrompt,
    coverPrompt: `cinematic album cover for ${project.genre}, ${project.mood}, minimal composition, emotional night atmosphere, no text, square format`,
    youtubeTitle: `${project.name || '새 노래'} | ${project.genre} Music`,
    youtubeDescription: `${project.idea}\n\nCreated with Bright Music.`,
    generationSource: 'template',
  };
}
