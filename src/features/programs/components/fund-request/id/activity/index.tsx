import Card from "components/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ActivityTab from "./Activity-tab";
import DetailTab from "./Details-tab";
import ChartTab from "./ChartTab";
import MeasurementTab from "./Measurement-tab";
import BudgetTab from "./Budget-tab";

const Activity = () => {
  return (
    <Card>
      <Tabs defaultValue="activities">
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="gannt Chart">Gannt Chart</TabsTrigger>
          <TabsTrigger value="measurement">Measurement</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <hr className="my-3" />

        <TabsContent value="activities">
          <ActivityTab />
        </TabsContent>
        <TabsContent value="details">
          <DetailTab />
        </TabsContent>
        <TabsContent value="gannt Chart">
          <ChartTab />
        </TabsContent>
        <TabsContent value="measurement">
          <MeasurementTab />
        </TabsContent>
        <TabsContent value="budget">
          <BudgetTab />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default Activity;
