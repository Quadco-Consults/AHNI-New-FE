"use client";

import dynamic from "next/dynamic";

const ExpenseAuthorizationCreate = dynamic(() => import("@/features/admin/components/expense-authorization/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function ExpenseAuthorizationCreatePage() {
  return <ExpenseAuthorizationCreate />;
}