import AssetDetails from "@/features/admin/components/assets/components/AssetDetails";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function AssetDetailsPage() {
  return <AssetDetails />;
}