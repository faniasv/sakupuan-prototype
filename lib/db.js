// ---------------------------------------------------------------------------
// DATA ACCESS LAYER (in-memory stub).
//
// Every route talks to the database ONLY through `db.*` below, and every method
// is async, so moving to Postgres/Supabase/Prisma means rewriting this one file.
//
// WARNING: this store lives in server memory. It is reset on every restart and,
// on Vercel (serverless), it is NOT shared between function instances. Fine for
// local development / UI demos; replace before real users or UAT on Vercel.
// Suggested tables: users, assessments, tasks, rec_state, transactions,
// telegram_links, price_points.
// ---------------------------------------------------------------------------
import crypto from "node:crypto";
import { env } from "./env";
import { hashPassword } from "./password";
import { INITIAL_TASKS, SEED_TRANSACTIONS } from "./data/seed";

const DEMO_ID = "demo";

const createStore = () => ({
  seq: 1000,
  users: new Map(), // id -> user
  byEmail: new Map(), // email -> id
  assessments: new Map(), // userId -> { answers, score, createdAt }
  tasks: new Map(), // userId -> Task[]
  recs: new Map(), // userId -> { extra: Rec[], skipped: number[] }
  txns: new Map(), // userId -> Transaction[]
  links: new Map(), // token -> { userId, exp }
  chats: new Map(), // telegram chatId -> userId
  prices: new Map(), // `${city}|${commodityId}` -> [{ date, price }]
});

const store = (globalThis.__sakupuanDb ??= createStore());
const nextId = () => ++store.seq;
const clone = (v) => structuredClone(v);

function seedUserData(userId) {
  // Sample data only in demo mode; real users start with empty lists.
  if (!env.demoMode) return;
  store.tasks.set(userId, [...INITIAL_TASKS].reverse().map((t) => ({ id: nextId(), ...t })).reverse());
  store.txns.set(userId, SEED_TRANSACTIONS.map((t) => ({ id: nextId(), ...t })));
}

function ensureDemoUser() {
  let u = store.users.get(DEMO_ID);
  if (!u) {
    u = { id: DEMO_ID, name: "Vivin", email: "vivin@email.com", phone: "", passwordHash: hashPassword("demo1234"), createdAt: Date.now() };
    store.users.set(DEMO_ID, u);
    store.byEmail.set(u.email, DEMO_ID);
    store.tasks.set(DEMO_ID, INITIAL_TASKS.map((t) => ({ id: nextId(), ...t })));
    store.txns.set(DEMO_ID, SEED_TRANSACTIONS.map((t) => ({ id: nextId(), ...t })));
  }
  return u;
}

export const db = {
  // ---------- users ----------
  async getUser(id) {
    if (id === DEMO_ID && env.demoMode) return ensureDemoUser();
    return store.users.get(id) ?? null;
  },
  async getDemoUser() {
    return ensureDemoUser();
  },
  async findUserByEmail(email) {
    if (env.demoMode) ensureDemoUser();
    const id = store.byEmail.get(email.toLowerCase());
    return id ? store.users.get(id) : null;
  },
  async createUser({ name, email, phone = "", passwordHash }) {
    const id = crypto.randomUUID();
    const user = { id, name, email: email.toLowerCase(), phone, passwordHash, createdAt: Date.now() };
    store.users.set(id, user);
    store.byEmail.set(user.email, id);
    seedUserData(id);
    return user;
  },
  async updateUser(id, patch) {
    const u = await this.getUser(id);
    if (!u) return null;
    Object.assign(u, patch);
    return u;
  },

  // ---------- assessment ----------
  async getAssessment(userId) {
    return clone(store.assessments.get(userId) ?? null);
  },
  async saveAssessment(userId, { answers, score }) {
    const row = { answers, score, createdAt: Date.now() };
    store.assessments.set(userId, row);
    return clone(row);
  },

  // ---------- tasks (action plan) ----------
  async listTasks(userId) {
    return clone(store.tasks.get(userId) ?? []);
  },
  /** Idempotent on title: adding the same title twice returns the existing task. */
  async createTask(userId, data) {
    const list = store.tasks.get(userId) ?? [];
    const existing = list.find((t) => t.title === data.title);
    if (existing) return { task: clone(existing), created: false };
    const task = { id: nextId(), done: false, ...data };
    store.tasks.set(userId, [task, ...list]);
    return { task: clone(task), created: true };
  },
  async updateTask(userId, id, patch) {
    const t = (store.tasks.get(userId) ?? []).find((x) => x.id === id);
    if (!t) return null;
    Object.assign(t, patch);
    for (const k of Object.keys(t)) if (t[k] === undefined || t[k] === null) delete t[k];
    return clone(t);
  },
  async deleteTask(userId, id) {
    const list = store.tasks.get(userId) ?? [];
    const next = list.filter((x) => x.id !== id);
    store.tasks.set(userId, next);
    return next.length !== list.length;
  },

  // ---------- recommendations ----------
  async getRecState(userId) {
    return clone(store.recs.get(userId) ?? { extra: [], skipped: [] });
  },
  async setRecState(userId, state) {
    store.recs.set(userId, clone(state));
  },
  newRecId() {
    return nextId();
  },

  // ---------- transactions ----------
  async listTransactions(userId) {
    return clone(store.txns.get(userId) ?? []);
  },
  async addTransaction(userId, txn) {
    const row = { id: nextId(), ...txn };
    store.txns.set(userId, [row, ...(store.txns.get(userId) ?? [])]);
    return clone(row);
  },

  // ---------- telegram ----------
  async createTelegramLink(userId) {
    const token = crypto.randomBytes(16).toString("hex");
    store.links.set(token, { userId, exp: Date.now() + 15 * 60_000 });
    return token;
  },
  /** One-time token -> binds chatId to the user. Returns the user or null. */
  async consumeTelegramLink(token, chatId, username) {
    const link = store.links.get(token);
    store.links.delete(token);
    if (!link || link.exp < Date.now()) return null;
    const user = await this.getUser(link.userId);
    if (!user) return null;
    user.telegramChatId = String(chatId);
    user.telegramUsername = username ? `@${username}` : "";
    store.chats.set(String(chatId), user.id);
    return user;
  },
  async findUserByChat(chatId) {
    const id = store.chats.get(String(chatId));
    return id ? this.getUser(id) : null;
  },

  // ---------- food prices (filled by /api/cron/prices) ----------
  async savePricePoint({ city, commodityId, date, price }) {
    const key = `${city}|${commodityId}`;
    const list = (store.prices.get(key) ?? []).filter((p) => p.date !== date);
    list.push({ date, price });
    list.sort((a, b) => a.date.localeCompare(b.date));
    store.prices.set(key, list);
  },
  /** Daily prices oldest -> newest as plain numbers, or null if none stored. */
  async getPriceSeries(city, commodityId) {
    const list = store.prices.get(`${city}|${commodityId}`);
    return list?.length ? list.map((p) => p.price) : null;
  },
};
