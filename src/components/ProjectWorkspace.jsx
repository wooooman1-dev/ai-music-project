import { projectStatusOrder, statusLabel, stepActive } from '../data/projectModel';

export default function ProjectWorkspace({ project, onBack, onGeneratePlan, onUpdatePlan, onApprovePlan, onAddAudio, onSelectAudio }) {
  return <section>
    <header className="page-header"><div><p className="eyebrow">{statusLabel(project.status)}</p><h1>{project.name}</h1><p>{project.genre} · {project.mood} · {project.bpm} BPM</p></div><button onClick={onBack}>목록으로</button></header>
    <div className="workflow-steps">{projectStatusOrder.map((status, index) => <div key={status} className={stepActive(project.status, status) ? 'complete' : ''}><span>{index + 1}</span>{statusLabel(status)}</div>)}</div>
    <div className="workspace-grid">
      <div className="panel">
        <div className="panel-title"><h2>AI 음악 기획</h2>{!project.plan && <button className="primary" onClick={onGeneratePlan}>기획 생성</button>}</div>
        {!project.plan ? <p className="muted">아직 생성된 기획이 없습니다. 입력한 아이디어를 기준으로 기획 초안을 만드세요.</p> : <div className="plan-fields">
          <label>제목 후보<textarea value={project.plan.titleCandidates.join('\n')} onChange={(event) => onUpdatePlan('titleCandidates', event.target.value.split('\n').filter(Boolean))} /></label>
          <label>곡 콘셉트<textarea value={project.plan.concept} onChange={(event) => onUpdatePlan('concept', event.target.value)} /></label>
          <label>가사<textarea className="lyrics" value={project.plan.lyrics} onChange={(event) => onUpdatePlan('lyrics', event.target.value)} /></label>
          <label>Suno 프롬프트<textarea value={project.plan.sunoPrompt} onChange={(event) => onUpdatePlan('sunoPrompt', event.target.value)} /></label>
          <label>부정 프롬프트<textarea value={project.plan.negativePrompt} onChange={(event) => onUpdatePlan('negativePrompt', event.target.value)} /></label>
          <div className="form-actions"><button onClick={() => navigator.clipboard?.writeText(project.plan.sunoPrompt)}>프롬프트 복사</button><button className="primary" onClick={onApprovePlan}>기획 승인</button></div>
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
