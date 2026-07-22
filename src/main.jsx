import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const STORAGE_KEY = 'bright-music-projects-v1';
const initialForm = {
  name: '',
  idea: '',
  genre: 'Dream Pop',
  mood: '몽환적, 차분함',
  bpm: '92',
  vocalType: '여성 보컬',
  language: '한국어',
  listeningContext: '늦은 밤 혼자 듣는 음악',
  negativePrompt: '과도한 고음, 공격적인 드럼, 지나치게 긴 인트로',
};

function makePlan(project) {
  const keyword = project.idea.trim() || project.name;
  return {
    titleCandidates: [
      `${project.name || '새로운 노래'}`,
      `${project.mood.split(',')[0].trim()}의 밤`,
      `${keyword.slice(0, 18)} 그리고 우리`,
    ],
    concept: `${project.listeningContext}에 어울리는 ${project.genre} 곡입니다. ${project.mood}의 정서를 유지하면서 첫 10초 안에 분위기가 드러나도록 구성합니다.`,
    lyrics: `[Verse 1]\n조용히 번지는 불빛 아래\n오늘의 마음을 천천히 놓아봐\n\n[Pre-Chorus]\n멀어진 시간 끝에서도\n나는 여전히 너를 기억해\n\n[Chorus]\n이 밤이 지나도 남아 있을 멜로디\n우리의 작은 계절을 다시 불러줘`,
    sunoPrompt: `${project.genre}, ${project.mood}, ${project.bpm} BPM, ${project.vocalType}, ${project.language}, intimate vocal, memorable chorus, short intro, polished modern production`,
    negativePrompt: project.negativePrompt,
    coverPrompt: `cinematic album cover for ${project.genre}, ${project.mood}, minimal composition, emotional night atmosphere, no text, square format`,
    youtubeTitle: `${project.name || '새 노래'} | ${project.genre} AI Music`,
    youtubeDescription: `${project.concept || project.idea}\n\nCreated with Bright Music.`,
  };
}

