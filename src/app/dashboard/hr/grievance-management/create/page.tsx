"use client";

import dynamic from "next/dynamic";

const CreateGrievance = dynamic(() => import("@/features/hr/components/grievance-management/form"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function CreateGrievancePage() {
  return <CreateGrievance />;
}