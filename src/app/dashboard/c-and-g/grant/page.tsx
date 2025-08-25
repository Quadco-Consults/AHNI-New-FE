"use client";

import dynamic from "next/dynamic";

const GrantIndex = dynamic(() => import("@/features/contracts-grants/components/grant/index"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function GrantPage() {
  return <GrantIndex />;
}