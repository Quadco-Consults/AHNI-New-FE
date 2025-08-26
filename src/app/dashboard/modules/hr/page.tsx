"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const HRModules = dynamic(() => import("@/features/hr/components/modules"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function HRModulesPage() {
  return <HRModules />;
}
