import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import JobDetail from "./JobDetail";
import SubmittedApplication from "./SubmittedApplication";
import Shortlist from "./Shortlist";
import InterviewAnalysis from "./InterviewAnalysis";
import  { useGetJobAdvertisementQuery } from "services/hrApi/hr-job-advertisement";
import { Loading } from "components/shared/Loading";
import { useParams } from "react-router-dom";

const AdvertisementDetail = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetJobAdvertisementQuery({
    id: id as string,
  });

  const TABS = [
    {
      label: "Job Details",
      value: "job_details",
      // @ts-ignore
      children: <JobDetail {...data?.data} />,
    },
    {
      label: "Submitted Applications",
      value: "submitted_applications",
      // @ts-ignore
      children: <SubmittedApplication {...data?.data} />,
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
