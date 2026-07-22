# Bright Music

Bright Music은 AI 음악의 기획, 음원 버전 관리, 자산 제작, 발행과 성과 분석을 연결하는 AI Music Operations Platform입니다.

## 현재 구현 범위

- 대시보드
- 음악 프로젝트 생성·저장·열기·삭제
- 곡 아이디어, 장르, 분위기, BPM, 보컬, 언어 입력
- 음악 기획 초안 생성
- 제목 후보, 곡 콘셉트, 가사, Suno 프롬프트 편집
- 기획 승인 상태 관리
- MP3/WAV 음원 버전 등록 및 재생
- 최종 음원 선택
- 브라우저 LocalStorage 프로젝트 저장

현재 기획 생성은 UI와 데이터 흐름을 검증하기 위한 로컬 템플릿 방식입니다. 다음 단계에서 Bright Music API와 n8n Webhook을 연결해 실제 AI 기획 워크플로우로 교체합니다.

## 실행

```bash
npm install
npm run dev
```

프로덕션 빌드:

```bash
npm run build
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

1. PostgreSQL/Prisma 기반 영구 저장
2. Bright Music API
3. n8n 음악 기획 Webhook 연결
4. 업로드 음원의 영구 파일 저장
5. 앨범아트 생성과 선택
6. FFmpeg 뮤직비디오 렌더링
7. YouTube 검토 및 업로드
8. 성과 데이터 수집

자세한 제품 원칙은 `docs/AI_MUSIC_PROJECT_GUIDE.md`를 기준으로 합니다.
