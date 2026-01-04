import ManualBidSubmission from "@/features/procurement/components/solicitation-management/RFP/[id]/Manual-bid-submission";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function RFPManualBidSubmissionPage() {
  return <ManualBidSubmission />;
}