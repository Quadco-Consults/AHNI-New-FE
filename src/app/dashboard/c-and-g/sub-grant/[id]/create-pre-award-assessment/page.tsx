import CreatePreAwardAssessment from "@/features/contracts-grants/components/sub-grant/awards/id/CreatePreAwardAssessment";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function CreatePreAwardAssessmentPage() {
  return <CreatePreAwardAssessment />;
}
