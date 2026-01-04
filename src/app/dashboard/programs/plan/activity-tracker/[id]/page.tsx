import ActivityTrackerDetail from "@/features/programs/components/plan/work-plan-tracker/id/index";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function ActivityTrackerDetailPage() {
  return <ActivityTrackerDetail />;
}