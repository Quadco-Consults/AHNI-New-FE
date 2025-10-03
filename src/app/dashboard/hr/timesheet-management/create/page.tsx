"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const TimesheetManagementFull = dynamic(
  () => import("@/features/hr/components/timesheet-management/id/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function TimesheetManagementCreatePage() {
  return <TimesheetManagementFull />;
}
