"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreateEmployee = dynamic(
  () => import("@/features/hr/components/workforce-database/create"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateEmployeePage() {
  return <CreateEmployee />;
}
