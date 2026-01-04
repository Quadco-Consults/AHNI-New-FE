import ConsumableDetail from "@/features/admin/components/inventory-management/consumable/id";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function ConsumableDetailPage() {
  return <ConsumableDetail />;
}