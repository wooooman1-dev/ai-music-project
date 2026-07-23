import { projectStatusOrder, statusLabel, stepActive } from '../data/projectModel';

function CopyButton({ value, children }) {
  return <button type="button" onClick={() => navigator.clipboard?.writeText(value || '')}>{children}</button>;
}

export default function ProjectWorkspace({ project, onBack, onGeneratePlan, onUpdatePlan, onApprovePlan, onAddAudio, onSelectAudio }) {
  const plan = project.plan;
  const lyricsMode = plan?.lyricsMode || 'suno';
  const approved = Boolean(project.planApprovedAt) && project.status !== 'PLAN_REVIEW';

  return <section>
    <header className="page-header"><div><p className="eyebrow">{statusLabel(project.status)}</p><h1>{project.name}</h1><p>{project.genre} · {project.mood} · {project.bpm} BPM</p></div><button onClick={onBack}>목록으로</button></header>
    <div className="workflow-steps">{projectStatusOrder.map((status, index) => <div key={status} className={stepActive(project.status, status) ? 'complete' : ''}><span>{index + 1}</span>{statusLabel(status)}</div>)}</div>
    <div className="workspace-grid">
      <div className="panel">
        <div className="panel-title"><div><h2>AI 음악 기획</h2>{plan?.generationSource === 'template' && <p className="source-note">현재는 기본 템플릿으로 생성됩니다. AI 연동은 다음 단계입니다.</p>}</div>{!plan && <button className="primary" onClick={onGeneratePlan}>기획 생성</button>}</div>
        {!plan ? <p className="muted">아직 생성된 기획이 없습니다. 입력한 아이디어를 기준으로 기획 초안을 만드세요.</p> : <div className="plan-fields">
          <label>제목 후보<textarea value={plan.titleCandidates.join('\n')} onChange={(event) => onUpdatePlan('titleCandidates', event.target.value.split('\n').filter(Boolean))} /></label>
          <label>곡 콘셉트<textarea value={plan.concept} onChange={(event) => onUpdatePlan('concept', event.target.value)} /></label>

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
