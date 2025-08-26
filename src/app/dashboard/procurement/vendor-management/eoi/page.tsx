"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const EOI = dynamic(
  () => import("@/features/procurement/components/vendor-management/eoi/EOI"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function EOIPage() {
  return <EOI />;
}
