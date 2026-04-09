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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function createChartPoints(
  values: number[],
  width: number,
  height: number,
  paddingX = 20,
  paddingY = 12,
) {
  if (values.length === 0) {
    return [];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const drawableWidth = width - paddingX * 2;
  const drawableHeight = height - paddingY * 2;

  return values.map((value, index) => {
    const x =
      values.length === 1
        ? width / 2
        : paddingX + (index / (values.length - 1)) * drawableWidth;
    const y = paddingY + drawableHeight - ((value - min) / range) * drawableHeight;

    return {
      value,
      x,
      y,
    };
  });
}

function buildLinePath(points: Array<{ x: number; y: number }>) {
  if (points.length <= 1) {
    return "";
  }

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
}

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

  const oneRmValues = history.map((entry) => entry.estimated1RM);
  const volumeValues = history.map((entry) => entry.volume);
  const oneRmPoints = createChartPoints(oneRmValues, 420, 180);
  const volumePoints = createChartPoints(volumeValues, 420, 180);
  const oneRmPath = buildLinePath(oneRmPoints);
  const volumePath = buildLinePath(volumePoints);
  const chartDateLabels = history.map((entry, index) => ({
    label: formatDate(entry.performedAt),
    x:
      history.length === 1
        ? 210
        : 20 + (index / (history.length - 1)) * 380,
  }));

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
            <h2 className="section-title">Progress</h2>
            <p className="muted">
              A simple visual trend of estimated 1RM and volume across recorded history.
            </p>
          </div>

          {history.length === 0 ? (
            <div className="empty-state">
              Add sets for this exercise to unlock the progress graph.
            </div>
          ) : (
            <div className="graph-grid">
              <article className="graph-card">
                <div className="graph-header">
                  <div>
                    <p className="status-kicker">Estimated 1RM</p>
                    <h3 className="graph-title">Strength trend</h3>
                  </div>
                  <span className="badge accent">
                    {history[history.length - 1]?.estimated1RM ?? 0} kg
                  </span>
                </div>
                <svg
                  className="progress-graph"
                  viewBox="0 0 420 220"
                  role="img"
                  aria-label="Estimated one rep max trend"
                >
                  <path className="graph-grid-line" d="M 20 168 L 400 168" />
                  <path className="graph-grid-line" d="M 20 90 L 400 90" />
                  <path className="graph-line line-one-rm" d={oneRmPath} />
                  {oneRmPoints.map((point, index) => (
                    <g key={`one-rm-${point.x}-${point.y}`}>
                      <circle
                        className="graph-point point-one-rm"
                        cx={point.x}
                        cy={point.y}
                        r="4"
                      />
                      <text className="graph-value-label" x={point.x} y={point.y - 10}>
                        {oneRmValues[index]}
                      </text>
                    </g>
                  ))}
                  {chartDateLabels.map((tick) => (
                    <text
                      key={`one-rm-tick-${tick.x}-${tick.label}`}
                      className="graph-axis-label"
                      x={tick.x}
                      y="198"
                    >
                      {tick.label}
                    </text>
                  ))}
                </svg>
              </article>

              <article className="graph-card">
                <div className="graph-header">
                  <div>
                    <p className="status-kicker">Volume</p>
                    <h3 className="graph-title">Workload trend</h3>
                  </div>
                  <span className="badge warm">
                    {history[history.length - 1]?.volume ?? 0}
                  </span>
                </div>
                <svg
                  className="progress-graph"
                  viewBox="0 0 420 220"
                  role="img"
                  aria-label="Volume trend"
                >
                  <path className="graph-grid-line" d="M 20 168 L 400 168" />
                  <path className="graph-grid-line" d="M 20 90 L 400 90" />
                  <path className="graph-line line-volume" d={volumePath} />
                  {volumePoints.map((point, index) => (
                    <g key={`volume-${point.x}-${point.y}`}>
                      <circle
                        className="graph-point point-volume"
                        cx={point.x}
                        cy={point.y}
                        r="4"
                      />
                      <text className="graph-value-label" x={point.x} y={point.y - 10}>
                        {volumeValues[index]}
                      </text>
                    </g>
                  ))}
                  {chartDateLabels.map((tick) => (
                    <text
                      key={`volume-tick-${tick.x}-${tick.label}`}
                      className="graph-axis-label"
                      x={tick.x}
                      y="198"
                    >
                      {tick.label}
                    </text>
                  ))}
                </svg>
              </article>
            </div>
          )}
        </section>

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
                      <td>{formatDate(entry.performedAt)}</td>
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
