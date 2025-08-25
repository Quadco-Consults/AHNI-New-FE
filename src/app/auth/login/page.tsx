"use client";

import dynamic from "next/dynamic";

const Login = dynamic(() => import("features/auth/components").then(mod => ({ default: mod.Login })), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function LoginPage() {
    return <Login />;
}