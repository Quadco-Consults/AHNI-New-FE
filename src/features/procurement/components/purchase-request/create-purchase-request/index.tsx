"use client";

import LongArrowLeft from "components/icons/LongArrowLeft";
import { useRouter } from "next/navigation";
import CreatePurchaseRequestForm from "./form";
import BreadcrumbCard from "components/Breadcrumb";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useGetPurchaseRequestById } from "@/features/procurement/controllers/purchaseRequestController";

function CreatePurchaseRequest() {
  const searchParams = useSearchParams();
  const id = searchParams.get("request");
  const router = useRouter();

  const { data: requestsDetails } = useGetPurchaseRequestById({ id: id as string, enabled: !!id });

  console.log({ requestsDetails });

  const goBack = () => {
    router.back();
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Request", icon: true },
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
      <span className='block space-y-2'>
        <h3 className='font-semibold text-xl text-black text-[24px]'>
          Purchase Request Form
        </h3>
      </span>

      <CreatePurchaseRequestForm expenses={requestsDetails?.expenses} />
    </section>
  );
}

export default CreatePurchaseRequest;
