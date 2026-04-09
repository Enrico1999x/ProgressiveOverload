const API_BASE_URL =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type Exercise = {
  id: string;
  userId: string;
  name: string;
  muscleGroup: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExerciseHistoryPoint = {
  weight: number;
  reps: number;
  estimated1RM: number;
  volume: number;
  performedAt: string;
};

export type ExerciseStagnation = {
  stagnating: boolean;
  explanation: string;
};

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed for ${path} with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getExercises() {
  return apiFetch<Exercise[]>("/exercises");
}

export function getExerciseHistory(id: string) {
  return apiFetch<ExerciseHistoryPoint[]>(`/exercises/${id}/history`);
}

export function getExerciseStagnation(id: string) {
  return apiFetch<ExerciseStagnation>(`/exercises/${id}/stagnation`);
}
