"use client";

import dynamic from "next/dynamic";

const LeaveRequestForm = dynamic(() => import("@/features/hr/components/leave-management/form/index"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function RequestLeavePage() {
    return <LeaveRequestForm />;
}