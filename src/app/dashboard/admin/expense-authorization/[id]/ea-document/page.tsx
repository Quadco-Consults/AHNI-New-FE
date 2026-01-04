import EADocument from "@/features/admin/components/expense-authorization/ea-document";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function EADocumentPage() {
  return <EADocument />;
}
