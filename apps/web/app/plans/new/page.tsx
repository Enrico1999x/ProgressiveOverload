export default function NewPlanPage() {
  return (
    <main className="app-shell sky">
      <div className="container stack">
        <header className="stack" style={{ gap: "12px" }}>
          <p className="eyebrow">Workout Planning</p>
          <h1 className="page-title">Create a new workout plan</h1>
          <p className="page-copy">
            This is the starting point for building a new training plan. The UI is
            intentionally simple for now, but already structured like the future plan
            creation flow.
          </p>
        </header>

        <section className="hero-card">
          <div className="hero-layout">
            <div className="hero-copy">
              <span className="badge accent">New Plan</span>
              <h2 className="section-title">Build the next training cycle</h2>
              <p className="page-copy">
                Use this page as the future form for creating a plan with workout days,
                structure, and progression rules.
              </p>
            </div>

            <div className="cta-card">
              <p className="status-kicker">Plan Setup</p>
              <p className="status-title">Draft your structure first</p>
              <p className="status-copy">
                Start with the core metadata, then expand into workout-day-specific
                exercises and progression.
              </p>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="stack" style={{ gap: "20px" }}>
            <div className="stack" style={{ gap: "8px" }}>
              <h2 className="section-title">Plan structure</h2>
              <p className="muted">
                Placeholder fields for the initial plan form. The next step is wiring
                these inputs to backend endpoints for plan creation.
              </p>
            </div>

            <div className="form-grid">
              <label className="field">
                <span className="field-label">Plan Name</span>
                <input
                  className="field-input"
                  defaultValue="Starter Push Pull Legs"
                  placeholder="e.g. Upper Lower Split"
                />
              </label>

              <label className="field">
                <span className="field-label">Interval Length In Days</span>
                <input
                  className="field-input"
                  defaultValue="7"
                  min="1"
                  step="1"
                  type="number"
                />
              </label>

              <label className="field">
                <span className="field-label">Number Of Training Days</span>
                <input
                  className="field-input"
                  defaultValue="3"
                  min="1"
                  step="1"
                  type="number"
                />
              </label>
            </div>

            <div className="stack" style={{ gap: "12px" }}>
              <p className="eyebrow">Workout Day Names</p>
              <div className="form-grid">
                <label className="field">
                  <span className="field-label">Workout Day 1</span>
                  <input className="field-input" defaultValue="Push" />
                </label>
                <label className="field">
                  <span className="field-label">Workout Day 2</span>
                  <input className="field-input" defaultValue="Pull" />
                </label>
                <label className="field">
                  <span className="field-label">Workout Day 3</span>
                  <input className="field-input" defaultValue="Legs" />
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button className="button-link button-submit" type="button">
                Continue plan setup
              </button>
              <span className="muted">
                Persistence will be connected in the next backend integration step.
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
