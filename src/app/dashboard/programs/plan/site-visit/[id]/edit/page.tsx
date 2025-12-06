import SiteVisitEdit from "@/features/programs/components/plan/site-visit/edit";

interface SiteVisitEditPageProps {
  params: { id: string };
}

export default function SiteVisitEditPage({
  params
}: SiteVisitEditPageProps) {
  return <SiteVisitEdit siteVisitId={params.id} />;
}