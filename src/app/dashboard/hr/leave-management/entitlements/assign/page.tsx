"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const AssignEntitlementForm = dynamic(
  () => import("@/features/hr/components/leave-management/AssignEntitlementForm"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function AssignEntitlementPage() {
  return <AssignEntitlementForm />;
}
