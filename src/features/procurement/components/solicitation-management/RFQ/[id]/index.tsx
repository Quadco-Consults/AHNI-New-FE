"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useParams } from "next/navigation";

import { LoadingSpinner } from "components/Loading";
// import { SolicitationResultsData } from "definations/procurement-types/solicitation";
import DetailsContent from "./tab-contents/Details-content";
import VendorSubmission from "./tab-contents/Vendor-submission";
import BreadcrumbCard from "components/Breadcrumb";
import { useGetSolicitationById } from "@/features/procurement/controllers/solicitationController";
import GoBack from "components/GoBack";
import EOIVendorSubmission from "@/features/procurement/components/vendor-management/eoi/EOIVendorSubmission";
import SummaryOfTechnicalPrequalification from "@/features/procurement/components/competitive-bid-analysis/[id]/SummaryOfTechnicalPrequalification";

const RFQDetails = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetSolicitationById({ id: id as string, enabled: !!id });

  if (isLoading) return <LoadingSpinner />;

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Solicitation Management", icon: true },
    { name: "RFQ", icon: true },
    { name: "Detail", icon: false },
  ];

  console.log({ data: data?.data?.tender_type });
  // NATIONAL OPEN TENDER
  return (
    <div className='space-y-5'>
      <GoBack />
      <BreadcrumbCard list={breadcrumbs} />
      <div className='flex justify-between'>
        <h4 className='text-lg font-bold'>{data?.data?.title}</h4>
      </div>

      <Tabs defaultValue='rfq-details'>
        <TabsList>
          <TabsTrigger value='rfq-details'>RFQ Details</TabsTrigger>
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
        <TabsContent value='rfq-details'>
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

export default RFQDetails;
