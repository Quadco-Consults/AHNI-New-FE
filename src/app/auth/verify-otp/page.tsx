"use client";

import dynamic from "next/dynamic";

const VerifyOTP = dynamic(() => import("features/auth/components").then(mod => ({ default: mod.VerifyOTP })), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function VerifyOTPPage() {
    return <VerifyOTP />;
}