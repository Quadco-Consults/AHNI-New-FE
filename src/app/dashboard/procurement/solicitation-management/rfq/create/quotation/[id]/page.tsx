"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";

const RFQQuotation = dynamicImport(
  () =>
    import(
      "@/features/procurement/components/solicitation-management/RFQ/create/Quotation"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function RFQQuotationPage() {
  return <RFQQuotation />;
}