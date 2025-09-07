"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CreateCBA = dynamic(
  () =>
    import(
      "@/features/procurement/components/solicitation-management/RFQ/create/CreateCBA"
    ).catch(() => ({ default: () => <div>Failed to load CBA component</div> })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateCBAPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateCBA />
    </Suspense>
  );
}
