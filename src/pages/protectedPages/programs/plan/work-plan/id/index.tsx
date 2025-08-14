import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useParams } from "react-router-dom";
import Summary from "./Summary";
import Activity from "./activity";
import { useGetSingleWorkPlanQuery } from "services/programsApi/work-plan";
import { skipToken } from "@reduxjs/toolkit/query/react";
import BreadcrumbCard, { TBreadcrumbList } from "components/shared/Breadcrumb";
import { LoadingSpinner } from "components/shared/Loading";
import GoBack from "components/shared/GoBack";
// import { Card } from "components/ui/card";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Work Plan", icon: true },
  { name: "Details", icon: false },
];

export default function WorkPlanDetail() {
  const { id } = useParams();

  const { data, isLoading } = useGetSingleWorkPlanQuery(id ?? skipToken);

  if (isLoading) return <LoadingSpinner />;

  if (!data) return null;

  const { activities } = data.data;

  return (
    <div className='space-y-10'>
      <BreadcrumbCard list={breadcrumbs} />

      <GoBack />

      <Tabs defaultValue='summary' className='space-y-10'>
        <TabsList>
          <TabsTrigger value='summary'>Summary</TabsTrigger>
          <TabsTrigger value='activity-report'>Activity/Report</TabsTrigger>
        </TabsList>
        <TabsContent value='summary'>
          <Summary data={data.data} />
        </TabsContent>
        <TabsContent value='activity-report'>
          <Activity activities={activities} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
