import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Link, generatePath, useNavigate, useParams } from "react-router-dom";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import Activity from "./activity";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { RouteEnum } from "constants/RouterConstants";

const AnalysisDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
          <TabsList className="flex justify-between">
            <div>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="stakeholder">Stakeholders</TabsTrigger>
            </div>
            <div className="flex justify-end">
              <Link
                to={generatePath(
                  RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS_CREATE,
                  { id: id }
                )}
              >
                <Button className="flex gap-2 py-6">
                  <AddSquareIcon />
                  Create Project Stakeholders
                </Button>
              </Link>
            </div>
          </TabsList>
        </div>
        <TabsContent value="summary">
          <Card>one</Card>
        </TabsContent>
        <TabsContent value="stakeholder">
          <Activity />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisDetails;
