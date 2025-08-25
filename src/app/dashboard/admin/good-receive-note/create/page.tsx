"use client";

import dynamic from "next/dynamic";

const GoodReceiveNoteCreate = dynamic(() => import("@/features/admin/components/good-receive-note/create/index"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function GoodReceiveNoteCreatePage() {
  return <GoodReceiveNoteCreate />;
}