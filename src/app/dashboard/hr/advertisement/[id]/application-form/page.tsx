"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const ApplicationForm = dynamic(
  () => import("@/features/hr/components/advertisement/id/ApplicationForm"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function ApplicationFormPage() {
  return <ApplicationForm />;
}