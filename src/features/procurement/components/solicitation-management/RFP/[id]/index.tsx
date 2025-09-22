"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useParams } from "next/navigation";

import { LoadingSpinner } from "components/Loading";
// import { SolicitationResultsData } from "definations/procurement-types/solicitation";
import DetailsContent from "./tab-contents/Details-content";
import VendorSubmission from "./tab-contents/Vendor-submission";
import BreadcrumbCard from "components/Breadcrumb";
import { useGetSingleSolicitation } from "@/features/procurement/controllers/solicitationController";
import { skipToken } from "@reduxjs/toolkit/query/react";
import GoBack from "components/GoBack";
import EOIVendorSubmission from "@/features/procurement/components/vendor-management/eoi/eoi-tabs-contents/EOIVendorSubmission";
import SummaryOfTechnicalPrequalification from "@/features/procurement/components/competitive-bid-analysis/[id]/SummaryOfTechnicalPrequalification";

const RFPDetails = () => {
  const { id } = useParams();
  const solicitationId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading } = useGetSingleSolicitation(solicitationId ?? skipToken);

  if (isLoading) return <LoadingSpinner />;

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Solicitation Management", icon: true },
    { name: "RFP", icon: true },
    { name: "Detail", icon: false },
  ];

  console.log({ data: data?.data?.tender_type });
  return (
    <div className='space-y-5'>
      <GoBack />
      <BreadcrumbCard list={breadcrumbs} />
      <div className='flex justify-between'>
        <h4 className='text-lg font-bold'>{data?.data?.title}</h4>
      </div>

      <Tabs defaultValue='rfp-details'>
        <TabsList>
          <TabsTrigger value='rfp-details'>RFP Details</TabsTrigger>
          {data?.data?.tender_type === "NATIONAL OPEN TENDER" && (
            <TabsTrigger value='vendor-evaluation'>
              Vender Evaluation
            </TabsTrigger>
          )}
          <TabsTrigger value='vendor-submission'>Vendor Submission</TabsTrigger>
          <TabsTrigger value='vendor-submission-evaluation'>
            Vendor Submission Evaluation
          </TabsTrigger>
        </TabsList>
        <TabsContent value='rfp-details'>
          {data && <DetailsContent {...data?.data} />}
        </TabsContent>
        <TabsContent value='vendor-evaluation'>
          <EOIVendorSubmission status='Pending' />
        </TabsContent>
        <TabsContent value='vendor-submission'>
          {/* @ts-ignore */}
          {data && <VendorSubmission {...data?.data} />}
        </TabsContent>

        <TabsContent value='vendor-submission-evaluation'>
          {/* @ts-ignore */}
          <SummaryOfTechnicalPrequalification id={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RFPDetails;
