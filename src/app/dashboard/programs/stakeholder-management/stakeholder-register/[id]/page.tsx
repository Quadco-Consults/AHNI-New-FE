import StakeholderRegisterDetail from "@/features/programs/components/stakeholder-management/register/[id]/index";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function StakeholderRegisterDetailPage() {
  return <StakeholderRegisterDetail />;
}