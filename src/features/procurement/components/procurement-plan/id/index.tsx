"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useParams } from "next/navigation";
import ProcurementPlan from "./ProcurementPlan";
import ProcurementSummary from "./ProcurementSummary";
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

  // First, get the single plan to extract project and financial year
  const { data, isLoading } = ProcurementPlanAPI.useGetSingleProcurementPlan(
    id as string
  );

  // Safety check: ensure data is properly structured
  const rawData = (data?.data as any) || {};

  // Extract project and financial year from the single plan
  const projectId = rawData?.project?.id;
  const financialYear = rawData?.financial_year?.year;

  // Then, fetch ALL plans for the same project and financial year
  const { data: allPlansData, isLoading: isLoadingAllPlans } =
    ProcurementPlanAPI.useGetProcurementPlansByProject(
      projectId,
      financialYear,
      !!projectId // Only fetch when we have a project ID
    );

  // Recursively convert objects to safe values for React rendering
  const safeRender = (value: any): any => {
    if (value === null || value === undefined) return value;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
    if (Array.isArray(value)) return value.map(safeRender);
    if (typeof value === 'object') {
      // Handle specific object types that might be rendered
      // Handle category objects with {id, name, description, code, serial_number, job_category}
      if (value && 'job_category' in value && 'code' in value && 'serial_number' in value) {
        console.log('Found category object:', value);
        return value.name || value.description || `Category ${value.code}` || 'Category';
      }
      // Handle asset type objects
      if (value && ('asset_type' in value || 'asset_code' in value)) {
        console.log('Found asset object:', value);
        return value.name || value.description || 'Asset';
      }
      // For other objects, try to extract meaningful string representation
      if (value && value.name) return value.name;
      if (value && value.title) return value.title;
      if (value && value.description) return value.description;
      // Log any unhandled objects for debugging
      console.warn('Unhandled object type in safeRender:', value);
      // Return a safe string representation
      return '[Object]';
    }
    return value;
  };

  // Helper function to deeply clean objects
  const deepCleanObject = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') return obj;
    if (Array.isArray(obj)) return obj.map(deepCleanObject);
    if (typeof obj === 'object') {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        cleaned[key] = safeRender(value);
      }
      return cleaned;
    }
    return obj;
  };

  // Process all data fields to ensure they're safe for React rendering
  const safeData = deepCleanObject(rawData);

  // Add all plans as "items" array to safeData
  const safeDataWithItems = {
    ...safeData,
    items: allPlansData?.results || [], // Add all Excel rows as items
    totalCount: allPlansData?.count || 0,
  };

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
            <TabsTrigger value="procurement_summary">
              Procurement Summary
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
        {(isLoading || isLoadingAllPlans) && <LoadingSpinner />}
        {!isLoading && !isLoadingAllPlans && (
          <>
            <TabsContent value="procurement_plan">
              <Card>
                <ProcurementPlan {...(safeDataWithItems as ProcurementPlanResultsData)} />
              </Card>
            </TabsContent>
            <TabsContent value="procurement_summary">
              <Card>
                <ProcurementSummary {...(safeDataWithItems as ProcurementPlanResultsData)} />
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default ProcurementDetails;
