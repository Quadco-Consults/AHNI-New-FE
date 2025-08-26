"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const ExpenseAuthorizationCreate = dynamic(
  () => import("@/features/admin/components/expense-authorization/create"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function ExpenseAuthorizationCreatePage() {
  return <ExpenseAuthorizationCreate />;
}
