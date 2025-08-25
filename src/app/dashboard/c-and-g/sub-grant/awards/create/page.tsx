"use client";

import dynamic from "next/dynamic";

const SubGrantAwardsCreate = dynamic(() => import("@/features/contracts-grants/components/sub-grant/awards/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function SubGrantAwardsCreatePage() {
  return <SubGrantAwardsCreate />;
}