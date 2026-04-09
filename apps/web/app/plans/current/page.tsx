export default function CurrentPlanPage() {
  return (
    <main className="app-shell warm">
      <div className="container stack">
        <header className="stack" style={{ gap: "12px" }}>
          <p className="eyebrow">Current Plan</p>
          <h1 className="page-title">Your active workout plan</h1>
          <p className="page-copy">
            This page is the foundation for the active training flow. It gives you a
            quick overview of the current plan, the upcoming workout day, and the main
            action for starting a workout.
          </p>
        </header>

        <section className="hero-card">
          <div className="hero-layout">
            <div className="hero-copy">
              <span className="badge warm">Active Plan</span>
              <h2 className="section-title">Starter Push Pull Legs</h2>
              <p className="page-copy">
                A simple placeholder for the active plan summary. This section can later
                show interval length, progress rules, and the current phase of the plan.
              </p>
            </div>

            <div className="cta-card">
              <p className="status-kicker">Ready to Train</p>
              <p className="status-title">Next session available</p>
              <p className="status-copy">
                Use this action as the entry point into the future workout logging flow.
              </p>
              <button className="button-link button-submit current-plan-button" type="button">
                Start Workout
              </button>
            </div>
          </div>
        </section>

        <div className="grid cards current-plan-grid">
          <section className="card">
            <div className="stack" style={{ gap: "10px" }}>
              <p className="eyebrow">Active Workout Plan</p>
              <h2 className="section-title">Plan overview</h2>
              <p className="card-copy">
                This area can later show the currently active cycle, total workout days,
                and other plan metadata that helps orient the athlete before training.
              </p>
            </div>
          </section>

          <section className="card">
            <div className="stack" style={{ gap: "10px" }}>
              <p className="eyebrow">Workout Days</p>
              <h2 className="section-title">Day structure</h2>
              <p className="card-copy">
                Placeholder for the list of workout day templates like Push, Pull, and
                Legs, including which day is next in the rotation.
              </p>
            </div>
          </section>

          <section className="card">
            <div className="stack" style={{ gap: "10px" }}>
              <p className="eyebrow">Next Workout</p>
              <h2 className="section-title">Upcoming session</h2>
              <p className="card-copy">
                This section is prepared for the next step: showing the upcoming workout
                day, key exercises, and the direct handoff into the logging flow.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
