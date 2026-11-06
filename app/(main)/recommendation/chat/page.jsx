import { Suspense } from "react";
import Recommendation from "@/app/components/recommendation/Recommendation";

export const metadata = { title: "AI Advisor" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Recommendation />
    </Suspense>
  );
}
