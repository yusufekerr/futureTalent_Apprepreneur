"use client";

import { useCallback, useEffect, useState } from "react";

type Goal = {
  id: string;
  text: string;
  completed: boolean;
  date: string;
};

const STORAGE_KEY = "ai-study-tracker-goals";

function parseGoals(data: unknown): Goal[] {
  if (!Array.isArray(data)) return [];
  return data.filter(
    (item): item is Goal =>
      item !== null &&
      typeof item === "object" &&
      "id" in item &&
      "text" in item &&
      "completed" in item &&
      "date" in item &&
      typeof (item as Goal).id === "string" &&
      typeof (item as Goal).text === "string" &&
      typeof (item as Goal).completed === "boolean" &&
      typeof (item as Goal).date === "string",
  );
}

export function StudyTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState("");
  const [advice, setAdvice] = useState<string | null>(null);
  const [adviceError, setAdviceError] = useState<string | null>(null);
  const [adviceLoading, setAdviceLoading] = useState(false);

  const addGoal = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setGoals((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        date: new Date().toISOString(),
      },
    ]);
    setInput("");
  }, [input]);

  const toggleCompleted = useCallback((id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)),
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const fetchAdvice = useCallback(async () => {
    setAdviceLoading(true);
    setAdvice(null);
    setAdviceError(null);
    try {
      const res = await fetch("/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goals: goals.map((g) => ({
            title: g.text,
            completed: g.completed,
            date: g.date,
          })),
        }),
      });
      const data: unknown = await res.json();
      const payload = data as { message?: string; error?: string };
      if (!res.ok) {
        setAdviceError(
          typeof payload.error === "string" ? payload.error : "Bir hata oluştu.",
        );
        return;
      }
      setAdvice(
        typeof payload.message === "string" ? payload.message : "",
      );
    } catch {
      setAdviceError("Bağlantı sorunu. Tekrar deneyin.");
    } finally {
      setAdviceLoading(false);
    }
  }, [goals]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setGoals(parseGoals(JSON.parse(raw)));
    } catch {
      // ignore invalid JSON
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals, hydrated]);

  const totalGoals = goals.length;
  const completedCount = goals.filter((g) => g.completed).length;
  const progressPercent =
    totalGoals > 0 ? Math.round((completedCount / totalGoals) * 100) : 0;

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="w-full max-w-xl">
        <div className="rounded-3xl border border-zinc-200/90 bg-white/95 p-8 shadow-xl shadow-zinc-900/[0.06] ring-1 ring-zinc-950/[0.04] backdrop-blur-sm dark:border-zinc-800/90 dark:bg-zinc-900/95 dark:shadow-black/30 dark:ring-white/[0.06] sm:p-10">
          <header className="mb-10 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              AI Study Tracker
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              Add goals, check them off, and get AI suggestions when you need a nudge.
            </p>
          </header>

          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <label className="sr-only" htmlFor="goal-input">
                Study goal
              </label>
              <input
                id="goal-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addGoal();
                }}
                placeholder="e.g. Study math for 2 hours"
                className="min-h-12 flex-1 rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 text-[15px] text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:bg-zinc-950 dark:focus:ring-white/10"
              />
              <button
                type="button"
                onClick={addGoal}
                className="min-h-12 shrink-0 rounded-2xl bg-zinc-900 px-6 text-sm font-medium text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-900/20 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:shadow-none dark:hover:bg-white"
              >
                Add goal
              </button>
            </div>

            {goals.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700/80 dark:bg-zinc-950/40 dark:text-zinc-500">
                No goals yet. Add one above to get started.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      Progress
                    </span>
                    <span>
                      {completedCount}/{totalGoals} completed
                    </span>
                  </div>
                  <div
                    className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
                    role="progressbar"
                    aria-valuenow={progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-zinc-900 transition-[width] duration-300 ease-out dark:bg-zinc-100"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
                <ul className="space-y-2.5" aria-label="Study goals">
                {goals.map((goal) => (
                  <li
                    key={goal.id}
                    className="group flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/60 px-4 py-3 transition-colors hover:border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-950/70"
                  >
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => toggleCompleted(goal.id)}
                      className="size-4 shrink-0 rounded-md border-zinc-300 text-zinc-900 transition focus:ring-2 focus:ring-zinc-900/25 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-white/20"
                      aria-label={`Mark "${goal.text}" as ${
                        goal.completed ? "incomplete" : "complete"
                      }`}
                    />
                    <span
                      className={`min-w-0 flex-1 text-[15px] leading-snug ${
                        goal.completed
                          ? "text-zinc-400 line-through dark:text-zinc-500"
                          : "text-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      {goal.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteGoal(goal.id)}
                      className="shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-500 opacity-90 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:text-zinc-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                      aria-label={`Delete "${goal.text}"`}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              </div>
            )}

            <div className="border-t border-zinc-100 pt-8 dark:border-zinc-800/80">
              <button
                type="button"
                onClick={fetchAdvice}
                disabled={adviceLoading}
                className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-800 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
              >
                {adviceLoading ? "Yükleniyor…" : "AI Öneri Al"}
              </button>

              {adviceError || advice !== null ? (
                <div
                  className="mt-6 rounded-2xl border border-violet-200/70 bg-gradient-to-b from-violet-50/90 to-white p-5 shadow-sm ring-1 ring-violet-900/5 dark:border-violet-500/25 dark:from-violet-950/35 dark:to-zinc-900/90 dark:ring-violet-400/10"
                  role={adviceError ? "alert" : undefined}
                  aria-live="polite"
                >
                  <h2 className="text-sm font-semibold tracking-tight text-violet-950 dark:text-violet-200">
                    AI Coach
                  </h2>
                  <p
                    className={`mt-3 text-[15px] leading-relaxed ${
                      adviceError
                        ? "text-red-600 dark:text-red-400"
                        : "text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {adviceError ?? advice}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
