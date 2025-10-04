"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const PolicyForm = dynamic(
  () => import("@/features/hr/components/leave-management/PolicyForm"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreatePolicyPage() {
  return <PolicyForm />;
}
