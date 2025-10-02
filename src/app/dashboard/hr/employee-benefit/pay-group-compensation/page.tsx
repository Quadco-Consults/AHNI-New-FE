"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const PayGroupCompensation = dynamic(
  () => import("@/features/hr/components/employee-benefits/PayGroupCompensation"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function PayGroupCompensationPage() {
  return <PayGroupCompensation />;
}
