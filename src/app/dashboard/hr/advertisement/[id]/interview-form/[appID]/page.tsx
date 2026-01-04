import InterviewForm from "@/features/hr/components/advertisement/id/InterviewForm";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function InterviewFormPage() {
  return <InterviewForm />;
}