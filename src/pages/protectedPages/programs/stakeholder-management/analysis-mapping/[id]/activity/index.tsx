import Card from "components/shared/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ActivityTab from "./Activity-tab";
import DetailTab from "./Details-tab";
import ChartTab from "./ChartTab";
import MeasurementTab from "./Measurement-tab";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import ArrowDownIcon from "components/icons/ArrowDownIcon";

const Activity = () => {
  return (
    <Card>
      <Tabs defaultValue="abuja">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="abuja">Abuja</TabsTrigger>
            <TabsTrigger value="adamawa">Adamawa</TabsTrigger>
            <TabsTrigger value="yobe">Yobe</TabsTrigger>
            <TabsTrigger value="borno">Borno</TabsTrigger>
          </TabsList>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="flex gap-2 py-6">
                  Add New
                  <ArrowDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <div className="flex flex-col items-start justify-between gap-1">
                  <Button variant="ghost" className="w-full justify-start">
                    State
                  </Button>

                  <Button variant="ghost">Stakeholder</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

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
