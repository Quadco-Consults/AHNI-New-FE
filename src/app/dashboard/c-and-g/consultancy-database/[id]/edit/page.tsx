"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";

const ConsultancyStaffEdit = dynamicImport(
  () =>
    import(
      "@/features/contracts-grants/components/contract-management/consultancy-database/edit/ConsultancyStaffEdit"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function ConsultancyStaffEditPage() {
  return <ConsultancyStaffEdit />;
}
