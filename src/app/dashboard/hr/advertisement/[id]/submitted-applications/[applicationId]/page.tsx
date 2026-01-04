import ApplicationDetail from "@/features/hr/components/advertisement/submitted-applications/ApplicationDetail";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function ApplicationDetailPage() {
  return <ApplicationDetail />;
}