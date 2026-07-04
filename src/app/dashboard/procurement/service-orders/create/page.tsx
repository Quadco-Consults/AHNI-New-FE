"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreateServiceOrder = dynamic(
  () =>
    import("@/features/procurement/components/service-order/ServiceOrderNew"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateServiceOrderPage() {
  return <CreateServiceOrder />;
}
