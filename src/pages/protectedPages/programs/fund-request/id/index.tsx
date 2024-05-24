import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useNavigate } from "react-router-dom";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import Summary from "./Summary";
import { Button } from "components/ui/button";
import FundSummary from "./Fund-summary";

const FundRequestDetail = () => {
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
        <div className="relative flex justify-between gap-5 ml-16">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="fund Request Summary">
              Fund Request Summary
            </TabsTrigger>
            <TabsTrigger value="approval Status">Approval Status</TabsTrigger>
          </TabsList>

          <Button>Approval</Button>
        </div>
        <TabsContent value="summary">
          <Card>
            <Summary />
          </Card>
        </TabsContent>
        <TabsContent value="fund Request Summary">
          <FundSummary />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundRequestDetail;
