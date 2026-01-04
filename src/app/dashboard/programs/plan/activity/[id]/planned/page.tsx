import PlannedActivities from "@/features/programs/components/plan/activity-plan/id/planned-activities";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function PlannedActivitiesPage() {
  return <PlannedActivities />;
}