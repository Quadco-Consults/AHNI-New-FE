import StoreDetailPage from "@/features/admin/components/stores/id";

export default async function StoreDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StoreDetailPage storeId={id} />;
}
