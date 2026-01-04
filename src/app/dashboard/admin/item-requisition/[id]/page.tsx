import ItemRequisitionDetail from "@/features/admin/components/item-requisition/id/index";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function ItemRequisitionDetailPage() {
  return <ItemRequisitionDetail />;
}