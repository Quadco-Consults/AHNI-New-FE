export const dynamic = 'force-dynamic';

import { Loading } from "@/components/Loading";
import { Suspense } from "react";
import CreateSolicitationItems from "@/features/procurement/components/solicitation-management/RFQ/create/Items";

export default function CreateSolicitationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateSolicitationItems />
    </Suspense>
  );
}
