"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CompensationDetails = dynamic(
  () => import("@/features/hr/components/employee-benefits/CompensationDetails"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CompensationDetailsPage() {
  return <CompensationDetails />;
}
