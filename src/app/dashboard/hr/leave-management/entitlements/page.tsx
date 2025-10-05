"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const EmployeeEntitlements = dynamic(
  () => import("@/features/hr/components/leave-management/EmployeeEntitlements"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function EntitlementsPage() {
  return <EmployeeEntitlements />;
}
