import InterviewedApplicantDetail from "@/features/hr/components/advertisement/id/InterviewedApplicantDetail";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
const InterviewedApplicantDetailPage = () => {
  return <InterviewedApplicantDetail />;
};

export default InterviewedApplicantDetailPage;
