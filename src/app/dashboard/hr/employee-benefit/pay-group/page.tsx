"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const PayGroup = dynamic(
  () => import("@/features/hr/components/employee-benefits/PayGroup"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function PayGroupPage() {
  return <PayGroup />;
}
