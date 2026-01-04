import EvaluationDetails from "@/features/programs/components/plan/ssp/[id]/EvaluationDetails";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function SSPViewEvaluationPage() {
  console.log({ id: "idmds mdnjsnj" });

  return <EvaluationDetails />;
}
