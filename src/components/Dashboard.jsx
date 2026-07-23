function Stat({ label, value }) { return <div className="stat"><span>{label}</span><strong>{value}</strong></div>; }
function Empty({ onCreate }) { return <div className="empty"><div className="empty-icon">♫</div><h3>첫 음악 프로젝트를 만들어보세요</h3><p>아이디어부터 Suno 프롬프트와 최종 음원 선택까지 관리할 수 있습니다.</p><button className="primary" onClick={onCreate}>프로젝트 시작</button></div>; }

export default function Dashboard({ projects, counts, onCreate, onOpenProject, onDeleteProject, statusLabel }) {
  return <section>
    <header className="page-header"><div><p className="eyebrow">Create. Release. Grow.</p><h1>음악 제작 현황</h1></div><button className="primary" onClick={onCreate}>새 음악 프로젝트</button></header>
    <div className="stats"><Stat label="전체 프로젝트" value={counts.total} /><Stat label="검토 필요" value={counts.review} /><Stat label="음원 등록" value={counts.audio} /><Stat label="최종 음원 선택" value={counts.done} /></div>
    <div className="panel"><div className="panel-title"><h2>프로젝트</h2><span>{projects.length}개</span></div>{projects.length === 0 ? <Empty onCreate={onCreate} /> : projects.map((project) => <article className="project-row" key={project.id}><button className="project-open" onClick={() => onOpenProject(project.id)}><div><strong>{project.name}</strong><span>{project.genre} · {project.mood}</span></div><span className="status">{statusLabel(project.status)}</span></button><button className="danger-link" onClick={() => onDeleteProject(project.id)}>삭제</button></article>)}</div>
  </section>;
}
