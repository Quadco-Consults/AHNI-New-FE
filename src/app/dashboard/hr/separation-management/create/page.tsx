"use client";

import dynamic from "next/dynamic";

const CreateSeparationManagement = dynamic(() => import("@/features/hr/components/separation-management/CreateSeparationManagement"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function SeparationManagementCreatePage() {
  return <CreateSeparationManagement />;
}