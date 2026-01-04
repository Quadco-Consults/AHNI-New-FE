import IdCardInformation from "@/features/hr/components/onboarding/add-employee/IdCardInformation";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function IdCardInformationPage() {
  return <IdCardInformation />;
}