"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreateSubGrant = dynamic(
  () => import("@/features/contracts-grants/components/sub-grant/create"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateSubGrantPage() {
  return <CreateSubGrant />;
}