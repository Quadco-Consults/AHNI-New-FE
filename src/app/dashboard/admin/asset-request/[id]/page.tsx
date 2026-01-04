import AssetRequestDetail from "@/features/admin/components/asset-request/id";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function AssetRequestDetailPage() {
  return <AssetRequestDetail />;
}