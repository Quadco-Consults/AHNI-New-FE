"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreateActivityMemo = dynamic(
  () =>
    import("@/features/procurement/components/purchase-request/activity-memo"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function ActivityMemoPage() {
  return <CreateActivityMemo />;
}
