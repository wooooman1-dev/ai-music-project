export default function ProjectForm({ form, onFormChange, onSubmit, onCancel }) {
  const update = (field, value) => onFormChange({ ...form, [field]: value });

  return <section className="narrow">
    <header className="page-header"><div><p className="eyebrow">New Project</p><h1>새 음악 기획</h1><p>아이디어를 입력하면 가사와 Suno 프롬프트를 한 번에 준비합니다.</p></div></header>
    <form className="panel form-grid" onSubmit={onSubmit}>
      <label className="full">프로젝트명<input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="예: 새벽의 온도" /></label>
      <label className="full">음악 아이디어<textarea required value={form.idea} onChange={(event) => update('idea', event.target.value)} placeholder="어떤 음악을 만들고 싶은지 적어주세요." /></label>
      <label>장르<input value={form.genre} onChange={(event) => update('genre', event.target.value)} /></label>
      <label>분위기<input value={form.mood} onChange={(event) => update('mood', event.target.value)} /></label>
      <label>BPM<input type="number" min="40" max="220" value={form.bpm} onChange={(event) => update('bpm', event.target.value)} /></label>
      <label>보컬 방향<input value={form.vocalType} onChange={(event) => update('vocalType', event.target.value)} /></label>
      <label>언어<input value={form.language} onChange={(event) => update('language', event.target.value)} /></label>
      <label>청취 상황<input value={form.listeningContext} onChange={(event) => update('listeningContext', event.target.value)} /></label>
      <label className="full">금지 요소<textarea value={form.negativePrompt} onChange={(event) => update('negativePrompt', event.target.value)} /></label>
      <div className="form-actions full"><button type="button" onClick={onCancel}>취소</button><button className="primary" type="submit">프로젝트 만들기</button></div>
    </form>
  </section>;
}
