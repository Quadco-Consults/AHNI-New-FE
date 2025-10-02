"use client";

import GoBack from "components/GoBack";
import BreadcrumbCard from "components/Breadcrumb";
import CreateActivityMemoForm from "@/features/procurement/components/activity-memo/create/CreateActivityMemoForm";

export default function CreateActivityMemoPage() {
  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Activity Memo", icon: true },
    { name: "Create", icon: false },
  ];

  return (
    <section className="space-y-6">
      <BreadcrumbCard list={breadcrumbs} />
      <GoBack />
      <CreateActivityMemoForm />
    </section>
  );
}