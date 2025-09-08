export const dynamic = 'force-dynamic';

import { Loading } from "@/components/Loading";
import { Suspense } from "react";
import RFPCreateProposal from "@/features/procurement/components/solicitation-management/RFP/create/Proposal";

export default function RFPCreateProposalPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RFPCreateProposal />
    </Suspense>
  );
}
