import FuelRequestDetail from "@/features/admin/components/fleet-management/fuel-request/detail";

export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
// import FuelRequestDetail from "@/features/admin/components/fleet-management/fuel-request/id";

export default function FuelRequestDetailPage() {
  return <FuelRequestDetail />;
}
