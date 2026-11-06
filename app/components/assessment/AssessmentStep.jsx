"use client";

import { TOTAL_STEPS } from "@/lib/assessment";
import PillarStep from "./PillarStep";
import Step1Profile from "./Step1Profile";

export default function AssessmentStep({ step }) {
  return (
    <>
      <div className="max-w-2xl mx-auto mb-6 md:max-w-none md:px-10 lg:px-16">
        <div className="flex justify-between items-center text-xs font-bold text-[#1E2D24] mb-2">
          <span className="text-[#FF4B93]">Asesmen Finansial Awal</span>
          <span>
            Halaman {step} dari {TOTAL_STEPS}
          </span>
        </div>
        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
          <div className="bg-[#1F5932] h-full transition-all duration-300" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
      </div>
      {step === 1 ? <Step1Profile /> : <PillarStep step={step} />}
    </>
  );
}
