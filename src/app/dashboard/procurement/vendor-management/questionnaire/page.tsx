"use client";

import dynamic from "next/dynamic";

const VendorQuestionnaire = dynamic(() => import("@/features/procurement/components/vendor-management/vendor-registration/Questionier"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function VendorQuestionnairePage() {
  return <VendorQuestionnaire />;
}