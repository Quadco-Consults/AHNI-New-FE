import WorkPlanDetail from "@/features/programs/components/plan/work-plan/id";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function WorkPlanDetailPage() {
  return <WorkPlanDetail />;
}