function loadProjects() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function App() {
  const [projects, setProjects] = useState(loadProjects);
  const [selectedId, setSelectedId] = useState(projects[0]?.id ?? null);
  const [view, setView] = useState(projects.length ? 'workspace' : 'dashboard');
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const selected = projects.find((project) => project.id === selectedId) ?? null;
  const counts = useMemo(() => ({
    total: projects.length,
    review: projects.filter((p) => p.status === 'PLAN_REVIEW' || p.status === 'AUDIO_REVIEW').length,
    audio: projects.filter((p) => p.audioVersions?.length).length,
    done: projects.filter((p) => p.status === 'AUDIO_SELECTED').length,
  }), [projects]);

  function createProject(event) {
    event.preventDefault();
    const now = new Date().toISOString();
    const project = {
      ...form,
      id: crypto.randomUUID(),
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
      plan: null,
      audioVersions: [],
      selectedAudioId: null,
    };
    setProjects((current) => [project, ...current]);
    setSelectedId(project.id);
    setForm(initialForm);
    setView('workspace');
  }

  function updateSelected(patch) {
    setProjects((current) => current.map((project) => project.id === selectedId
      ? { ...project, ...patch, updatedAt: new Date().toISOString() }
      : project));
  }

  function generatePlan() {
    if (!selected) return;
    updateSelected({ plan: makePlan(selected), status: 'PLAN_REVIEW' });
  }

  function updatePlan(field, value) {
    updateSelected({ plan: { ...selected.plan, [field]: value } });
  }

  function approvePlan() {
    updateSelected({ status: 'MUSIC_GENERATION' });
  }

  function addAudio(file) {
    if (!file || !selected) return;
    const audio = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      createdAt: new Date().toISOString(),
    };
    updateSelected({
      audioVersions: [...(selected.audioVersions || []), audio],
      status: 'AUDIO_REVIEW',
    });
  }

  function selectAudio(audioId) {
    updateSelected({ selectedAudioId: audioId, status: 'AUDIO_SELECTED' });
  }

  function deleteProject(id) {
    setProjects((current) => current.filter((project) => project.id !== id));
    if (id === selectedId) {
      const remaining = projects.filter((project) => project.id !== id);
      setSelectedId(remaining[0]?.id ?? null);
      setView('dashboard');
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand" onClick={() => setView('dashboard')}>
          <div className="brand-mark">B</div>
          <div><strong>Bright Music</strong><span>Music Operations</span></div>
        </div>
        <nav>
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>대시보드</button>
          <button className={view === 'new' ? 'active' : ''} onClick={() => setView('new')}>새 프로젝트</button>
        </nav>
        <div className="project-list">
          <p>최근 프로젝트</p>
          {projects.map((project) => (
            <button key={project.id} onClick={() => { setSelectedId(project.id); setView('workspace'); }}>
              <span>{project.name}</span><small>{statusLabel(project.status)}</small>
            </button>
          ))}
        </div>
      </aside>

      <main>
        {view === 'dashboard' && (
          <section>
            <header className="page-header"><div><p className="eyebrow">Create. Release. Grow.</p><h1>음악 제작 현황</h1></div><button className="primary" onClick={() => setView('new')}>새 음악 프로젝트</button></header>
            <div className="stats">
              <Stat label="전체 프로젝트" value={counts.total} />
              <Stat label="검토 필요" value={counts.review} />
              <Stat label="음원 등록" value={counts.audio} />
              <Stat label="최종 음원 선택" value={counts.done} />
            </div>
            <div className="panel">
              <div className="panel-title"><h2>프로젝트</h2><span>{projects.length}개</span></div>
              {projects.length === 0 ? <Empty onCreate={() => setView('new')} /> : projects.map((project) => (
                <article className="project-row" key={project.id}>
                  <button className="project-open" onClick={() => { setSelectedId(project.id); setView('workspace'); }}>
                    <div><strong>{project.name}</strong><span>{project.genre} · {project.mood}</span></div>
                    <span className="status">{statusLabel(project.status)}</span>
                  </button>
                  <button className="danger-link" onClick={() => deleteProject(project.id)}>삭제</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {view === 'new' && (
          <section className="narrow">
            <header className="page-header"><div><p className="eyebrow">New Project</p><h1>새 음악 기획</h1><p>아이디어를 입력하면 가사와 Suno 프롬프트를 한 번에 준비합니다.</p></div></header>
            <form className="panel form-grid" onSubmit={createProject}>
              <label className="full">프로젝트명<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="예: 새벽의 온도" /></label>
              <label className="full">음악 아이디어<textarea required value={form.idea} onChange={(e) => setForm({ ...form, idea: e.target.value })} placeholder="어떤 음악을 만들고 싶은지 적어주세요." /></label>
              <label>장르<input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} /></label>
              <label>분위기<input value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })} /></label>
              <label>BPM<input type="number" min="40" max="220" value={form.bpm} onChange={(e) => setForm({ ...form, bpm: e.target.value })} /></label>
              <label>보컬 방향<input value={form.vocalType} onChange={(e) => setForm({ ...form, vocalType: e.target.value })} /></label>
              <label>언어<input value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} /></label>
              <label>청취 상황<input value={form.listeningContext} onChange={(e) => setForm({ ...form, listeningContext: e.target.value })} /></label>
              <label className="full">금지 요소<textarea value={form.negativePrompt} onChange={(e) => setForm({ ...form, negativePrompt: e.target.value })} /></label>
              <div className="form-actions full"><button type="button" onClick={() => setView('dashboard')}>취소</button><button className="primary" type="submit">프로젝트 만들기</button></div>
            </form>
          </section>
        )}

        {view === 'workspace' && selected && (
          <section>
            <header className="page-header"><div><p className="eyebrow">{statusLabel(selected.status)}</p><h1>{selected.name}</h1><p>{selected.genre} · {selected.mood} · {selected.bpm} BPM</p></div><button onClick={() => setView('dashboard')}>목록으로</button></header>
            <div className="workflow-steps">
              {['DRAFT', 'PLAN_REVIEW', 'MUSIC_GENERATION', 'AUDIO_REVIEW', 'AUDIO_SELECTED'].map((status, index) => <div key={status} className={stepActive(selected.status, status) ? 'complete' : ''}><span>{index + 1}</span>{statusLabel(status)}</div>)}
            </div>

            <div className="workspace-grid">
              <div className="panel">
                <div className="panel-title"><h2>AI 음악 기획</h2>{!selected.plan && <button className="primary" onClick={generatePlan}>기획 생성</button>}</div>
                {!selected.plan ? <p className="muted">아직 생성된 기획이 없습니다. 입력한 아이디어를 기준으로 기획 초안을 만드세요.</p> : (
                  <div className="plan-fields">
                    <label>제목 후보<textarea value={selected.plan.titleCandidates.join('\n')} onChange={(e) => updatePlan('titleCandidates', e.target.value.split('\n').filter(Boolean))} /></label>
                    <label>곡 콘셉트<textarea value={selected.plan.concept} onChange={(e) => updatePlan('concept', e.target.value)} /></label>
                    <label>가사<textarea className="lyrics" value={selected.plan.lyrics} onChange={(e) => updatePlan('lyrics', e.target.value)} /></label>
                    <label>Suno 프롬프트<textarea value={selected.plan.sunoPrompt} onChange={(e) => updatePlan('sunoPrompt', e.target.value)} /></label>
                    <label>부정 프롬프트<textarea value={selected.plan.negativePrompt} onChange={(e) => updatePlan('negativePrompt', e.target.value)} /></label>
                    <div className="form-actions"><button onClick={() => navigator.clipboard?.writeText(selected.plan.sunoPrompt)}>프롬프트 복사</button><button className="primary" onClick={approvePlan}>기획 승인</button></div>
                  </div>
                )}
              </div>

              <div className="panel">
                <div className="panel-title"><h2>음원 버전</h2><span>{selected.audioVersions?.length || 0}개</span></div>
                <label className="upload-box">MP3 또는 WAV 등록<input type="file" accept="audio/*" onChange={(e) => addAudio(e.target.files?.[0])} /></label>
                <div className="audio-list">
                  {(selected.audioVersions || []).map((audio, index) => (
                    <article key={audio.id} className={selected.selectedAudioId === audio.id ? 'selected-audio' : ''}>
                      <div><strong>Version {String.fromCharCode(65 + index)}</strong><span>{audio.name}</span></div>
                      <audio controls src={audio.url} />
                      <button className={selected.selectedAudioId === audio.id ? '' : 'primary'} onClick={() => selectAudio(audio.id)}>{selected.selectedAudioId === audio.id ? '최종 선택됨' : '최종 음원 선택'}</button>
                    </article>
                  ))}
                </div>
                {selected.status === 'AUDIO_SELECTED' && <div className="success-box"><strong>Foundation MVP 완료</strong><p>이 프로젝트는 다음 단계인 앨범아트 제작으로 이동할 준비가 되었습니다.</p></div>}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong></div>;
}

function Empty({ onCreate }) {
  return <div className="empty"><div className="empty-icon">♫</div><h3>첫 음악 프로젝트를 만들어보세요</h3><p>아이디어부터 Suno 프롬프트와 최종 음원 선택까지 관리할 수 있습니다.</p><button className="primary" onClick={onCreate}>프로젝트 시작</button></div>;
}

const labels = {
  DRAFT: '초안',
  PLAN_REVIEW: '기획 검토',
  MUSIC_GENERATION: 'Suno 생성',
  AUDIO_REVIEW: '음원 검토',
  AUDIO_SELECTED: '최종 음원 선택',
};
function statusLabel(status) { return labels[status] || status; }
function stepActive(current, target) {
  const order = Object.keys(labels);
  return order.indexOf(current) >= order.indexOf(target);
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
