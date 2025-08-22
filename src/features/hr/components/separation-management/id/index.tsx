import Card from "components/Card";
import GoBack from "components/GoBack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ExitSummary from "./ExitSummary";
import Severance from "./Severance";
import Feedback from "./Feedback";

const SeparationManagementDetail = () => {
  //   const { id } = useParams();

  //   const { data, isLoading } = WorkforceAPI.useGetWorkforceQuery({
  //     path: { id: id as string },
  //   });

  const TABS = [
    {
      label: "Exit Summary",
      value: "exit_summary",
      children: <ExitSummary />,
    },
    {
      label: "Severance and Benefit",
      value: "severance",
      children: <Severance />,
    },
    {
      label: "Evaluation & Feedback",
      value: "feedback",
      children: <Feedback />,
    },
  ];

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
      {/* <Tabs defaultValue="staff_information">
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {TABS.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <Card className="px-6">{tab.children}</Card>
              </TabsContent>
            ))}
          </>
        )}
      </Tabs> */}
    </div>
  );
};

export default SeparationManagementDetail;
