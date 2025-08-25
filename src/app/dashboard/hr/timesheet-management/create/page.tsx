"use client";

import dynamic from "next/dynamic";

const CreateTimesheet = dynamic(() => import("@/features/hr/components/timesheet-management/CreateTimesheet"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function TimesheetManagementCreatePage() {
  return <CreateTimesheet />;
}