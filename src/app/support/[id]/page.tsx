"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const SupportDetails = dynamic(
  () => import("@/features/support/components/support/id"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function SupportDetailsPage() {
  return <SupportDetails />;
}