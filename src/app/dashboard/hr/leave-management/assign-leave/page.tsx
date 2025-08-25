"use client";

import dynamic from "next/dynamic";

const LeaveAssign = dynamic(() => import("@/features/hr/components/leave-management/Assign"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function AssignLeavePage() {
    return <LeaveAssign />;
}