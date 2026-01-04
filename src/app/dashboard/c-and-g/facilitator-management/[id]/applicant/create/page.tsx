"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreateFacilitatorApplicant = dynamic(
  () =>
    import(
      "@/features/contracts-grants/components/facilitator-management/applicant/CreateApplicant"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateFacilitatorApplicantPage() {
  return <CreateFacilitatorApplicant />;
}