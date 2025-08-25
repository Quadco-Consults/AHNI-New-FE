"use client";

import dynamic from "next/dynamic";

const CreateActivityMemo = dynamic(() => import("@/features/procurement/components/purchase-request/activity-memo"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function ActivityMemoPage() {
  return <CreateActivityMemo />;
}