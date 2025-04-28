import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import Uploads from "./Uploads";
import { useParams } from "react-router-dom";
import VendorsAPI from "services/procurementApi/vendors";
import { LoadingSpinner } from "components/shared/Loading";

import GoBack from "components/shared/GoBack";
import Details from "./Details";
import Resolutions from "./Resolutions";
import Feedback from "./Feedback";
import { useGetGrievianceManagementQuery } from "services/hrApi/hr-grieviance-management";

const PrequalificationDetails = () => {
  const { id } = useParams();

  const { data: grievanceData, isLoading } = useGetGrievianceManagementQuery({
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
