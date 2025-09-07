"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CreateSolicitationItems = dynamic(
  () =>
    import("@/features/procurement/components/solicitation-management/RFQ/create/Items").catch(() => ({ 
      default: () => <div>Failed to load component</div> 
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateSolicitationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateSolicitationItems />
    </Suspense>
  );
}
