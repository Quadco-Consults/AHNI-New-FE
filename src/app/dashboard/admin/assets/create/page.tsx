"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const AssetsCreate = dynamic(
  () => import("@/features/admin/components/assets/create"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function AssetsCreatePage() {
  return <AssetsCreate />;
}
