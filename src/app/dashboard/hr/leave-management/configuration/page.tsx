"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const LeaveConfiguration = dynamic(
  () => import("@/features/hr/components/leave-management/LeaveConfiguration"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function LeaveConfigurationPage() {
  return <LeaveConfiguration />;
}
