"use client";

import dynamic from "next/dynamic";

const CreateFacilityMaintenance = dynamic(() => import("@/features/admin/components/facility-management/facility-maintenance/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function CreateFacilityMaintenancePage() {
    return <CreateFacilityMaintenance />;
}