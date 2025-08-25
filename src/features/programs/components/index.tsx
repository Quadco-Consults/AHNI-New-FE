import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";
import SupervisionCategory from "./AllSupervisionCategory";
import SupervisionCriteria from "./AllSupervisionCriteria";
import Facility from "./AllFacility";
import RiskCategory from "./AllRiskCategory";
import Interventions from "./AllInterventions";

const Programs = () => {
  return (
    <div>
      <div>
        <Tabs defaultValue='category'>
          <TabsList>
            <TabsTrigger value='category'>
              Supervision Evaluation Category
            </TabsTrigger>
            <TabsTrigger value='criteria'>
              Supervision Evaluation Criteria
            </TabsTrigger>
            <TabsTrigger value='facility'>Facility</TabsTrigger>
            <TabsTrigger value='risk'>Risk Category</TabsTrigger>
            <TabsTrigger value='interventions'>Intervention Areas</TabsTrigger>
          </TabsList>
          <TabsContent value='category'>
            <Card className='mt-10 pb-8 px-6'>
              <SupervisionCategory />
            </Card>
          </TabsContent>
          <TabsContent value='criteria'>
            <Card className='mt-10 pb-8 px-6'>
              <SupervisionCriteria />
            </Card>
          </TabsContent>
          <TabsContent value='facility'>
            <Card className='mt-10 pb-8 px-6'>
              <Facility />
            </Card>
          </TabsContent>
          <TabsContent value='risk'>
            <Card className='mt-10 pb-8 px-6'>
              <RiskCategory />
            </Card>
          </TabsContent>
          <TabsContent value='interventions'>
            <Card className='mt-10 pb-8 px-6'>
              <Interventions />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Programs;
