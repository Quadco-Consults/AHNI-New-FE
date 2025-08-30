"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const GoodReceiveNoteCreateUploads = dynamic(
  () => import("@/features/admin/components/good-receive-note/create/uploads"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function GoodReceiveNoteCreatePage() {
  return <GoodReceiveNoteCreateUploads />;
}
