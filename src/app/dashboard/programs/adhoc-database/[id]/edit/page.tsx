"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const AdhocStaffEdit = dynamic(
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