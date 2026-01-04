import SiteVisitDetail from "@/features/programs/components/plan/site-visit/[id]";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function SiteVisitDetailPage() {
  return <SiteVisitDetail />;
}