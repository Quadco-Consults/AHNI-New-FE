"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const LeaveAssign = dynamic(
  () => import("@/features/hr/components/leave-management/Assign"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function AssignLeavePage() {
  return <LeaveAssign />;
}
