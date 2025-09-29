"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useParams, useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import { Icon } from "@iconify/react";
import { LoadingSpinner } from "components/Loading";
// import { SolicitationResultsData } from "definations/procurement-types/solicitation";
import DetailsContent from "./tab-contents/Details-content";
import VendorSubmission from "./tab-contents/Vendor-submission";
import BreadcrumbCard from "components/Breadcrumb";
import { useGetSingleSolicitation } from "features/procurement/controllers/solicitationController";
import GoBack from "components/GoBack";
import EOIVendorSubmission from "features/procurement/components/vendor-management/eoi/eoi-tabs-contents/EOIVendorSubmission";
import SummaryOfTechnicalPrequalification from "features/procurement/components/competitive-bid-analysis/[id]/SummaryOfTechnicalPrequalification";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import { toast } from "sonner";

const RFQDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  console.log("RFQDetails ID:", id);

  const { data, isLoading, error } = useGetSingleSolicitation(id as string, !!id);

  // Get vendor submissions for this RFQ
  const { data: submissionsData } = useGetSolicitationSubmission(id as string, !!id);

  // Check if there's an existing CBA for this solicitation
  const { data: cbaData } = CbaAPI.useGetAllCbas({});
  const existingCba = cbaData?.results?.find(
    (cba: any) => cba.solicitation?.id === id
  );

  console.log("RFQDetails data:", data, "loading:", isLoading, "error:", error);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return <div className="p-5">Error loading RFQ: {error.message}</div>;
  }

  if (!data) {
    return <div className="p-5">No RFQ data found</div>;
  }

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Solicitation Management", icon: true },
    { name: "RFQ", icon: true },
    { name: "Detail", icon: false },
  ];

  // Check if this RFQ came from EOI (checking multiple possible field names)
  const isFromEOI = (data?.data as any)?.eoi_tender || (data?.data as any)?.eoi_id || (data?.data as any)?.eoi;

  // Get vendor submissions for evaluation
  const submissions = (submissionsData as any)?.data?.data?.results || (submissionsData as any)?.data?.results || [];
  const hasSubmissions = submissions && submissions.length > 0;

  const handleCreateEvaluation = () => {
    if (!hasSubmissions) {
      toast.error("No vendor submissions found for evaluation");
      return;
    }

    if (existingCba) {
      // Navigate to existing CBA
      router.push(`/dashboard/procurement/competitive-bid-analysis/${(existingCba as any).id}`);
    } else {
      // Navigate to create CBA
      const eoiId = (data?.data as any)?.eoi_id || (data?.data as any)?.eoi_tender || (data?.data as any)?.eoi;
      router.push(`/dashboard/procurement/solicitation-management/rfq/create/create-cba?rfq_id=${id}&eoi_id=${eoiId}`);
    }
  };

  console.log({
    data: data?.data?.tender_type,
    isFromEOI,
    hasSubmissions,
    existingCba,
    submissions: submissions?.length || 0
  });

  return (
    <div className="space-y-5">
      <GoBack />
      <BreadcrumbCard list={breadcrumbs} />
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-bold">{data?.data?.title}</h4>

        {/* Show evaluation button only for EOI-sourced RFQs with submissions */}
        {isFromEOI && hasSubmissions && (
          <Button
            onClick={handleCreateEvaluation}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Icon icon="heroicons:clipboard-document-check" className="mr-2" />
            {existingCba ? "View Evaluation" : "Create Vendor Evaluation"}
          </Button>
        )}
      </div>

      <Tabs defaultValue="rfq-details">
        <TabsList>
          <TabsTrigger value="rfq-details">RFQ Details</TabsTrigger>
          <TabsTrigger value="vendor-submission">Vendor Submission</TabsTrigger>
          {/* Only show vendor submission evaluation tab for EOI national open tenders */}
          {isFromEOI && (
            <TabsTrigger value="vendor-submission-evaluation">
              Vendor Submission Evaluation
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="rfq-details">
          {data && <DetailsContent {...data?.data} />}
        </TabsContent>
        <TabsContent value="vendor-submission">
          {/* @ts-ignore */}
          {data && <VendorSubmission {...data?.data} />}
        </TabsContent>

        {/* Only render vendor submission evaluation content for EOI national open tenders */}
        {isFromEOI && (
          <TabsContent value="vendor-submission-evaluation">
            <SummaryOfTechnicalPrequalification solicitationId={id as string} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default RFQDetails;
