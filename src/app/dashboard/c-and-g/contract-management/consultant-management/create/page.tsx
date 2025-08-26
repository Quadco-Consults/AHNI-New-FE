"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const ConsultantManagementCreate = dynamic(
  () =>
    import(
      "@/features/contracts-grants/components/contract-management/consultant-management/create/Layout"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function ConsultantManagementCreatePage() {
  return <ConsultantManagementCreate />;
}
