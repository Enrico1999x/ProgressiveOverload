import Link from "next/link";
import { notFound } from "next/navigation";
import { getExercises, getSession, getSessionSets } from "../../../lib/api";
import SessionDetailClient from "./session-detail-client";

export const dynamic = "force-dynamic";

type SessionDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { id } = await params;
  let session;
  let sets;
  let exercises;

  try {
    [session, sets, exercises] = await Promise.all([
      getSession(id),
      getSessionSets(id),
      getExercises(),
    ]);
  } catch {
    notFound();
  }

  return (
    <main className="app-shell warm">
      <div className="container stack">
        <header className="stack" style={{ gap: "12px" }}>
          <Link href="/sessions" className="back-link">
            ← Back to sessions
          </Link>
          <p className="eyebrow">Workout Session</p>
          <h1 className="page-title">Session detail</h1>
          <p className="page-copy">
            Add exercise sets to the current session and review what has already been
            logged.
          </p>
        </header>

        <SessionDetailClient
          exercises={exercises}
          initialSets={sets}
          session={session}
        />
      </div>
    </main>
  );
}
