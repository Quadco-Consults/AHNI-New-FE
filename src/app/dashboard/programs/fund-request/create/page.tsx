"use client";

import dynamic from "next/dynamic";

const FundRequestCreate = dynamic(() => import("@/features/programs/components/fund-request/create/index"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function FundRequestCreatePage() {
  return <FundRequestCreate />;
}