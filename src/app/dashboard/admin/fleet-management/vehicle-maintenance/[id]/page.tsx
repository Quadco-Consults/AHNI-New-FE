import VehicleMaintenanceDetail from "@/features/admin/components/fleet-management/vehicle-maintenance/id";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function VehicleMaintenanceDetailPage() {
  return <VehicleMaintenanceDetail />;
}