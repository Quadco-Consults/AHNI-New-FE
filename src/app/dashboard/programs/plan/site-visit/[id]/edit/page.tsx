import SiteVisitEdit from "@/features/programs/components/plan/site-visit/edit";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
interface SiteVisitEditPageProps {
  params: { id: string };
}

export default function SiteVisitEditPage({
  params
}: SiteVisitEditPageProps) {
  return <SiteVisitEdit siteVisitId={params?.id} />;
}