"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreateGrievance = dynamic(
  () => import("@/features/hr/components/grievance-management/form"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateGrievancePage() {
  return <CreateGrievance />;
}
