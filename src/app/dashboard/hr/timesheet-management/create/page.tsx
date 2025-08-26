"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreateTimesheet = dynamic(
  () => import("@/features/hr/components/timesheet-management/CreateTimesheet"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function TimesheetManagementCreatePage() {
  return <CreateTimesheet />;
}
