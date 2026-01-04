import EmployeeInformation from "@/features/hr/components/onboarding/add-employee/EmployeeInformation";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function EmployeeInformationPage() {
  return <EmployeeInformation />;
}