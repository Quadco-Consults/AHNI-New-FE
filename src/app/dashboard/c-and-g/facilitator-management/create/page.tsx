"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreateFacilitator = dynamic(
  () =>
    import(
      "@/features/contracts-grants/components/facilitator-management/create/SimplifiedCreateFacilitator"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateFacilitatorPage() {
  return <CreateFacilitator />;
}
