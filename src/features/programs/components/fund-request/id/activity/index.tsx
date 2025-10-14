"use client";

import Card from "components/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ActivityTab from "./Activity-tab";
import DetailTab from "./Details-tab";
import ChartTab from "./ChartTab";
import MeasurementTab from "./Measurement-tab";
import BudgetTab from "./Budget-tab";
import { useSearchParams } from "next/navigation";
import { useGetSingleFundRequest } from "@/features/programs/controllers";
import { LoadingSpinner } from "components/Loading";

const Activity = () => {
  const searchParams = useSearchParams();
  const fundRequestId = searchParams?.get("fundRequestId");

  const { data: fundRequest, isLoading } = useGetSingleFundRequest(
    fundRequestId || "",
    !!fundRequestId
  );

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center py-16">
        <LoadingSpinner />
      </Card>
    );
  }

  return (
    <Card>
      <Tabs defaultValue="activities">
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="gantt Chart">Gantt Chart</TabsTrigger>
          <TabsTrigger value="measurement">Measurement</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <hr className="my-3" />

        <TabsContent value="activities">
          <ActivityTab fundRequest={fundRequest?.data} />
        </TabsContent>
        <TabsContent value="details">
          <DetailTab fundRequest={fundRequest?.data} />
        </TabsContent>
        <TabsContent value="gantt Chart">
          <ChartTab fundRequest={fundRequest?.data} />
        </TabsContent>
        <TabsContent value="measurement">
          <MeasurementTab fundRequest={fundRequest?.data} />
        </TabsContent>
        <TabsContent value="budget">
          <BudgetTab fundRequest={fundRequest?.data} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default Activity;
