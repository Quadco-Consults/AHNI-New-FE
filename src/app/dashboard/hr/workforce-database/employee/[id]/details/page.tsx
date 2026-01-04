import EmployeeDetails from "@/features/hr/components/workforce-database/id";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function EmployeeDetailsPage() {
  return <EmployeeDetails />;
}