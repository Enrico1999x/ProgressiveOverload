"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Exercise, ExerciseSet, Session } from "../../../lib/api";

type SessionDetailClientProps = {
  session: Session;
  exercises: Exercise[];
  initialSets: ExerciseSet[];
};

type SetFormState = {
  exerciseId: string;
  setOrder: string;
  weight: string;
  reps: string;
  rir: string;
  rpe: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

function createInitialFormState(exercises: Exercise[]): SetFormState {
  return {
    exerciseId: exercises[0]?.id ?? "",
    setOrder: "1",
    weight: "",
    reps: "",
    rir: "",
    rpe: "",
  };
}

export default function SessionDetailClient({
  session,
  exercises,
  initialSets,
}: SessionDetailClientProps) {
  const [sets, setSets] = useState(initialSets);
  const [createdSet, setCreatedSet] = useState<ExerciseSet | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<SetFormState>(() =>
    createInitialFormState(exercises),
  );

  const exerciseMap = useMemo(
    () => new Map(exercises.map((exercise) => [exercise.id, exercise])),
    [exercises],
  );

  async function refreshSets() {
    const response = await fetch(`${API_BASE_URL}/sessions/${session.id}/sets`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Could not refresh sets.");
    }

    const nextSets = (await response.json()) as ExerciseSet[];
    setSets(nextSets);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/sets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session.id,
          exerciseId: formState.exerciseId,
          setOrder: Number(formState.setOrder),
          weight: Number(formState.weight),
          reps: Number(formState.reps),
          rir: formState.rir ? Number(formState.rir) : undefined,
          rpe: formState.rpe ? Number(formState.rpe) : undefined,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string | string[] }
          | null;
        const rawMessage = payload?.message;
        const message = Array.isArray(rawMessage)
          ? rawMessage.join(", ")
          : rawMessage || "Set creation failed.";

        throw new Error(message);
      }

      const nextSet = (await response.json()) as ExerciseSet;
      setCreatedSet(nextSet);
      setStatusMessage("Exercise set created successfully.");
      await refreshSets();
      setFormState((current) => ({
        ...current,
        setOrder: String(Number(current.setOrder || "0") + 1),
        weight: "",
        reps: "",
        rir: "",
        rpe: "",
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
          <p className="eyebrow">Session Details</p>
          <h2 className="section-title">Current workout session</h2>
          <p className="muted">
            Add exercise sets directly to this session and keep the log up to date.
          </p>
        </div>

        <div className="created-session details-block">
          <dl className="details-grid">
            <div>
              <dt>Session ID</dt>
              <dd>{session.id}</dd>
            </div>
            <div>
              <dt>Performed At</dt>
              <dd>{formatDateTime(session.performedAt)}</dd>
            </div>
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
              <dt>Notes</dt>
              <dd>{session.notes || "No notes for this session."}</dd>
            </div>
          </dl>
        </div>

        <form className="session-form" onSubmit={handleSubmit}>
          <div className="stack" style={{ gap: "12px" }}>
            <p className="eyebrow">Add Set</p>
            <h3 className="section-title">Log an exercise set</h3>
          </div>

          <div className="form-grid">
            <label className="field">
              <span className="field-label">Exercise</span>
              <select
                className="field-input"
                value={formState.exerciseId}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, exerciseId: event.target.value }))
                }
                required
              >
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name} ({exercise.muscleGroup})
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field-label">Set Order</span>
              <input
                className="field-input"
                type="number"
                min="1"
                value={formState.setOrder}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, setOrder: event.target.value }))
                }
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Weight</span>
              <input
                className="field-input"
                type="number"
                min="0"
                step="0.5"
                value={formState.weight}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, weight: event.target.value }))
                }
                placeholder="80"
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Reps</span>
              <input
                className="field-input"
                type="number"
                min="1"
                step="1"
                value={formState.reps}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, reps: event.target.value }))
                }
                placeholder="8"
                required
              />
            </label>

            <label className="field">
              <span className="field-label">RIR</span>
              <input
                className="field-input"
                type="number"
                min="0"
                step="0.5"
                value={formState.rir}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, rir: event.target.value }))
                }
                placeholder="Optional"
              />
            </label>

            <label className="field">
              <span className="field-label">RPE</span>
              <input
                className="field-input"
                type="number"
                min="0"
                step="0.5"
                value={formState.rpe}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, rpe: event.target.value }))
                }
                placeholder="Optional"
              />
            </label>
          </div>

          <div className="form-actions">
            <button className="button-link button-submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Adding..." : "Add set"}
            </button>
            <span className="muted">{sets.length} set{sets.length === 1 ? "" : "s"} logged</span>
          </div>
        </form>

        {statusMessage ? <div className="feedback good">{statusMessage}</div> : null}
        {errorMessage ? <div className="feedback warn">{errorMessage}</div> : null}

        {createdSet ? (
          <div className="created-session">
            <p className="status-kicker">Latest Created Set</p>
            <dl className="details-grid">
              <div>
                <dt>Exercise</dt>
                <dd>{exerciseMap.get(createdSet.exerciseId)?.name ?? createdSet.exerciseId}</dd>
              </div>
              <div>
                <dt>Set Order</dt>
                <dd>{createdSet.setOrder}</dd>
              </div>
              <div>
                <dt>Weight</dt>
                <dd>{createdSet.weight} kg</dd>
              </div>
              <div>
                <dt>Reps</dt>
                <dd>{createdSet.reps}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </section>

      <section className="panel">
        <div className="stack" style={{ gap: "12px", marginBottom: "20px" }}>
          <p className="eyebrow">Session Sets</p>
          <h2 className="section-title">Logged sets</h2>
          <p className="muted">
            Sets are loaded from the backend and ordered by their set order.
          </p>
        </div>

        {sets.length === 0 ? (
          <div className="empty-state">No sets logged for this session yet.</div>
        ) : (
          <div className="session-list">
            {sets.map((set) => (
              <article key={set.id} className="session-item">
                <div className="session-item-header">
                  <div>
                    <p className="status-kicker">Set {set.setOrder}</p>
                    <h3 className="session-title">
                      {exerciseMap.get(set.exerciseId)?.name ?? set.exerciseId}
                    </h3>
                  </div>
                  <span className="badge accent">{set.weight} kg</span>
                </div>

                <dl className="details-grid">
                  <div>
                    <dt>Reps</dt>
                    <dd>{set.reps}</dd>
                  </div>
                  <div>
                    <dt>Exercise ID</dt>
                    <dd>{set.exerciseId}</dd>
                  </div>
                  <div>
                    <dt>RIR</dt>
                    <dd>{set.rir ?? "—"}</dd>
                  </div>
                  <div>
                    <dt>RPE</dt>
                    <dd>{set.rpe ?? "—"}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
