import { useEffect, useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import ProjectForm from './components/ProjectForm';
import ProjectWorkspace from './components/ProjectWorkspace';
import Sidebar from './components/Sidebar';
import { createMusicProject, createPlanningDraft, initialProjectForm, statusLabel } from './data/projectModel';
import { loadProjects, saveProjects } from './utils/projectStorage';

export default function App() {
  const [projects, setProjects] = useState(loadProjects);
  const [selectedId, setSelectedId] = useState(projects[0]?.id ?? null);
  const [view, setView] = useState(projects.length ? 'workspace' : 'dashboard');
  const [form, setForm] = useState(initialProjectForm);

  useEffect(() => { saveProjects(projects); }, [projects]);

  const selected = projects.find((project) => project.id === selectedId) ?? null;
  const counts = useMemo(() => ({
    total: projects.length,
    review: projects.filter((project) => project.status === 'PLAN_REVIEW' || project.status === 'AUDIO_REVIEW').length,
    audio: projects.filter((project) => project.audioVersions?.length).length,
    done: projects.filter((project) => project.status === 'AUDIO_SELECTED').length,
  }), [projects]);

  function openProject(id) { setSelectedId(id); setView('workspace'); }

  function createProject(event) {
    event.preventDefault();
    const project = createMusicProject(form);
    setProjects((current) => [project, ...current]);
    setSelectedId(project.id);
    setForm(initialProjectForm);
    setView('workspace');
  }

  function updateSelected(patch) {
    setProjects((current) => current.map((project) => project.id === selectedId ? { ...project, ...patch, updatedAt: new Date().toISOString() } : project));
  }

  function generatePlan() {
    if (!selected) return;
    updateSelected({ plan: createPlanningDraft(selected), status: 'PLAN_REVIEW' });
  }

  function updatePlan(field, value) {
    if (!selected?.plan) return;
    updateSelected({ plan: { ...selected.plan, [field]: value } });
  }

  function approvePlan() { updateSelected({ status: 'MUSIC_GENERATION' }); }

  function addAudio(file) {
    if (!file || !selected) return;
    const audio = { id: crypto.randomUUID(), name: file.name, size: file.size, type: file.type, url: URL.createObjectURL(file), createdAt: new Date().toISOString() };
    updateSelected({ audioVersions: [...(selected.audioVersions || []), audio], status: 'AUDIO_REVIEW' });
  }

  function selectAudio(audioId) { updateSelected({ selectedAudioId: audioId, status: 'AUDIO_SELECTED' }); }

  function deleteProject(id) {
    setProjects((current) => current.filter((project) => project.id !== id));
    if (id === selectedId) {
      const remaining = projects.filter((project) => project.id !== id);
      setSelectedId(remaining[0]?.id ?? null);
      setView('dashboard');
    }
  }

  return <div className="app-shell">
    <Sidebar projects={projects} selectedId={selectedId} view={view} onDashboard={() => setView('dashboard')} onNewProject={() => setView('new')} onOpenProject={openProject} />
    <main>
      {view === 'dashboard' && <Dashboard projects={projects} counts={counts} onCreate={() => setView('new')} onOpenProject={openProject} onDeleteProject={deleteProject} statusLabel={statusLabel} />}
      {view === 'new' && <ProjectForm form={form} onFormChange={setForm} onSubmit={createProject} onCancel={() => setView('dashboard')} />}
      {view === 'workspace' && selected && <ProjectWorkspace project={selected} onBack={() => setView('dashboard')} onGeneratePlan={generatePlan} onUpdatePlan={updatePlan} onApprovePlan={approvePlan} onAddAudio={addAudio} onSelectAudio={selectAudio} />}
    </main>
  </div>;
}
