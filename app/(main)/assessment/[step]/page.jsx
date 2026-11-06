import { notFound } from "next/navigation";
import AssessmentStep from "@/app/components/assessment/AssessmentStep";
import { TOTAL_STEPS } from "@/lib/assessment";

export const metadata = { title: "Asesmen Finansial" };

export default async function Page({ params }) {
  const { step } = await params;
  const n = Number(step);
  if (!Number.isInteger(n) || n < 1 || n > TOTAL_STEPS) notFound();
  return <AssessmentStep step={n} />;
}
