"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const LeaveTypeForm = dynamic(
  () => import("@/features/hr/components/leave-management/LeaveTypeForm"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function EditLeaveTypePage() {
  const params = useParams();
  const leaveTypeId = params?.id as string;

  return <LeaveTypeForm mode="edit" leaveTypeId={leaveTypeId} />;
}
