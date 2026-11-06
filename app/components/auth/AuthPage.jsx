"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "./AuthForm";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-floating border border-sakuGreen-light fade-up">
      <AuthForm mode={mode} onMode={setMode} onSuccess={(m) => router.push(m === "register" ? "/assessment/1" : "/dashboard")} />
    </div>
  );
}
