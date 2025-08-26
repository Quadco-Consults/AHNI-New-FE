"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const Uploads = dynamic(
  () => import("@/features/projects/components/projects/create/Uploads"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function ProjectUploadsPage() {
  return <Uploads />;
}
