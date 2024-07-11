import Card from "components/shared/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ActivityTab from "./Activity-tab";
import DetailTab from "./Details-tab";
import ChartTab from "./ChartTab";
import MeasurementTab from "./Measurement-tab";
import BudgetTab from "./Budget-tab";
import { WorkPlanDetails } from "definations/program-types/program-workplan";

const Activity = (data: WorkPlanDetails) => {
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
          <ActivityTab {...(data as WorkPlanDetails)} />
        </TabsContent>
        <TabsContent value="details">
          <DetailTab {...(data as WorkPlanDetails)} />
        </TabsContent>
        <TabsContent value="gannt Chart">
          <ChartTab {...(data as WorkPlanDetails)} />
        </TabsContent>
        <TabsContent value="measurement">
          <MeasurementTab {...(data as WorkPlanDetails)} />
        </TabsContent>
        <TabsContent value="budget">
          <BudgetTab {...(data as WorkPlanDetails)} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default Activity;
