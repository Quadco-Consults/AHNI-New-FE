"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreateLeaveRequest = dynamic(
  () => import("@/features/hr/components/leave-management/form"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateLeaveRequestPage() {
  return <CreateLeaveRequest />;
}
