import Link from "next/link";
import { getExercises } from "../../lib/api";

export const dynamic = "force-dynamic";

export default async function ExercisesPage() {
  const exercises = await getExercises();

  return (
    <main className="app-shell sky">
      <div className="container stack">
        <header className="stack" style={{ gap: "12px" }}>
          <p className="eyebrow">Progressive Overload</p>
          <h1 className="page-title">Exercises</h1>
          <p className="page-copy">
            Browse your tracked exercises and jump into history and stagnation signals
            for each movement.
          </p>
        </header>

        <section className="grid cards">
          {exercises.map((exercise) => (
            <article key={exercise.id} className="card">
              <div>
                <span className="badge accent">{exercise.muscleGroup}</span>
                <h2 className="card-title">{exercise.name}</h2>
              </div>

              <p className="card-copy">
                {exercise.notes || "No notes yet for this exercise."}
              </p>

              <Link href={`/exercises/${exercise.id}`} className="button-link">
                View details
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
