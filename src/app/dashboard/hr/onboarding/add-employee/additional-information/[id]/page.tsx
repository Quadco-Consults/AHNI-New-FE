import AdditionalInformation from "@/features/hr/components/onboarding/add-employee/AdditionalInformation";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function AdditionalInformationPage() {
  return <AdditionalInformation />;
}