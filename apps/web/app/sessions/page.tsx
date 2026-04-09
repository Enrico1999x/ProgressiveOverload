import Link from "next/link";
import { getSessions } from "../../lib/api";
import SessionsClient from "./sessions-client";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const sessions = await getSessions();

  return (
    <main className="app-shell sky">
      <div className="container stack">
        <header className="stack" style={{ gap: "12px" }}>
          <Link href="/exercises" className="back-link">
            ← Back to exercises
          </Link>
          <p className="eyebrow">Workout Sessions</p>
          <h1 className="page-title">Session workflow</h1>
          <p className="page-copy">
            Create workout sessions directly from the frontend and verify them in the
            live session list below.
          </p>
        </header>

        <SessionsClient initialSessions={sessions} />
      </div>
    </main>
  );
}
