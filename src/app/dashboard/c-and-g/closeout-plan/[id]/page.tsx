import CloseoutPlanDetail from "@/features/contracts-grants/components/closeout-plan/id";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function CloseoutPlanDetailPage() {
  return <CloseoutPlanDetail />;
}