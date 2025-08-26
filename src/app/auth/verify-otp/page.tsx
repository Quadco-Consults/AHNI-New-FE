"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const VerifyOTP = dynamic(
  () =>
    import("features/auth/components").then((mod) => ({
      default: mod.VerifyOTP,
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function VerifyOTPPage() {
  return <VerifyOTP />;
}
