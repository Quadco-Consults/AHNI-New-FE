"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import Uploads from "./Uploads";
import { useParams } from "next/navigation";
import VendorsAPI from "@/features/procurementApi/vendorsController";
import { LoadingSpinner } from "components/Loading";

import GoBack from "components/GoBack";
import Details from "./Details";
import Resolutions from "./Resolutions";
import Feedback from "./Feedback";
import { useGetGrievance } from "@/features/hr/controllers/grievanceController";

const PrequalificationDetails = () => {
  const { id } = useParams();

  const { data: grievanceData, isLoading } = useGetGrievance(id as string);

  console.log("Grievance data:", { grievanceData });

  if (isLoading) {
    return <LoadingSpinner />;
  }
  const grievance = grievanceData?.data;
  return (
    <div className='space-y-5'>
      <Tabs defaultValue='details'>
        <div className='flex items-center gap-3'>
          <GoBack />
          <TabsList>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='uploads'>Uploads</TabsTrigger>
            <TabsTrigger value='resolution'>Resolution</TabsTrigger>
            <TabsTrigger value='feed-back'>Feedback</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='details'>
          <Details {...grievance} />
        </TabsContent>
        <TabsContent value='uploads'>
          <Uploads {...grievance} />
        </TabsContent>
        <TabsContent value='resolution'>
          <Resolutions {...grievance} />
        </TabsContent>
        <TabsContent value='feed-back'>
          <Feedback {...grievance} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrequalificationDetails;
