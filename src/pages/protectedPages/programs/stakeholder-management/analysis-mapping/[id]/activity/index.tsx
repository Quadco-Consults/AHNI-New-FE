import Card from "components/shared/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ActivityTab from "./Activity-tab";
import DetailTab from "./Details-tab";
import ChartTab from "./ChartTab";
import MeasurementTab from "./Measurement-tab";

const Activity = () => {
  return (
    <Card>
      <Tabs defaultValue="abuja">
        <TabsList>
          <TabsTrigger value="abuja">Abuja</TabsTrigger>
          <TabsTrigger value="adamawa">Adamawa</TabsTrigger>
          <TabsTrigger value="yobe">Yobe</TabsTrigger>
          <TabsTrigger value="borno">Borno</TabsTrigger>
        </TabsList>

        <hr className="my-3" />

        <TabsContent value="abuja">
          <ActivityTab />
        </TabsContent>
        <TabsContent value="adamawa">
          <DetailTab />
        </TabsContent>
        <TabsContent value="yobe">
          <ChartTab />
        </TabsContent>
        <TabsContent value="borno">
          <MeasurementTab />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default Activity;
