"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const RFQItems = dynamic(
  () =>
    import(
      "@/features/procurement/components/solicitation-management/RFQ/create/Items"
    ).catch(() => ({ default: () => <div>Failed to load component</div> })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function RFQItemsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RFQItems />
    </Suspense>
  );
}
