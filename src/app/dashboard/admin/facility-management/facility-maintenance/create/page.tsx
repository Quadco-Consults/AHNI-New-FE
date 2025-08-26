"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreateFacilityMaintenance = dynamic(
  () =>
    import(
      "@/features/admin/components/facility-management/facility-maintenance/create"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateFacilityMaintenancePage() {
  return <CreateFacilityMaintenance />;
}
