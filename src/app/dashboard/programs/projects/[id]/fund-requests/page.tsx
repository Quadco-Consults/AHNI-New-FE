import FundRequestDetails from "@/features/programs/components/fund-request/id/index";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function ProjectFundRequestsPage() {
  return <FundRequestDetails />;
}
