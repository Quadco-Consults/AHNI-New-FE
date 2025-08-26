"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const VendorQuestionnaire = dynamic(
  () =>
    import(
      "@/features/procurement/components/vendor-management/vendor-registration/Questionier"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function VendorQuestionnairePage() {
  return <VendorQuestionnaire />;
}
