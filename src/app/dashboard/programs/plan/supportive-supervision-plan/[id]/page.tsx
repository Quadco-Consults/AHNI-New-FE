import SspDetail from "@/features/programs/components/plan/ssp/[id]/index";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function SspDetailPage() {
  return <SspDetail />;
}