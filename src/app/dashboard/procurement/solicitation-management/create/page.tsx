export const dynamic = 'force-dynamic';

import { Loading } from "@/components/Loading";
import { Suspense } from "react";
import CreateSolicitation from "@/features/procurement/components/solicitation-management/RFQ/create/Quotation";

export default function CreateSolicitationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateSolicitation />
    </Suspense>
  );
}
