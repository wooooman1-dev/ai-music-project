import assert from 'node:assert/strict';
import { buildPlanningPrompt } from '../src/ai/planning/promptBuilder.js';
import { parsePlanningDraft } from '../src/ai/planning/parser.js';
import { createTemplatePlanningDraft } from '../src/ai/planning/templatePlanner.js';

const project = {
  name: '새벽의 잔상',
  idea: '끝난 관계를 차분하게 정리하는 노래',
  genre: 'Dream Pop',
  mood: '몽환적, 차분함',
  bpm: '92',
  vocalType: '여성 보컬',
  language: '한국어',
  listeningContext: '늦은 밤 혼자 듣는 음악',
  negativePrompt: '과도한 고음, 공격적인 드럼',
};

const prompt = buildPlanningPrompt(project);
assert.match(prompt, /새벽의 잔상/);
assert.match(prompt, /92/);
assert.match(prompt, /marketability/);
assert.match(prompt, /hookStrategy/);
assert.match(prompt, /JSON/);

const templatePlan = createTemplatePlanningDraft(project);
assert.equal(templatePlan.generationSource, 'template');
assert.equal(templatePlan.titleCandidates.length, 3);
assert.ok(templatePlan.marketability);
assert.ok(templatePlan.songStructure);

const parsed = parsePlanningDraft({
  titleCandidates: ['새벽의 잔상', '남겨진 온도', '조용한 끝'],
  concept: '늦은 밤 혼자 듣는 청취자를 위한 차분한 드림 팝 곡입니다.',
  marketability: '감정 중심의 야간 플레이리스트와 집중 청취 콘텐츠에 적합합니다.',
  targetAudience: '몽환적인 팝과 절제된 이별 감성을 선호하는 야간 청취자입니다.',
  emotionalArc: '담담한 회상에서 시작해 코러스에서 감정을 인정하고 조용히 놓아줍니다.',
  hookStrategy: '첫 10초에 유리 질감의 신스 리프와 짧은 보컬 모티프를 제시합니다.',
  chorusStrategy: '짧은 핵심 문구를 반복하고 보컬 더블링과 넓은 패드로 감정을 확장합니다.',
  instrumentation: '소프트 신스, 클린 기타, 절제된 킥과 베이스, 긴 리버브를 사용합니다.',
  vocalDirection: '가까운 여성 보컬로 시작해 코러스에서 더블링과 얇은 하모니를 추가합니다.',
  songStructure: '4마디 인트로 → 벌스 → 프리코러스 → 코러스 → 벌스 → 코러스 → 브리지 → 최종 코러스',
  lyricsMode: 'suno',
  customLyrics: '',
  sunoPrompt: 'Dream pop, 92 BPM, intimate female vocal, short intro, memorable chorus',
  negativePrompt: 'aggressive drums, excessive high notes',
  coverPrompt: 'square cinematic album cover, quiet blue dawn, no text, no logo',
  youtubeTitle: '새벽의 잔상 | 늦은 밤 듣는 Dream Pop',
  youtubeDescription: '끝난 관계를 조용히 정리하는 새벽의 감정을 담았습니다.',
}, { model: 'test-model' });

assert.equal(parsed.generationSource, 'gemini');
assert.equal(parsed.generationModel, 'test-model');
assert.equal(parsed.titleCandidates.length, 3);
assert.ok(parsed.hookStrategy);
assert.ok(parsed.instrumentation);
assert.throws(() => parsePlanningDraft({ ...parsed, titleCandidates: ['하나'] }), /exactly three/);
assert.throws(() => parsePlanningDraft({ ...parsed, marketability: '' }), /marketability/);

console.log('Planning pipeline checks passed.');
