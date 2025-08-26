"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const FundRequestCreate = dynamic(
  () => import("@/features/programs/components/fund-request/create/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function FundRequestCreatePage() {
  return <FundRequestCreate />;
}
