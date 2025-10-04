"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const LeaveTypeForm = dynamic(
  () => import("@/features/hr/components/leave-management/LeaveTypeForm"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateLeaveTypePage() {
  return <LeaveTypeForm mode="create" />;
}
