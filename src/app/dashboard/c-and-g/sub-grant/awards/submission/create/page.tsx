"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const SubGrantSubmissionCreate = dynamic(
  () =>
    import(
      "@/features/contracts-grants/components/sub-grant/awards/id/submission/create/index"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function SubGrantSubmissionCreatePage() {
  return <SubGrantSubmissionCreate />;
}
