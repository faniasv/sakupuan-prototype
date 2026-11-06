"use client";

import { useState } from "react";
import { useApp } from "@/app/components/providers/AppProvider";

/** Login / register form, shared by the landing modal and the /auth page. */
export default function AuthForm({ mode, onMode, onSuccess }) {
  const { authenticate } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const input =
    "w-full text-base sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-sakuGreen focus:ring-1 focus:ring-sakuGreen";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authenticate(mode, mode === "register" ? { name: name.trim(), email, password } : { email, password });
      onSuccess(mode);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex border-b border-gray-200 mb-6 pr-6">
        {["register", "login"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setError("");
              onMode(t);
            }}
            className={`flex-1 pb-3 text-sm border-b-2 ${
              mode === t
                ? "font-bold text-sakuGreen border-sakuGreen"
                : "font-medium text-gray-400 border-transparent hover:text-sakuText"
            }`}
          >
            {t === "register" ? "Daftar Akun Baru" : "Login Masuk"}
          </button>
        ))}
      </div>
      <form className="space-y-4" onSubmit={submit}>
        {mode === "register" && (
          <label className="block">
            <span className="block text-xs font-semibold mb-1">Nama Lengkap</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Vivin"
              autoComplete="name"
              required
              className={input}
            />
          </label>
        )}
        <label className="block">
          <span className="block text-xs font-semibold mb-1">Alamat Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            autoComplete="email"
            required
            className={input}
          />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold mb-1">Kata Sandi</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            minLength={mode === "register" ? 8 : undefined}
            required
            className={input}
          />
        </label>
        {mode === "register" && (
          <div className="p-3 bg-sakuPink-light rounded-lg text-xs text-sakuPink-dark font-medium">
            Penghubungan Telegram dilakukan setelah proses pendaftaran awal selesai.
          </div>
        )}
        {error && (
          <p role="alert" className="text-xs font-semibold text-sakuPink-dark">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sakuGreen hover:bg-sakuGreen-hover disabled:opacity-60 text-white font-semibold py-3 rounded-lg shadow-sm text-sm"
        >
          {loading ? "Memproses..." : mode === "register" ? "Lanjutkan Pendaftaran" : "Masuk"}
        </button>
      </form>
    </>
  );
}
