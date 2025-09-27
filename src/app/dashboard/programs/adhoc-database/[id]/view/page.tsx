"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const AdhocStaffView = dynamic(
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