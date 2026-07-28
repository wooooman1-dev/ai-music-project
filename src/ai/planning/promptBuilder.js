function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function buildPlanningPrompt(project) {
  const input = {
    projectName: clean(project?.name),
    songIdea: clean(project?.idea),
    genre: clean(project?.genre),
    mood: clean(project?.mood),
    bpm: clean(project?.bpm),
    vocalType: clean(project?.vocalType),
    language: clean(project?.language),
    listeningContext: clean(project?.listeningContext),
    negativePrompt: clean(project?.negativePrompt),
  };

  return `당신은 Bright Music의 AI 음악 프로듀서입니다.
사용자의 입력을 단순히 반복하지 말고, 실제로 Suno에서 일관된 결과를 얻을 수 있는 상업적 음악 기획으로 발전시키세요.

기획 원칙:
- 사용자가 지정한 장르, BPM, 보컬, 언어와 청취 상황을 우선합니다.
- 첫 10초 안에 곡의 정체성이 드러나도록 설계합니다.
- 제목 후보 3개는 서로 다른 인상이어야 하며, 아티스트명이나 기존 곡명을 모방하지 않습니다.
- concept는 곡 전체의 핵심 정체성과 청취 경험만 명확하게 요약합니다.
- marketability는 과장된 성공 예측이 아니라 선택될 청취 상황, 플랫폼 적합성, 차별점과 위험 요소를 분석합니다.
- targetAudience는 나이만 적지 말고 취향, 감정 상태, 청취 상황을 구체적으로 정의합니다.
- emotionalArc는 도입, 벌스, 코러스, 브리지와 엔딩에서 감정이 어떻게 변화하고 해소되는지 설명합니다.
- hookStrategy는 첫 10초의 사운드 훅과 반복 청취를 만드는 멜로디, 리듬 또는 짧은 가사 장치를 제안합니다.
- chorusStrategy는 코러스의 감정적 보상, 기억되는 문구, 멜로디 상승과 편곡 확장 방향을 제안합니다.
- instrumentation은 핵심 악기, 보조 악기, 리듬 섹션, 공간감과 질감을 구체적으로 설계합니다.
- vocalDirection은 음색, 음역, 발성, 감정 강도, 더블링과 백킹 보컬 방향을 설명합니다.
- songStructure는 인트로부터 아웃트로까지 권장 순서와 각 구간의 역할을 간결하게 제안합니다.
- sunoPrompt는 영어 중심으로 작성하고 장르, BPM, 분위기, 보컬 성격, 핵심 악기, 곡 구조, 훅, 믹싱 방향을 구체적으로 적습니다.
- 가사는 기본적으로 Suno가 생성하므로 lyricsMode는 suno, customLyrics는 빈 문자열로 둡니다.
- negativePrompt에는 입력값을 반영하되 원하는 결과를 방해할 추가 요소도 선별해 포함합니다.
- coverPrompt는 정사각형, 텍스트 없음, 로고 없음 조건을 포함한 영어 프롬프트로 작성합니다.
- YouTube 제목과 설명은 AI라는 단어를 억지로 넣지 말고 곡의 감정과 청취 상황을 중심으로 작성합니다.
- 각 필드는 같은 내용을 반복하지 말고 고유한 역할을 수행해야 합니다.
- 응답은 제공된 JSON 스키마에 맞는 JSON만 반환합니다.

프로젝트 입력:
${JSON.stringify(input, null, 2)}`;
}
