"use client";

import GoBack from "components/GoBack";
import CreatePurchaseRequestForm from "./form";
import BreadcrumbCard from "components/Breadcrumb";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useGetPurchaseRequestById } from "@/features/procurement/controllers/purchaseRequestController";

function CreatePurchaseRequest() {
  const searchParams = useSearchParams();
  const id = searchParams.get("request");

  // Only fetch purchase request data if the ID looks like a purchase request ID
  // Activity memo IDs are UUIDs (with dashes), purchase request IDs have different format
  const isUUID = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const isPurchaseRequestId = id && !isUUID; // If it's not a UUID, assume it's a purchase request ID

  const { data: requestsDetails } = useGetPurchaseRequestById(
    id as string,
    !!id && isPurchaseRequestId
  );

  console.log("🔍 ID from URL:", id);
  console.log("🔍 Is UUID (Activity Memo ID):", isUUID);
  console.log("🔍 Is Purchase Request ID:", isPurchaseRequestId);
  console.log("🔍 Purchase Request Details:", requestsDetails);

  if (isUUID) {
    console.log("🔍 This appears to be an Activity Memo ID - will use Redux data");
  } else if (isPurchaseRequestId) {
    console.log("🔍 This appears to be a Purchase Request ID - will use API data");
  }


  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Request", icon: true },
    { name: "Create", icon: false },
  ];

  return (
    <section className='space-y-6'>
      <BreadcrumbCard list={breadcrumbs} />

      <GoBack />
      <span className='block space-y-2'>
        <h3 className='font-semibold text-xl text-black text-[24px]'>
          Purchase Request Form
        </h3>
      </span>

      <CreatePurchaseRequestForm expenses={isPurchaseRequestId ? requestsDetails?.data?.items : null} />
    </section>
  );
}

export default CreatePurchaseRequest;
