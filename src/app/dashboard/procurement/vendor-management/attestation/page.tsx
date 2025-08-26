"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const VendorAttestation = dynamic(
  () =>
    import(
      "@/features/procurement/components/vendor-management/vendor-registration/Attestation"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function VendorAttestationPage() {
  return <VendorAttestation />;
}
