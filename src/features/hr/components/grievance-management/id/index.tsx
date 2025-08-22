import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import Uploads from "./Uploads";
import { useParams } from "next/navigation";
import VendorsAPI from "@/features/procurementApi/vendorsController";
import { LoadingSpinner } from "components/Loading";

import GoBack from "components/GoBack";
import Details from "./Details";
import Resolutions from "./Resolutions";
import Feedback from "./Feedback";
import { useGetGrievianceManagement } from "@/features/hr/controllers/grievance-management//grievanceManagement";

const PrequalificationDetails = () => {
  const { id } = useParams();

  const { data: grievanceData, isLoading } = useGetGrievianceManagement({
     id: id as string ,
  });

  console.log({ grievanceData });

  if (isLoading) {
    return <LoadingSpinner />;
  }
  const data: any = [];
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
          <Details {...(grievanceData?.data as any)} />
        </TabsContent>
        <TabsContent value='uploads'>
          <Uploads {...(grievanceData?.data as any)} />
        </TabsContent>
        <TabsContent value='resolution'>
          <Resolutions {...(grievanceData?.data as any)} />
        </TabsContent>
        <TabsContent value='feed-back'>
          <Feedback {...(grievanceData?.data as any)} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrequalificationDetails;
