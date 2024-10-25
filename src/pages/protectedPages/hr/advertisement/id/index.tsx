import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import JobDetail from "./JobDetail";
import SubmittedApplication from "./SubmittedApplication";
import Shortlist from "./Shortlist";
import InterviewAnalysis from "./InterviewAnalysis";

const AdvertisementDetail = () => {
  return (
    <div className="space-y-6">
      <GoBack />

      <Tabs defaultValue="job_details">
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card className="px-6">{tab.children}</Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdvertisementDetail;

const TABS = [
  {
    label: "Job Details",
    value: "job_details",
    children: <JobDetail />,
  },
  {
    label: "Submitted Applications",
    value: "submitted_applications",
    children: <SubmittedApplication />,
  },
  {
    label: "Shortlist",
    value: "shortlist",
    children: <Shortlist />,
  },
  {
    label: "Interview Analysis",
    value: "interview_analysis",
    children: <InterviewAnalysis />,
  },
];
