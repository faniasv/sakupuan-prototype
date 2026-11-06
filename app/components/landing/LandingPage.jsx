"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/app/components/auth/AuthForm";
import Modal from "@/app/components/ui/Modal";
import CtaBanner from "./CtaBanner";
import Features from "./Features";
import GuideModal from "./GuideModal";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import LandingFooter from "./LandingFooter";
import LandingHeader from "./LandingHeader";
import TelegramSection from "./TelegramSection";

export default function LandingPage() {
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [auth, setAuth] = useState(null); // null | "login" | "register"
  const [guide, setGuide] = useState(false);
  const [info, setInfo] = useState(null); // null | { title, body }

  const openAuth = (mode) => {
    setMenu(false);
    setAuth(mode);
  };

  return (
    <div className="bg-sakuIvory text-sakuText antialiased selection:bg-sakuPink-light selection:text-sakuPink-dark">
      <LandingHeader menu={menu} setMenu={setMenu} openAuth={openAuth} />
      <main>
        <Hero openAuth={openAuth} />
        <Features />
        <HowItWorks />
        <TelegramSection openAuth={openAuth} onOpenGuide={() => setGuide(true)} />
        <CtaBanner openAuth={openAuth} />
      </main>
      <LandingFooter setInfo={setInfo} />

      <Modal open={!!auth} onClose={() => setAuth(null)}>
        {auth && (
          <AuthForm
            mode={auth}
            onMode={setAuth}
            onSuccess={(mode) => {
              setAuth(null);
              router.push(mode === "register" ? "/assessment/1" : "/dashboard");
            }}
          />
        )}
      </Modal>
      <GuideModal
        open={guide}
        onClose={() => setGuide(false)}
        onStart={() => {
          setGuide(false);
          setAuth("register");
        }}
      />
      <Modal open={!!info} onClose={() => setInfo(null)}>
        <h3 className="text-lg font-bold mb-2 pr-6">{info?.title}</h3>
        <p className="text-sm text-sakuText-muted leading-relaxed mb-5">{info?.body}</p>
        <button onClick={() => setInfo(null)} className="w-full bg-sakuGreen text-white font-semibold py-2.5 rounded-lg text-sm">
          Tutup
        </button>
      </Modal>
    </div>
  );
}
