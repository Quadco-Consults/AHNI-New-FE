"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";

const AdhocStaffEdit = dynamicImport(
  () =>
    import(
      "@/features/programs/components/adhoc-database/edit/AdhocStaffEdit"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function AdhocStaffEditPage() {
  return <AdhocStaffEdit />;
}