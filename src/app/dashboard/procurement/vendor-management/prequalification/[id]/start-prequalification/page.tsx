"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";

const StartPrequalification = dynamicImport(
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