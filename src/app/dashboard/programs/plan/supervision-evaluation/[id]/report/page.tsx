import SupervisionEvaluationReport from "@/features/programs/components/evaluation/SupervisionEvaluationReport";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function SupervisionEvaluationReportPage() {
  return <SupervisionEvaluationReport />;
}