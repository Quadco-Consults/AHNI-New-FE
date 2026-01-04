import TERDocument from "@/features/admin/components/travel-expenses-report/ter-document";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function TERDocumentPage() {
  return <TERDocument />;
}
