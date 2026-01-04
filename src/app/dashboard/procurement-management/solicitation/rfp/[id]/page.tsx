import RFPDetails from "@/features/procurement/components/solicitation-management/RFP/[id]/index";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function RFPDetailsPage() {
  return <RFPDetails />;
}
