import ActivityMemoDetail from "@/features/procurement/components/purchase-request/activity-memo/id";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function ActivityMemoDetailPage() {
  return <ActivityMemoDetail />;
}