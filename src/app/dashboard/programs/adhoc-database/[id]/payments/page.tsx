"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";

const AdhocPaymentTracking = dynamicImport(
  () =>
    import(
      "@/features/programs/components/adhoc-database/payments/AdhocPaymentTracking"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function AdhocPaymentTrackingPage() {
  return <AdhocPaymentTracking />;
}
