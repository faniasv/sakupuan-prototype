"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { DEFAULT_ANSWERS } from "@/lib/assessment";
import { DEFAULT_CITY } from "@/lib/constants";
import { calculateScore } from "@/lib/scoring";

const AppContext = createContext(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

// numbers typed in <input type="number"> can be "", NaN or decimals
const cleanMoney = (n) => Math.max(0, Math.round(Number(n) || 0));
const normalizeAnswers = (a) => ({
  ...a,
  A2_amount: cleanMoney(a.A2_amount),
  A3a_food_amount: cleanMoney(a.A3a_food_amount),
  B1a_remaining_amount: cleanMoney(a.B1a_remaining_amount),
  A4_city: (a.A4_city || "").trim() || DEFAULT_CITY,
});

export default function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS);
  const [tasks, setTasks] = useState([]);
  const [telegramPromptSeen, setTelegramPromptSeen] = useState(false);

  // --- session bootstrap ---
  useEffect(() => {
    let off = false;
    api
      .get("/api/auth/me")
      .then((r) => !off && setUser(r.user))
      .catch(() => {})
      .finally(() => !off && setAuthLoading(false));
    return () => {
      off = true;
    };
  }, []);

  // --- per-user data ---
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }
    let off = false;
    Promise.all([api.get("/api/tasks"), api.get("/api/assessment")])
      .then(([t, a]) => {
        if (off) return;
        setTasks(t.tasks);
        if (a.assessment) setAnswers(a.assessment.answers);
      })
      .catch(() => {});
    return () => {
      off = true;
    };
  }, [user?.id]);

  const score = useMemo(() => calculateScore(answers), [answers]);
  const city = (answers.A4_city || "").trim() || DEFAULT_CITY;

  // --- auth / profile ---
  const authenticate = useCallback(async (mode, form) => {
    const r = await api.post(`/api/auth/${mode}`, form);
    setUser(r.user);
    return r.user;
  }, []);
  const logout = useCallback(async () => {
    await api.post("/api/auth/logout");
    setUser(null);
    setAnswers(DEFAULT_ANSWERS);
  }, []);
  const updateProfile = useCallback(async (v) => {
    const r = await api.patch("/api/profile", v);
    setUser(r.user);
  }, []);
  const refreshUser = useCallback(async () => {
    const r = await api.get("/api/auth/me");
    setUser(r.user);
    return r.user;
  }, []);

  // --- assessment ---
  const setAnswer = useCallback((key, value) => setAnswers((p) => ({ ...p, [key]: value })), []);
  const toggleMulti = useCallback(
    (field, option) =>
      setAnswers((p) => ({
        ...p,
        [field]: p[field].includes(option) ? p[field].filter((x) => x !== option) : [...p[field], option],
      })),
    [],
  );
  const submitAssessment = useCallback(async () => {
    const clean = normalizeAnswers(answers);
    const r = await api.post("/api/assessment", { answers: clean });
    setAnswers(clean);
    return r.score;
  }, [answers]);

  // --- action plan ---
  const addTask = useCallback(async (t) => {
    const { task } = await api.post("/api/tasks", t);
    setTasks((ts) => (ts.some((x) => x.id === task.id) ? ts : [task, ...ts]));
    return task;
  }, []);
  const reloadTasks = useCallback(() => api.get("/api/tasks").then((r) => setTasks(r.tasks)), []);
  const toggleTask = async (id) => {
    const cur = tasks.find((t) => t.id === id);
    if (!cur) return;
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !cur.done } : t)));
    try {
      await api.patch(`/api/tasks/${id}`, { done: !cur.done });
    } catch {
      reloadTasks();
    }
  };
  const removeTask = async (id) => {
    setTasks((ts) => ts.filter((t) => t.id !== id));
    try {
      await api.del(`/api/tasks/${id}`);
    } catch {
      reloadTasks();
    }
  };
  /** id < 0 means "new task". Throws on failure so the modal can show the error. */
  const saveTask = async (t) => {
    if (t.id < 0) {
      await addTask({ title: t.title, cat: t.cat, note: t.note, amount: t.amount });
      return;
    }
    const { task } = await api.patch(`/api/tasks/${t.id}`, {
      title: t.title,
      cat: t.cat,
      note: t.note ?? null,
      amount: t.amount ?? null,
    });
    setTasks((ts) => ts.map((x) => (x.id === task.id ? task : x)));
  };

  const value = {
    user, authLoading, authenticate, logout, updateProfile, refreshUser,
    answers, setAnswer, toggleMulti, submitAssessment, score, city,
    tasks, addTask, toggleTask, removeTask, saveTask,
    telegramPromptSeen, setTelegramPromptSeen,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
