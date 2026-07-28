# Bright Music

Bright Music은 AI 음악의 기획, 음원 버전 관리, 자산 제작, 발행과 성과 분석을 연결하는 AI Music Operations Platform입니다.

## 현재 구현 범위

- 대시보드
- 음악 프로젝트 생성·저장·열기·삭제
- 곡 아이디어, 장르, 분위기, BPM, 보컬, 언어 입력
- Gemini 기반 AI 음악 기획 생성
- 제목 후보, 곡 콘셉트, 시장성, 타깃, 감정 흐름, 훅·코러스·악기·보컬·곡 구조 편집
- 커버 프롬프트와 YouTube 메타데이터 생성
- 기획 승인 상태 관리
- MP3/WAV 음원 버전 등록 및 재생
- 최종 음원 선택
- 브라우저 LocalStorage 프로젝트 저장

Gemini API 키는 React에 노출하지 않습니다. 브라우저는 `/api/planning/generate`만 호출하고, 로컬 Node API가 Gemini Interactions API를 호출합니다.

## 환경 설정

루트에 `.env` 파일을 만들고 Gemini API 키를 설정합니다.

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.6-flash
BRIGHT_MUSIC_API_PORT=8788
VITE_PLANNING_PROVIDER=gemini
```

전체 예시는 `.env.example`을 참고하세요. `GEMINI_API_KEY`에는 `VITE_` 접두사를 붙이지 않습니다.

Gemini를 호출하지 않고 기존 템플릿 기획만 확인하려면 다음 값을 사용합니다.

```env
VITE_PLANNING_PROVIDER=template
```

## 실행

```bash
npm install
npm run dev
```

`npm run dev`는 Vite와 Bright Music API를 함께 실행합니다.

개별 실행:

```bash
npm run dev:api
npm run dev:web
```

검증과 프로덕션 빌드:

```bash
npm run test
npm run build
npm run check
npm run preview
```

## 현재 상태 흐름

```text
DRAFT
→ PLAN_REVIEW
→ MUSIC_GENERATION
→ AUDIO_REVIEW
→ AUDIO_SELECTED
```

## 다음 구현 순서

1. AI 기획 화면의 시장성·타깃·훅·편곡 전략 확장
2. PostgreSQL/Prisma 기반 영구 저장
3. 업로드 음원의 영구 파일 저장
4. 앨범아트 생성과 선택
5. FFmpeg 뮤직비디오 렌더링
6. YouTube 검토 및 업로드
7. 성과 데이터 수집

자세한 제품 원칙은 `docs/AI_MUSIC_PROJECT_GUIDE.md`를 기준으로 합니다.
