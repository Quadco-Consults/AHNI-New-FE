"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";

const CreateFacilitatorApplicant = dynamicImport(
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