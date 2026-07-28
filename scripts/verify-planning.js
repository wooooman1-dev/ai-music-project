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
assert.match(prompt, /JSON/);

const templatePlan = createTemplatePlanningDraft(project);
assert.equal(templatePlan.generationSource, 'template');
assert.equal(templatePlan.titleCandidates.length, 3);

const parsed = parsePlanningDraft({
  titleCandidates: ['새벽의 잔상', '남겨진 온도', '조용한 끝'],
  concept: '늦은 밤 혼자 듣는 청취자를 위한 차분한 드림 팝 곡입니다.',
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
assert.throws(() => parsePlanningDraft({ ...parsed, titleCandidates: ['하나'] }), /exactly three/);

console.log('Planning pipeline checks passed.');
