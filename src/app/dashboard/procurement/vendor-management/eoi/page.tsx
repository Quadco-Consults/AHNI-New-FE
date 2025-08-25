"use client";

import dynamic from "next/dynamic";

const EOI = dynamic(() => import("@/features/procurement/components/vendor-management/eoi/EOI"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function EOIPage() {
  return <EOI />;
}