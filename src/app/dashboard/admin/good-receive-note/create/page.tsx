"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const GoodReceiveNoteCreate = dynamic(
  () => import("@/features/admin/components/good-receive-note/create/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function GoodReceiveNoteCreatePage() {
  return <GoodReceiveNoteCreate />;
}
