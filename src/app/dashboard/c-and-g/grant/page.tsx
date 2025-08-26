"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const GrantIndex = dynamic(
  () => import("@/features/contracts-grants/components/grant/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function GrantPage() {
  return <GrantIndex />;
}
