"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";

const AdhocStaffView = dynamicImport(
  () =>
    import(
      "@/features/programs/components/adhoc-database/view/AdhocStaffView"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function AdhocStaffViewPage() {
  return <AdhocStaffView />;
}