import ProcurementPlanDetail from "@/features/procurement/components/procurement-plan/id/index";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function ProcurementPlanDetailPage() {
  return <ProcurementPlanDetail />;
}