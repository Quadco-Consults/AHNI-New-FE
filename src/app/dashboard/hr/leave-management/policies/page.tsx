"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const PoliciesList = dynamic(
  () => import("@/features/hr/components/leave-management/PoliciesList"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function PoliciesPage() {
  return <PoliciesList />;
}
