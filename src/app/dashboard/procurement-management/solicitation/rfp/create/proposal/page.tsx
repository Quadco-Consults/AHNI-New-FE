"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const RFPCreateProposal = dynamic(
  () =>
    import("@/features/procurement/components/solicitation-management/RFP/create/Proposal").catch(() => ({ 
      default: () => <div>Failed to load component</div> 
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function RFPCreateProposalPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RFPCreateProposal />
    </Suspense>
  );
}
