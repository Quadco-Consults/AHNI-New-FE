import StoreDetailPage from "@/features/admin/components/stores/id";

export default function StoreDetailRoutePage({
  params,
}: {
  params: { id: string };
}) {
  return <StoreDetailPage storeId={params.id} />;
}
