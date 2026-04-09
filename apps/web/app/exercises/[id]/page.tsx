import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getExerciseHistory,
  getExercises,
  getExerciseStagnation,
} from "../../../lib/api";

export const dynamic = "force-dynamic";

type ExerciseDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const { id } = await params;

  const [exercises, history, stagnation] = await Promise.all([
    getExercises(),
    getExerciseHistory(id),
    getExerciseStagnation(id),
  ]);

  const exercise = exercises.find((entry) => entry.id === id);

  if (!exercise) {
    notFound();
  }

  return (
    <main className="app-shell warm">
      <div className="container stack">
        <div className="stack">
          <Link href="/exercises" className="back-link">
            ← Back to exercises
          </Link>

          <header className="hero-card">
            <div className="hero-layout">
              <div className="hero-copy">
                <span className="badge warm">{exercise.muscleGroup}</span>
                <h1 className="page-title">{exercise.name}</h1>
                <p className="page-copy">
                  {exercise.notes || "No notes available for this exercise."}
                </p>
              </div>

              <div className={`status-card ${stagnation.stagnating ? "warn" : "good"}`}>
                <p className="status-kicker">Stagnation Status</p>
                <p className="status-title">
                  {stagnation.stagnating ? "Potential stagnation" : "Progress moving"}
                </p>
                <p className="status-copy">{stagnation.explanation}</p>
              </div>
            </div>
          </header>
        </div>

        <section className="panel">
          <div className="stack" style={{ gap: "8px", marginBottom: "20px" }}>
            <h2 className="section-title">History</h2>
            <p className="muted">
              A flat timeline of recorded sets, ready for charts and quick progress checks.
            </p>
          </div>

          {history.length === 0 ? (
            <div className="empty-state">
              No history has been logged for this exercise yet.
            </div>
          ) : (
            <div className="table-wrap">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight</th>
                    <th>Reps</th>
                    <th>Est. 1RM</th>
                    <th>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr
                      key={`${entry.performedAt}-${entry.weight}-${entry.reps}-${entry.volume}`}
                    >
                      <td>{new Date(entry.performedAt).toLocaleDateString()}</td>
                      <td>{entry.weight} kg</td>
                      <td>{entry.reps}</td>
                      <td>{entry.estimated1RM} kg</td>
                      <td>{entry.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
