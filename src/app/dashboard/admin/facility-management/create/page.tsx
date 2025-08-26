"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreateFacility = dynamic(
  () =>
    import(
      "@/features/admin/components/facility-management/facility-maintenance/create"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateFacilityPage() {
  return <CreateFacility />;
}
