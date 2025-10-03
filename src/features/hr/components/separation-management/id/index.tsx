"use client";

import Card from "components/Card";
import GoBack from "components/GoBack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ExitSummary from "./ExitSummary";
import Severance from "./Severance";
import Feedback from "./Feedback";
import { useParams } from "next/navigation";
import { useGetSeparationManagementById } from "@/features/hr/controllers/separationManagementController";
import { LoadingSpinner } from "components/Loading";

const SeparationManagementDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSeparationManagementById(id as string);

  const separationData = data?.data;

  // Debug logging to see what data we're getting
  console.log("Separation Management Data:", {
    fullData: data,
    separationData: separationData,
    employee: separationData?.employee
  });

  const TABS = [
    {
      label: "Exit Summary",
      value: "exit_summary",
      children: <ExitSummary data={separationData} />,
    },
    {
      label: "Severance and Benefit",
      value: "severance",
      children: <Severance data={separationData} />,
    },
    {
      label: "Evaluation & Feedback",
      value: "feedback",
      children: <Feedback data={separationData} />,
    },
  ];

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <GoBack />
        <Card className='p-6'>
          <LoadingSpinner />
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <GoBack />

      <Tabs defaultValue='exit_summary'>
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card className='px-6'>{tab.children}</Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SeparationManagementDetail;
