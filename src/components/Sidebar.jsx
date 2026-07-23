import { statusLabel } from '../data/projectModel';

export default function Sidebar({ projects, selectedId, view, onDashboard, onNewProject, onOpenProject }) {
  return <aside className="sidebar">
    <div className="brand" onClick={onDashboard}><div className="brand-mark">B</div><div><strong>Bright Music</strong><span>Music Operations</span></div></div>
    <nav><button className={view === 'dashboard' ? 'active' : ''} onClick={onDashboard}>대시보드</button><button className={view === 'new' ? 'active' : ''} onClick={onNewProject}>새 프로젝트</button></nav>
    <div className="project-list"><p>최근 프로젝트</p>{projects.map((project) => <button key={project.id} className={selectedId === project.id && view === 'workspace' ? 'active' : ''} onClick={() => onOpenProject(project.id)}><span>{project.name}</span><small>{statusLabel(project.status)}</small></button>)}</div>
  </aside>;
}
