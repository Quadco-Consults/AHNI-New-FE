import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useNavigate } from "react-router-dom";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import Activity from "./activity";

const AnalysisDetails = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="space-y-6 relative min-h-screen">
      <button
        onClick={goBack}
        className="w-[3rem] absolute top-0 left-0 aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
      >
        <LongArrowLeft />
      </button>

      <Tabs defaultValue="summary" className="space-y-10">
        <div className="relative ml-16">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="activity/report">Activity/Report</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="summary">
          <Card>one</Card>
        </TabsContent>
        <TabsContent value="activity/report">
          <Activity />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisDetails;
