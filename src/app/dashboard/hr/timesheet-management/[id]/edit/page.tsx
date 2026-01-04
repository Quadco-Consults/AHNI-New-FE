import TimesheetEdit from "@/features/hr/components/timesheet-management/id/edit";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function TimesheetEditPage() {
  return <TimesheetEdit />;
}