"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const RFQQuotation = dynamic(
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