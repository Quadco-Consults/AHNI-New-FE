import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import Overview from "./Overview";
import Uploads from "./Uploads";
import Questionnaire from "./Questionnaire";
import TechnicalCapability from "./Technical-capability";
import { Button } from "components/ui/button";
import { Link, generatePath } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";

const PrequalificationDetails = () => {
  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <h4 className="text-lg font-bold">Prequalification</h4>

        <Link
          to={generatePath(RouteEnum.VENDOR_MANAGEMENT_START_PREQUALIFICATION, {
            id: "1",
          })}
        >
          <Button>Start Prequalification</Button>
        </Link>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="uploads">Uploads</TabsTrigger>
          <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
          <TabsTrigger value="technical-capability">
            Technical Capability
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Overview />
        </TabsContent>
        <TabsContent value="uploads">
          <Uploads />
        </TabsContent>
        <TabsContent value="questionnaire">
          <Questionnaire />
        </TabsContent>
        <TabsContent value="technical-capability">
          <TechnicalCapability />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrequalificationDetails;
