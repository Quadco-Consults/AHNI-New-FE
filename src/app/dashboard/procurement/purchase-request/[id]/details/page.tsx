import PurchaseRequestDetails from "@/features/procurement/components/purchase-request/id";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function PurchaseRequestDetailsPage() {
  return <PurchaseRequestDetails />;
}