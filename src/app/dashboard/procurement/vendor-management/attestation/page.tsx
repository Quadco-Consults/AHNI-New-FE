"use client";

import dynamic from "next/dynamic";

const VendorAttestation = dynamic(() => import("@/features/procurement/components/vendor-management/vendor-registration/Attestation"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function VendorAttestationPage() {
  return <VendorAttestation />;
}