"use client";

import GoBack from "@/components/GoBack";
import { useParams } from "next/navigation";
import EditPurchaseRequestForm from "./form";
import BreadcrumbCard from "@/components/Breadcrumb";
import { useGetPurchaseRequestById } from "@/features/procurement/controllers/purchaseRequestController";
import { useGetActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { LoadingSpinner } from "@/components/Loading";

function PurchaseRequestEdit() {
  const { id } = useParams();

  // Get purchase request data
  const { data: purchaseRequest, isLoading: isPRLoading } = useGetPurchaseRequestById(id as string);

  // Get activity memo data if available
  const activityMemoId = purchaseRequest?.data?.request_memo;
  const { data: activityMemo, isLoading: isAMLoading } = useGetActivityMemo(activityMemoId as string, !!activityMemoId);

  console.log("=== EDIT PAGE DEBUG ===");
  console.log("Purchase Request ID:", id);
  console.log("Purchase Request Data:", purchaseRequest);
  console.log("Activity Memo ID:", activityMemoId);
  console.log("Activity Memo Data (raw):", activityMemo);
  console.log("Activity Memo Data structure check:", {
    hasData: !!activityMemo,
    isObject: typeof activityMemo === 'object',
    keys: activityMemo ? Object.keys(activityMemo).slice(0, 5) : []
  });


  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Request", icon: true },
    { name: "Edit", icon: false },
  ];

  if (isPRLoading || isAMLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className='space-y-6'>
      <BreadcrumbCard list={breadcrumbs} />

      <GoBack />

      <span className='block space-y-2'>
        <h3 className='font-semibold text-xl text-black text-[24px]'>
          Edit Purchase Request & Activity Memo
        </h3>
        <p className='text-gray-600'>
          PR REF: {purchaseRequest?.data?.ref_number || 'N/A'}
        </p>
        {activityMemo && (
          <p className='text-gray-600 text-sm'>
            Activity Memo: {activityMemo.subject || 'N/A'}
          </p>
        )}
      </span>

      <EditPurchaseRequestForm
        purchaseRequestData={purchaseRequest?.data}
        activityMemoData={activityMemo}
        purchaseRequestId={id as string}
      />
    </section>
  );
}

export default PurchaseRequestEdit;