"use client";

import dynamic from "next/dynamic";

const RFQQuotation = dynamic(() => import("@/features/procurement/components/solicitation-management/RFQ/create/Quotation"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function RFQQuotationPage() {
  return <RFQQuotation />;
}