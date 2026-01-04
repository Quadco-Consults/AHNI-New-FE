import StoreTransferDetail from "@/features/admin/components/store-transfers/[id]";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function StoreTransferDetailPage() {
  return <StoreTransferDetail />;
}
