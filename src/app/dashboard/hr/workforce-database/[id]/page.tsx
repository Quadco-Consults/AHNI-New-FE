"use client";

export const dynamic = "force-dynamic";
import WorkforceDetail from "@/features/hr/components/workforce-database/id/index";

export default function WorkforceDetailPage({ params }: { params: { id: string } }) {
    console.log("🔍 WorkforceDetailPage - params:", params);
    return <WorkforceDetail />;
}