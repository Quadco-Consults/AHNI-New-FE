import Card from "components/shared/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ActivityTab from "./Activity-tab";
import DetailTab from "./Details-tab";
import ChartTab from "./ChartTab";
import MeasurementTab from "./Measurement-tab";
import BudgetTab from "./Budget-tab";
import { WorkPlanDetails } from "definations/program-types/program-workplan";
import { TWorkPlanSingleResponse } from "definations/program-types/work-plan";

type PropsType = {
    data: TWorkPlanSingleResponse;
};

export default function Activity({ data }: PropsType) {
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
                    <ActivityTab data={data} />
                </TabsContent>
                <TabsContent value="details">
                    <DetailTab data={data} />
                </TabsContent>
                <TabsContent value="gannt Chart">
                    <ChartTab data={data} />
                </TabsContent>
                <TabsContent value="measurement">
                    <MeasurementTab data={data} />
                </TabsContent>
                <TabsContent value="budget">
                    <BudgetTab data={data} />
                </TabsContent>
            </Tabs>
        </Card>
    );
}
