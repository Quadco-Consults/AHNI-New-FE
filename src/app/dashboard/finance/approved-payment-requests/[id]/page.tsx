import ApprovedPaymentRequestDetail from "@/features/finance/components/payments/ApprovedPaymentRequestDetail";

export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}

export default function ApprovedPaymentRequestDetailPage() {
  return <ApprovedPaymentRequestDetail />;
}
