"use client";

import dynamic from "next/dynamic";

const CreateEmployee = dynamic(() => import("@/features/hr/components/workforce-database/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function CreateEmployeePage() {
  return <CreateEmployee />;
}