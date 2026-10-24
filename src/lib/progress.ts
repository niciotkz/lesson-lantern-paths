import { useEffect, useState } from "react";

const KEY = "lms-progress";
const listeners = new Set<() => void>();

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export const lessonKey = (m: number, l: number) => `${m}-${l}`;

export function toggleLesson(key: string) {
  const cur = read();
  const next = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key];
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((f) => f());
}

export function useProgress() {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    const f = () => setDone(read());
    f();
    listeners.add(f);
    return () => {
      listeners.delete(f);
    };
  }, []);
  return done;
}
