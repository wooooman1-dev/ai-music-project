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
      description: '청취 상황, 감정선, 전개 방식과 차별점을 포함한 곡 콘셉트',
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
    'lyricsMode',
    'customLyrics',
    'sunoPrompt',
    'negativePrompt',
    'coverPrompt',
    'youtubeTitle',
    'youtubeDescription',
  ],
};
