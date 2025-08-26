"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const ChangePassword = dynamic(
  () =>
    import("features/auth/components").then((mod) => ({
      default: mod.ChangePassword,
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function ChangePasswordPage() {
  return <ChangePassword />;
}
