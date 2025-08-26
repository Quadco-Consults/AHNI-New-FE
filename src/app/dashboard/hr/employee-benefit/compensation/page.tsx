"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const Compensation = dynamic(
  () => import("@/features/hr/components/employee-benefits/Compensation"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CompensationPage() {
  return <Compensation />;
}
