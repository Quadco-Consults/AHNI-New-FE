import ConsultancyReportDetail from "@/features/contracts-grants/components/contract-management/consultancy-report/id";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function ConsultancyReportDetailPage() {
  return <ConsultancyReportDetail />;
}