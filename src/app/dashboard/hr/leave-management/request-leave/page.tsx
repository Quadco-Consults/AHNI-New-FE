"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const LeaveRequestForm = dynamic(
  () => import("@/features/hr/components/leave-management/form/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function RequestLeavePage() {
  return <LeaveRequestForm />;
}
