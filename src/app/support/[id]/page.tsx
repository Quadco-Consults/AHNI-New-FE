"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";

const SupportDetails = dynamicImport(
  () => import("@/features/support/components/support/id"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function SupportDetailsPage() {
  return <SupportDetails />;
}