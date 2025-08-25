"use client";

import LongArrowLeft from "components/icons/LongArrowLeft";
import { useRouter } from "next/navigation";
import CreateActivityMemo from "./form";
import BreadcrumbCard from "components/Breadcrumb";

// type Props = {};

function CreatePurchaseRequest() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Sample Memo", icon: true },
    { name: "Create", icon: false },
  ];

  return (
    <section className='space-y-6'>
      <BreadcrumbCard list={breadcrumbs} />

      <button
        onClick={goBack}
        className='w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center'
      >
        <LongArrowLeft />
      </button>

      <CreateActivityMemo />
    </section>
  );
}

export default CreatePurchaseRequest;
