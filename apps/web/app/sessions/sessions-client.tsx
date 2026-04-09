"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "../../lib/api";

type SessionsClientProps = {
  initialSessions: Session[];
};

type SessionFormState = {
  userId: string;
  cycleId: string;
  workoutDayTemplateId: string;
  performedAt: string;
  notes: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function createDefaultPerformedAt() {
  return new Date().toISOString().slice(0, 16);
}

function formatDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

export default function SessionsClient({ initialSessions }: SessionsClientProps) {
  const [sessions, setSessions] = useState(initialSessions);
  const [createdSession, setCreatedSession] = useState<Session | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<SessionFormState>({
    userId: "",
    cycleId: "",
    workoutDayTemplateId: "",
    performedAt: "",
    notes: "",
  });

  useEffect(() => {
    setFormState((current) => (
      current.performedAt
        ? current
        : { ...current, performedAt: createDefaultPerformedAt() }
    ));
  }, []);

  const sessionsCountLabel = useMemo(
    () => `${sessions.length} session${sessions.length === 1 ? "" : "s"} loaded`,
    [sessions.length],
  );

  async function refreshSessions() {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Could not refresh sessions.");
    }

    const nextSessions = (await response.json()) as Session[];
    setSessions(nextSessions);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: formState.userId,
          cycleId: formState.cycleId,
          workoutDayTemplateId: formState.workoutDayTemplateId,
          performedAt: new Date(formState.performedAt).toISOString(),
          notes: formState.notes.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string | string[] }
          | null;
        const rawMessage = payload?.message;
        const message = Array.isArray(rawMessage)
          ? rawMessage.join(", ")
          : rawMessage || "Session creation failed.";

        throw new Error(message);
      }

      const session = (await response.json()) as Session;
      setCreatedSession(session);
      setStatusMessage("Workout session created successfully.");
      await refreshSessions();
      setFormState((current) => ({
        ...current,
        performedAt: createDefaultPerformedAt(),
        notes: "",
      }));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="split-layout">
      <section className="panel">
        <div className="stack" style={{ gap: "12px" }}>
          <p className="eyebrow">Create Session</p>
          <h2 className="section-title">Log a workout session</h2>
          <p className="muted">
            Start simple: enter the IDs you already use in the backend and create a
            session directly from the UI.
          </p>
        </div>

        <form className="session-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="field">
              <span className="field-label">User ID</span>
              <input
                className="field-input"
                value={formState.userId}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, userId: event.target.value }))
                }
                placeholder="385c01db-..."
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Cycle ID</span>
              <input
                className="field-input"
                value={formState.cycleId}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, cycleId: event.target.value }))
                }
                placeholder="6be32e61-..."
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Workout Day Template ID</span>
              <input
                className="field-input"
                value={formState.workoutDayTemplateId}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    workoutDayTemplateId: event.target.value,
                  }))
                }
                placeholder="4cc9e9fd-..."
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Performed At</span>
              <input
                className="field-input"
                type="datetime-local"
                value={formState.performedAt}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    performedAt: event.target.value,
                  }))
                }
                required
              />
            </label>
          </div>

          <label className="field">
            <span className="field-label">Notes</span>
            <textarea
              className="field-input field-textarea"
              value={formState.notes}
              onChange={(event) =>
                setFormState((current) => ({ ...current, notes: event.target.value }))
              }
              placeholder="Optional notes for the session"
              rows={4}
            />
          </label>

          <div className="form-actions">
            <button className="button-link button-submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating..." : "Create session"}
            </button>
            <span className="muted">{sessionsCountLabel}</span>
          </div>
        </form>

        {statusMessage ? <div className="feedback good">{statusMessage}</div> : null}
        {errorMessage ? <div className="feedback warn">{errorMessage}</div> : null}

        {createdSession ? (
          <div className="created-session">
            <p className="status-kicker">Latest Created Session</p>
            <dl className="details-grid">
              <div>
                <dt>ID</dt>
                <dd>{createdSession.id}</dd>
              </div>
              <div>
                <dt>Performed At</dt>
                <dd>{formatDateTime(createdSession.performedAt)}</dd>
              </div>
              <div>
                <dt>Cycle ID</dt>
                <dd>{createdSession.cycleId}</dd>
              </div>
              <div>
                <dt>Template ID</dt>
                <dd>{createdSession.workoutDayTemplateId}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </section>

      <section className="panel">
        <div className="stack" style={{ gap: "12px", marginBottom: "20px" }}>
          <p className="eyebrow">Sessions</p>
          <h2 className="section-title">All workout sessions</h2>
          <p className="muted">
            This list refreshes automatically after a successful session creation.
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="empty-state">No sessions recorded yet.</div>
        ) : (
          <div className="session-list">
            {sessions.map((session) => (
              <article key={session.id} className="session-item">
                <div className="session-item-header">
                  <div>
                    <p className="status-kicker">Session</p>
                    <h3 className="session-title">{session.id}</h3>
                  </div>
                  <span className="badge accent">
                    {formatDate(session.performedAt)}
                  </span>
                </div>

                <dl className="details-grid">
                  <div>
                    <dt>User ID</dt>
                    <dd>{session.userId}</dd>
                  </div>
                  <div>
                    <dt>Cycle ID</dt>
                    <dd>{session.cycleId}</dd>
                  </div>
                  <div>
                    <dt>Template ID</dt>
                    <dd>{session.workoutDayTemplateId}</dd>
                  </div>
                  <div>
                    <dt>Performed At</dt>
                    <dd>{formatDateTime(session.performedAt)}</dd>
                  </div>
                </dl>

                <p className="card-copy">
                  {session.notes || "No notes for this session."}
                </p>

                <Link href={`/sessions/${session.id}`} className="button-link">
                  Open session
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
