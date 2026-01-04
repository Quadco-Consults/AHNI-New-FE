import VendorDetails from "@/features/procurement/components/vendor-management/eoi/id";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function VendorDetailsPage() {
  return <VendorDetails />;
}