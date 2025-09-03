"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const ApplicationDetails = dynamic(
  () =>
    import(
      "@/features/contracts-grants/components/contract-management/consultant-management/create/ApplicationDetails"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function FacilitatorApplicationDetailsPage() {
  return <ApplicationDetails />;
}