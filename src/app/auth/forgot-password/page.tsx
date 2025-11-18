"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const ForgotPassword = dynamic(
  () =>
    import("@/features/auth/components/ForgotPassword").then((mod) => ({
      default: mod.default,
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
