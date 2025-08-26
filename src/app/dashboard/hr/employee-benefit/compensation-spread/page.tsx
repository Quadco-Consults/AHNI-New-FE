"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CompensationSpread = dynamic(
  () => import("@/features/hr/components/employee-benefits/CompensationSpread"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CompensationSpreadPage() {
  return <CompensationSpread />;
}
