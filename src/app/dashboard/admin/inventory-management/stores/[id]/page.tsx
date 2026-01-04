import StoreDetailPage from "@/features/admin/components/stores/id";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default async function StoreDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StoreDetailPage storeId={id} />;
}
