"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";

const EditFundRequest = dynamicImport(
  () => import("@/features/programs/components/fund-request/edit/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function EditFundRequestPage() {
  return <EditFundRequest />;
}