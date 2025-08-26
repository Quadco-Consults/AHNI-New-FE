"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const NewCompensation = dynamic(
  () => import("@/features/hr/components/employee-benefits/NewCompensation"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function NewCompensationPage() {
  return <NewCompensation />;
}
