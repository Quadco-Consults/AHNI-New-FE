"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const StartPrequalification = dynamic(
  () =>
    import(
      "@/features/procurement/components/vendor-management/prequalification/id/Start-prequalification"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function StartPrequalificationPage() {
  return <StartPrequalification />;
}