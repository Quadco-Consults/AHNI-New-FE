"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useParams } from "next/navigation";
import ProcurementPlan from "./ProcurementPlan";
import ProcurementMilestones from "./ProcurementMilestones";
import BreadcrumbCard from "components/Breadcrumb";
import GoBack from "components/GoBack";
import Card from "components/Card";
import ProcurementPlanAPI from "@/features/procurement/controllers/procurementPlanController";
import { LoadingSpinner } from "components/Loading";
import { ProcurementPlanResultsData } from "@/features/procurement/types/procurementPlan";
import { Button } from "components/ui/button";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const ProcurementDetails = () => {
  const { id } = useParams();
  const [isDownloading, setIsDownloading] = useState(false);

  const { data, isLoading } = ProcurementPlanAPI.useGetSingleProcurementPlan(
    id as string
  );

  // Hook for downloading (disabled by default, triggered manually)
  const { refetch: downloadPlan } = ProcurementPlanAPI.useDownloadSingleProcurementPlan(
    id as string,
    false // Disabled by default
  );

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadPlan();
      toast.success("Procurement plan downloaded successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to download procurement plan");
    } finally {
      setIsDownloading(false);
    }
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Procurement Plan", icon: true },
    { name: "Detail", icon: false },
  ];

  return (
    <div className="space-y-5 relative min-h-screen">
      <BreadcrumbCard list={breadcrumbs} />

      <GoBack />

      <Tabs defaultValue="procurement_plan">
        <div className="relative pb-2 flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="procurement_plan">Procurement Plan</TabsTrigger>
            <TabsTrigger value="procurement_milestones">
              Procurement Milestones
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={handleDownload}
            disabled={isDownloading || isLoading}
            className="flex items-center gap-2"
            variant="outline"
          >
            <DownloadIcon className="h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download Plan"}
          </Button>
        </div>
        {isLoading && <LoadingSpinner />}
        <TabsContent value="procurement_plan">
          <Card>
            <ProcurementPlan {...(data?.data as ProcurementPlanResultsData)} />
          </Card>
        </TabsContent>
        <TabsContent value="procurement_milestones">
          <Card>
            <ProcurementMilestones {...(data?.data as ProcurementPlanResultsData)} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcurementDetails;
