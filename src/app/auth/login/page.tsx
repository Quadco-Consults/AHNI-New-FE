"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const Login = dynamic(
  () =>
    import("features/auth/components").then((mod) => ({ default: mod.Login })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function LoginPage() {
  return <Login />;
}
