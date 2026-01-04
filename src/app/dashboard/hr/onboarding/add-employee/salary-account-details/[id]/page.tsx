import Salary from "@/features/hr/components/onboarding/add-employee/Salary";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function SalaryAccountDetailsPage() {
  return <Salary />;
}