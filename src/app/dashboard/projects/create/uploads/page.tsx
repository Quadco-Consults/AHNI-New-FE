"use client";

import dynamic from "next/dynamic";

const Uploads = dynamic(() => import("@/features/projects/components/projects/create/Uploads"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function ProjectUploadsPage() {
    return <Uploads />;
}