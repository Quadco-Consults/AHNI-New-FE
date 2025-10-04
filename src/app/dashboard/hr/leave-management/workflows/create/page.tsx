"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const WorkflowForm = dynamic(
  () => import("@/features/hr/components/leave-management/WorkflowForm"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateWorkflowPage() {
  return <WorkflowForm />;
}
