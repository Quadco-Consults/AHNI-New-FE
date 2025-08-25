"use client";

import dynamic from "next/dynamic";

const CreateLeaveRequest = dynamic(() => import("@/features/hr/components/leave-management/form"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function CreateLeaveRequestPage() {
  return <CreateLeaveRequest />;
}