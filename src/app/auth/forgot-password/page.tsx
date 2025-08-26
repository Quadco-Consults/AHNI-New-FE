"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const ForgotPassword = dynamic(
  () =>
    import("features/auth/components").then((mod) => ({
      default: mod.ForgotPassword,
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
