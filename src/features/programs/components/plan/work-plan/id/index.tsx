"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useParams } from "next/navigation";
import Summary from "./Summary";
import Activity from "./activity";
import { useGetSingleWorkPlan } from "@/features/programs/controllers/workPlanController";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import { LoadingSpinner } from "components/Loading";
import GoBack from "components/GoBack";
// import { Card } from "components/ui/card";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Work Plan", icon: true },
  { name: "Details", icon: false },
];

export default function WorkPlanDetail() {
  const { id } = useParams();

  const { data, isLoading } = useGetSingleWorkPlan(id as string, !!id);

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
