"use client";

import GoBack from "@/components/GoBack";
import CreateActivityMemo from "./form";
import BreadcrumbCard from "@/components/Breadcrumb";

// type Props = {};

function CreatePurchaseRequest() {

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Sample Memo", icon: true },
    { name: "Create", icon: false },
  ];

  return (
    <section className='space-y-6'>
      <BreadcrumbCard list={breadcrumbs} />

      <GoBack />

      <CreateActivityMemo />
    </section>
  );
}

export default CreatePurchaseRequest;
