"use client";

import Card from "components/Card";
import GoBack from "components/GoBack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import JobDetail from "./JobDetail";
import SubmittedApplication from "./SubmittedApplication";
import Shortlist from "./Shortlist";
import InterviewAnalysis from "./InterviewAnalysis";
import  { useGetJobAdvertisement } from "@/features/hr/controllers/jobAdvertisementController";
import { Loading } from "components/Loading";
import { useParams } from "next/navigation";

const AdvertisementDetail = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetJobAdvertisement(id as string);

  // Debug the data structure
  console.log("Advertisement Detail - Raw API data:", data);
  console.log("Advertisement Detail - data?.data:", data?.data);

  const TABS = [
    {
      label: "Job Details",
      value: "job_details",
      // @ts-ignore
      children: data?.data ? <JobDetail {...data.data} /> : <div>Loading...</div>,
    },
    {
      label: "Submitted Applications",
      value: "submitted_applications",
      // @ts-ignore
      children: data?.data ? <SubmittedApplication {...data.data} /> : <div>Loading...</div>,
    },
    {
      label: "Shortlist",
      value: "shortlist",

      // @ts-ignore
      children: <Shortlist />,
    },
    {
      label: "Interview Analysis",
      value: "interview_analysis",
      children: <InterviewAnalysis />,
    },
  ];
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className='space-y-6'>
      <GoBack />

      <Tabs defaultValue='job_details'>
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

export default AdvertisementDetail;
