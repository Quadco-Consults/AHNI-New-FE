"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreateSeparationManagement = dynamic(
  () =>
    import(
      "@/features/hr/components/separation-management/CreateSeparationManagement"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function SeparationManagementCreatePage() {
  return <CreateSeparationManagement />;
}
