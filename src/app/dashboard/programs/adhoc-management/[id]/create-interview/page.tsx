import CreateAdhocInterview from "@/features/programs/components/adhoc-management/CreateAdhocInterview";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function CreateAdhocInterviewPage() {
  return <CreateAdhocInterview />;
}