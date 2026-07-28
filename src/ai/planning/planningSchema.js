export const planningResponseSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    titleCandidates: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: { type: 'string' },
      description: '서로 구별되는 한국어 곡 제목 후보 3개',
    },
    concept: {
      type: 'string',
      description: '곡의 핵심 정체성과 청취 경험을 한 문단으로 요약한 콘셉트',
    },
    marketability: {
      type: 'string',
      description: '이 곡이 어떤 상황과 플랫폼에서 선택될 가능성이 있는지, 차별점과 주의점을 포함한 시장성 분석',
    },
    targetAudience: {
      type: 'string',
      description: '핵심 청취자의 취향, 감정 상태, 청취 상황을 구체적으로 정의한 타깃 설명',
    },
    emotionalArc: {
      type: 'string',
      description: '도입부터 엔딩까지 감정이 어떻게 이동하고 해소되는지 설명한 감정 흐름',
    },
    hookStrategy: {
      type: 'string',
      description: '첫 10초와 반복 청취를 유도할 멜로디, 리듬, 가사 또는 사운드 훅 전략',
    },
    chorusStrategy: {
      type: 'string',
      description: '코러스의 감정적 보상, 멜로디 상승, 반복 문구와 편곡 확장 방향',
    },
    instrumentation: {
      type: 'string',
      description: '핵심 악기, 보조 악기, 리듬 섹션, 공간계 효과와 사운드 질감 구성',
    },
    vocalDirection: {
      type: 'string',
      description: '보컬 음색, 음역, 발성, 감정 표현, 더블링과 코러스 처리 방향',
    },
    songStructure: {
      type: 'string',
      description: '인트로, 벌스, 프리코러스, 코러스, 브리지, 아웃트로의 권장 순서와 길이 전략',
    },
    lyricsMode: {
      type: 'string',
      enum: ['suno', 'custom'],
      description: '기본값은 Suno 자동 가사 생성을 뜻하는 suno',
    },
    customLyrics: {
      type: 'string',
      description: 'lyricsMode가 custom일 때 사용할 가사. suno일 때는 빈 문자열',
    },
    sunoPrompt: {
      type: 'string',
      description: 'Suno에 바로 입력할 수 있는 영어 중심의 구체적인 음악 생성 프롬프트',
    },
    negativePrompt: {
      type: 'string',
      description: '피해야 할 음악 요소를 쉼표로 구분한 문장',
    },
    coverPrompt: {
      type: 'string',
      description: '텍스트 없는 정사각형 앨범 커버를 만들기 위한 영어 이미지 프롬프트',
    },
    youtubeTitle: {
      type: 'string',
      description: '과장하지 않으면서 클릭 의도가 분명한 YouTube 업로드 제목',
    },
    youtubeDescription: {
      type: 'string',
      description: '곡의 감정과 청취 상황을 소개하는 자연스러운 한국어 YouTube 설명',
    },
  },
  required: [
    'titleCandidates',
    'concept',
    'marketability',
    'targetAudience',
    'emotionalArc',
    'hookStrategy',
    'chorusStrategy',
    'instrumentation',
    'vocalDirection',
    'songStructure',
    'lyricsMode',
    'customLyrics',
    'sunoPrompt',
    'negativePrompt',
    'coverPrompt',
    'youtubeTitle',
    'youtubeDescription',
  ],
};
