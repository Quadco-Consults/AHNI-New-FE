import FacilityDetails from "@/features/admin/components/facility-management/facility-maintenance/id";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function FacilityDetailsPage() {
  return <FacilityDetails />;
}