"use client";

import dynamic from "next/dynamic";

const GrantCreate = dynamic(() => import("@/features/contracts-grants/components/grant/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function GrantCreatePage() {
  return <GrantCreate />;
}