"use client";

import dynamic from "next/dynamic";

const ForgotPassword = dynamic(() => import("features/auth/components").then(mod => ({ default: mod.ForgotPassword })), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function ForgotPasswordPage() {
    return <ForgotPassword />;
}