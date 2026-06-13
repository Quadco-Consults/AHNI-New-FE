"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";

import { LoadingSpinner } from "@/components/Loading";
// import { SolicitationResultsData } from "definitions/procurement-types/solicitation";
import DetailsContent from "./tab-contents/Details-content";
import VendorSubmission from "./tab-contents/Vendor-submission";
import ApprovalWorkflowContent from "./tab-contents/ApprovalWorkflow";
import CommitteeEvaluation from "./tab-contents/CommitteeEvaluation";
import BreadcrumbCard from "@/components/Breadcrumb";
import { useGetSingleSolicitation } from "@/features/procurement/controllers/solicitationController";
import { skipToken } from "@reduxjs/toolkit/query/react";
import GoBack from "@/components/GoBack";
import EOIVendorSubmission from "@/features/procurement/components/vendor-management/eoi/eoi-tabs-contents/EOIVendorSubmission";
import SummaryOfTechnicalPrequalification from "@/features/procurement/components/competitive-bid-analysis/[id]/SummaryOfTechnicalPrequalification";

const RFPDetails = () => {
  const { id } = useParams();
  const solicitationId = Array.isArray(id) ? id[0] : id;

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Solicitation Management", icon: true },
    { name: "RFP", icon: true },
    { name: "Detail", icon: false },
  ];

  const { data, isLoading, error } = useGetSingleSolicitation(solicitationId ?? skipToken);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className='space-y-5'>
        <BreadcrumbCard list={breadcrumbs} />
        <GoBack />
        <div className='text-center p-10'>
          <h3 className='text-lg font-semibold text-red-600 mb-2'>Error Loading RFP Details</h3>
          <p className='text-gray-600'>{error.message || 'Failed to load RFP advertisement details'}</p>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className='space-y-5'>
        <BreadcrumbCard list={breadcrumbs} />
        <GoBack />
        <div className='text-center p-10'>
          <h3 className='text-lg font-semibold text-yellow-600 mb-2'>No RFP Found</h3>
          <p className='text-gray-600'>The RFP advertisement with ID {solicitationId} was not found.</p>
        </div>
      </div>
    );
  }

  console.log("🚀 RFP MAIN PAGE DEBUG:", {
    solicitationId,
    fullResponse: data,
    responseData: data?.data,
    error,
    isLoading,
    title: data?.data?.title,
    tender_type: data?.data?.tender_type,
    status: data?.data?.status,
    rfq_id: data?.data?.rfq_id,
    background: data?.data?.background,
    solicitation_items: data?.data?.solicitation_items,
    allDataKeys: data?.data ? Object.keys(data.data) : [],
    hasData: !!data?.data,
    apiEndpoint: `procurements/solicitations/${solicitationId}`
  });
  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />
      <GoBack />
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
          <TabsTrigger value='committee-evaluation'>
            Committee Evaluation
          </TabsTrigger>
          <TabsTrigger value='vendor-submission-evaluation'>
            Vendor Submission Evaluation
          </TabsTrigger>
          <TabsTrigger value='approval-workflow'>
            Approval Workflow
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

        <TabsContent value='committee-evaluation'>
          <CommitteeEvaluation solicitationId={solicitationId} rfpData={data?.data} />
        </TabsContent>

        <TabsContent value='vendor-submission-evaluation'>
          {/* @ts-ignore */}
          <SummaryOfTechnicalPrequalification id={id} />
        </TabsContent>

        <TabsContent value='approval-workflow'>
          <ApprovalWorkflowContent solicitationId={solicitationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RFPDetails;
