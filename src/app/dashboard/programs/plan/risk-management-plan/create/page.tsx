"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const RiskManagementCreate = dynamic(
  () => import("@/features/programs/components/plan/risk-management/create"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function RiskManagementCreatePage() {
  return <RiskManagementCreate />;
}
