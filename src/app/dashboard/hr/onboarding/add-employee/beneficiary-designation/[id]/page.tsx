import Beneficiary from "@/features/hr/components/onboarding/add-employee/Beneficiary";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function BeneficiaryDesignationPage() {
  return <Beneficiary />;
}