"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CreateUsers = dynamic(
  () =>
    import("@/features/auth/components/Users/CreateUsers").catch(() => ({ 
      default: () => <div>Failed to load component</div> 
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function UsersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateUsers />
    </Suspense>
  );
}
