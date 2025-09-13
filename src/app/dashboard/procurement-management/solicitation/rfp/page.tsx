"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const RFP = dynamic(
  () =>
    import("@/features/procurement/components/solicitation-management/RFP/index").catch(() => ({ 
      default: () => <div>Failed to load component</div> 
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function RFPPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RFP />
    </Suspense>
  );
}