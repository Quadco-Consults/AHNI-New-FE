import Pension from "@/features/hr/components/onboarding/add-employee/Pension";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function PensionSchemeEnrolmentPage() {
  return <Pension />;
}