"use client";

import dynamic from "next/dynamic";

const HRModules = dynamic(() => import("@/features/hr/components/modules"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function HRModulesPage() {
    return <HRModules />;
}