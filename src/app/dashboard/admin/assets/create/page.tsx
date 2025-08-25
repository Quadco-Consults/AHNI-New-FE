"use client";

import dynamic from "next/dynamic";

const AssetsCreate = dynamic(() => import("@/features/admin/components/assets/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function AssetsCreatePage() {
  return <AssetsCreate />;
}