"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const ScopeOfWork = dynamic(
  () =>
    import(
      "@/features/contracts-grants/components/contract-management/consultant-management/create/ScopeOfWork"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function FacilitatorScopeOfWorkPage() {
  return <ScopeOfWork />;
}