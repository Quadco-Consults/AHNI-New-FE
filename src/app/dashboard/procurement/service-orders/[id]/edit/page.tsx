"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";

const EditServiceOrder = dynamicImport(
  () =>
    import("@/features/procurement/components/service-order/EditServiceOrder"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function EditServiceOrderPage() {
  return <EditServiceOrder />;
}
