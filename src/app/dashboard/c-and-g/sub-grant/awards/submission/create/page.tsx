"use client";

import dynamic from "next/dynamic";

const SubGrantSubmissionCreate = dynamic(() => import("@/features/contracts-grants/components/sub-grant/awards/id/submission/create/index"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function SubGrantSubmissionCreatePage() {
    return <SubGrantSubmissionCreate />;
}