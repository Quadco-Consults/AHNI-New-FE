"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const GrantCreate = dynamic(
  () => import("@/features/contracts-grants/components/grant/create"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function GrantCreatePage() {
  return <GrantCreate />;
}
