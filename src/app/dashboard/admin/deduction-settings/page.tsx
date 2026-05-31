"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const DeductionSettingsHome = dynamic(
  () => import("@/features/admin/components/deduction-settings"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function DeductionSettingsPage() {
  return <DeductionSettingsHome />;
}
