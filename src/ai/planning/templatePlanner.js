export function createTemplatePlanningDraft(project) {
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
