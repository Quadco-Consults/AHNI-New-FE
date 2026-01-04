import StakeholderDetails from "@/features/programs/components/stakeholder-management/register/[id]";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function StakeholderDetailsPage() {
  return <StakeholderDetails />;
}