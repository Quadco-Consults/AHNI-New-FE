"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const AssignLeaveForm = dynamic(
  () => import("@/features/hr/components/leave-management/AssignLeaveForm"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function AssignLeavePage() {
  return <AssignLeaveForm />;
}
