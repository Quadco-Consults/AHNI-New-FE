import OnboardingDetails from "@/features/hr/components/onboarding/start-onboarding";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function StartOnboardingPage() {
  return <OnboardingDetails />;
}