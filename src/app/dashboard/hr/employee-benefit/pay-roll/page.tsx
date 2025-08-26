"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const Payroll = dynamic(
  () => import("@/features/hr/components/employee-benefits/Payroll/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function PayrollPage() {
  return <Payroll />;
}
