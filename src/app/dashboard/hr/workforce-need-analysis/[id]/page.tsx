"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const WorkforceNeedAnalysisViewIndex = dynamic(
  () => import("@/features/hr/components/workforce-need-analysis/view/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function WorkforceNeedAnalysisViewPage({
  params,
}: {
  params: { id: string };
}) {
  return <WorkforceNeedAnalysisViewIndex id={params.id} />;
}