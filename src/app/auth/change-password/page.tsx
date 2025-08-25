"use client";

import dynamic from "next/dynamic";

const ChangePassword = dynamic(() => import("features/auth/components").then(mod => ({ default: mod.ChangePassword })), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function ChangePasswordPage() {
    return <ChangePassword />;
}