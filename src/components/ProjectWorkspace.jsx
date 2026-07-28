import { projectStatusOrder, statusLabel, stepActive } from '../data/projectModel';

const strategyFields = [
  ['marketability', '시장성', '청취 상황, 플랫폼 적합성, 차별점과 위험 요소'],
  ['targetAudience', '타깃 청취자', '취향, 감정 상태와 실제 청취 상황'],
  ['emotionalArc', '감정 흐름', '도입부터 엔딩까지 감정의 이동과 해소'],
  ['hookStrategy', '훅 전략', '첫 10초와 반복 청취를 만드는 핵심 장치'],
  ['chorusStrategy', '코러스 전략', '감정적 보상, 기억되는 문구와 편곡 확장'],
  ['instrumentation', '악기 구성', '핵심 악기, 리듬 섹션, 공간감과 질감'],
  ['vocalDirection', '보컬 방향', '음색, 음역, 발성, 더블링과 백킹 보컬'],
  ['songStructure', '곡 구조', '인트로부터 아웃트로까지 권장 전개'],
];

function CopyButton({ value, children }) {
  return <button type="button" onClick={() => navigator.clipboard?.writeText(value || '')}>{children}</button>;
}

export default function ProjectWorkspace({
  project,
  onBack,
  onGeneratePlan,
  planningStatus = 'idle',
  planningError = '',
  onUpdatePlan,
  onApprovePlan,
  onAddAudio,
  onSelectAudio,
}) {
  const plan = project.plan;
  const lyricsMode = plan?.lyricsMode || 'suno';
  const approved = Boolean(project.planApprovedAt) && project.status !== 'PLAN_REVIEW';
  const generating = planningStatus === 'loading';

  return <section>
    <header className="page-header"><div><p className="eyebrow">{statusLabel(project.status)}</p><h1>{project.name}</h1><p>{project.genre} · {project.mood} · {project.bpm} BPM</p></div><button onClick={onBack}>목록으로</button></header>
    <div className="workflow-steps">{projectStatusOrder.map((status, index) => <div key={status} className={stepActive(project.status, status) ? 'complete' : ''}><span>{index + 1}</span>{statusLabel(status)}</div>)}</div>
    <div className="workspace-grid">
      <div className="panel">
        <div className="panel-title">
          <div>
            <h2>AI 음악 기획</h2>
            {plan?.generationSource === 'gemini' && <p className="source-note ai-source-note">Gemini AI 기획{plan.generationModel ? ` · ${plan.generationModel}` : ''}</p>}
            {plan?.generationSource === 'template' && <p className="source-note">기본 템플릿 기획입니다. Gemini로 다시 생성할 수 있습니다.</p>}
          </div>
          <button className="primary" onClick={onGeneratePlan} disabled={generating}>
            {generating ? 'AI 기획 생성 중…' : plan ? 'AI로 다시 생성' : 'AI 기획 생성'}
          </button>
        </div>

        {planningError && <div className="error-box"><strong>기획 생성 실패</strong><p>{planningError}</p></div>}

        {!plan
          ? <p className="muted">{generating ? 'Gemini가 시장성, 감정선, 훅과 Suno 프롬프트를 설계하고 있습니다.' : '아직 생성된 기획이 없습니다. 입력한 아이디어를 기준으로 AI 기획 초안을 만드세요.'}</p>
          : <div className="plan-fields">
            <label>제목 후보<textarea value={plan.titleCandidates.join('\n')} onChange={(event) => onUpdatePlan('titleCandidates', event.target.value.split('\n').filter(Boolean))} /></label>
            <label>곡 콘셉트<textarea value={plan.concept || ''} onChange={(event) => onUpdatePlan('concept', event.target.value)} /></label>

            <div className="strategy-section">
              <div className="strategy-heading">
                <div>
                  <p className="eyebrow">Producer Strategy</p>
                  <h3>음악 제작 전략</h3>
                </div>
                <p>한 문단에 섞여 있던 판단을 실제 제작에 사용할 수 있는 항목으로 분리했습니다.</p>
              </div>
              <div className="strategy-grid">
                {strategyFields.map(([field, label, description]) => (
                  <label key={field}>
                    <span>{label}</span>
                    <small>{description}</small>
                    <textarea value={plan[field] || ''} onChange={(event) => onUpdatePlan(field, event.target.value)} />
                  </label>
                ))}
              </div>
            </div>

            <fieldset className="lyrics-mode">
              <legend>가사 생성 방식</legend>
              <label><input type="radio" name="lyricsMode" checked={lyricsMode === 'suno'} onChange={() => onUpdatePlan('lyricsMode', 'suno')} /> <span><strong>Suno가 자동 생성</strong><small>기본값입니다. Suno가 가사와 작곡을 함께 구성합니다.</small></span></label>
              <label><input type="radio" name="lyricsMode" checked={lyricsMode === 'custom'} onChange={() => onUpdatePlan('lyricsMode', 'custom')} /> <span><strong>내가 직접 가사 입력</strong><small>직접 작성했거나 사용할 권리가 있는 가사만 입력하세요.</small></span></label>
            </fieldset>

            {lyricsMode === 'custom' && <label>사용자 가사<textarea className="lyrics" value={plan.customLyrics || ''} onChange={(event) => onUpdatePlan('customLyrics', event.target.value)} placeholder="사용할 권리가 있는 가사를 입력하세요." /></label>}

            <label>Suno 프롬프트<textarea value={plan.sunoPrompt} onChange={(event) => onUpdatePlan('sunoPrompt', event.target.value)} /></label>
            <label>피하고 싶은 음악 요소<textarea value={plan.negativePrompt} onChange={(event) => onUpdatePlan('negativePrompt', event.target.value)} /><small>예: 과도한 고음, 공격적인 드럼, 지나치게 긴 인트로</small></label>

            <div className="field-with-action"><label>커버 이미지 프롬프트<textarea value={plan.coverPrompt || ''} onChange={(event) => onUpdatePlan('coverPrompt', event.target.value)} /></label><CopyButton value={plan.coverPrompt}>커버 프롬프트 복사</CopyButton></div>
            <div className="field-with-action"><label>YouTube 제목<input value={plan.youtubeTitle || ''} onChange={(event) => onUpdatePlan('youtubeTitle', event.target.value)} /></label><CopyButton value={plan.youtubeTitle}>제목 복사</CopyButton></div>
            <div className="field-with-action"><label>YouTube 설명<textarea value={plan.youtubeDescription || ''} onChange={(event) => onUpdatePlan('youtubeDescription', event.target.value)} /></label><CopyButton value={plan.youtubeDescription}>설명 복사</CopyButton></div>

            {approved && <div className="success-box approval-box"><strong>✓ 기획 승인 완료</strong><p>다음 단계: Suno에서 곡을 생성한 뒤 MP3 또는 WAV 파일을 등록하세요.</p></div>}
            <div className="form-actions"><CopyButton value={plan.sunoPrompt}>Suno 프롬프트 복사</CopyButton><button className="primary" onClick={onApprovePlan}>{approved ? '✓ 승인 완료' : '기획 승인'}</button></div>
          </div>}
      </div>
      <div className="panel">
        <div className="panel-title"><h2>음원 버전</h2><span>{project.audioVersions?.length || 0}개</span></div>
        <label className="upload-box">MP3 또는 WAV 등록<input type="file" accept="audio/*" onChange={(event) => onAddAudio(event.target.files?.[0])} /></label>
        <div className="audio-list">{(project.audioVersions || []).map((audio, index) => <article key={audio.id} className={project.selectedAudioId === audio.id ? 'selected-audio' : ''}><div><strong>Version {String.fromCharCode(65 + index)}</strong><span>{audio.name}</span></div><audio controls src={audio.url} /><button className={project.selectedAudioId === audio.id ? '' : 'primary'} onClick={() => onSelectAudio(audio.id)}>{project.selectedAudioId === audio.id ? '최종 선택됨' : '최종 음원 선택'}</button></article>)}</div>
        {project.status === 'AUDIO_SELECTED' && <div className="success-box"><strong>Foundation MVP 완료</strong><p>이 프로젝트는 다음 단계인 앨범아트 제작으로 이동할 준비가 되었습니다.</p></div>}
      </div>
    </div>
  </section>;
}
