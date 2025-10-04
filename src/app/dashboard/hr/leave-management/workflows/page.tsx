"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const WorkflowsList = dynamic(
  () => import("@/features/hr/components/leave-management/WorkflowsList"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function WorkflowsPage() {
  return <WorkflowsList />;
}
