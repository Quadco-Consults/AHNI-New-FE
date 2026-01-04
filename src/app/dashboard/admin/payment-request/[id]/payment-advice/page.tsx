import PaymentAdvice from "@/features/admin/components/payment-request/payment-advice";


export async function generateStaticParams() {
  // Return empty array to generate no static pages by default
  // Pages will be generated on-demand in development
  return [];
}
export default function PaymentAdvicePage() {
  return <PaymentAdvice />;
}
