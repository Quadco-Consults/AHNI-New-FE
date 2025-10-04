"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const LeaveTypesList = dynamic(
  () => import("@/features/hr/components/leave-management/LeaveTypesList"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function LeaveTypesPage() {
  return <LeaveTypesList />;
}
