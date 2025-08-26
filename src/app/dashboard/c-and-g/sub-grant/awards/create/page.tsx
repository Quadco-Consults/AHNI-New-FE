"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const SubGrantAwardsCreate = dynamic(
  () =>
    import("@/features/contracts-grants/components/sub-grant/awards/create"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function SubGrantAwardsCreatePage() {
  return <SubGrantAwardsCreate />;
}
