"use client";

import dynamic from "next/dynamic";

const LeaveAssignment = dynamic(() => import("@/features/hr/components/leave-management/Assign"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function LeaveAssignmentPage() {
  return <LeaveAssignment />;
}