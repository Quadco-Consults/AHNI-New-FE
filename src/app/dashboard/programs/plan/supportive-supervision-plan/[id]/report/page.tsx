import SspReport from "@/features/programs/components/plan/ssp/[id]/SspReport";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function SspReportPage() {
  return <SspReport />;
}
