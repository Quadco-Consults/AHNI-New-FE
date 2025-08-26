"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const ProcurementPlanIndex = dynamic(
  () => import("@/features/procurement/components/procurement-plan/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function ProcurementPlanPage() {
  return <ProcurementPlanIndex />;
}
