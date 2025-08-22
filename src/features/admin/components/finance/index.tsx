import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";
import CostCategories from "./AllCostCategories";
import BudgetLine from "./AllBudgetLines";
import CostInput from "./AllCostInputs";
import FcoNumber from "./AllFCONumber";
import ProjectClasses from "./AllProjectClasses";
import ChartsOfAccount from "./AllChartAccounts";
import AllCostGroupings from "./AllCostGroupings";

const Finance = () => {
  return (
    <div>
      <div>
        <Tabs defaultValue='categories'>
          <TabsList>
            <TabsTrigger value='categories'>Cost Categories</TabsTrigger>
          </TabsList>
          <TabsList>
            <TabsTrigger value='costInput'>Cost Input</TabsTrigger>
          </TabsList>
          <TabsList>
            <TabsTrigger value='costGrouping'>Cost Grouping</TabsTrigger>
          </TabsList>
          <TabsList>
            <TabsTrigger value='budgetLine'>Budget Line</TabsTrigger>
          </TabsList>
          <TabsList>
            <TabsTrigger value='fcoNumber'>FCO Number</TabsTrigger>
          </TabsList>
          <TabsList>
            <TabsTrigger value='projectClasses'>Project Classes</TabsTrigger>
          </TabsList>
          <TabsList>
            <TabsTrigger value='chartsOfAccount'>Charts of Account</TabsTrigger>
          </TabsList>
          <TabsContent value='categories'>
            <Card className='mt-10 pb-8 px-6'>
              <CostCategories />
            </Card>
          </TabsContent>
          <TabsContent value='budgetLine'>
            <Card className='mt-10 pb-8 px-6'>
              <BudgetLine />
            </Card>
          </TabsContent>
          <TabsContent value='costInput'>
            <Card className='mt-10 pb-8 px-6'>
              <CostInput />
            </Card>
          </TabsContent>
          <TabsContent value='costGrouping'>
            <Card className='mt-10 pb-8 px-6'>
              <AllCostGroupings />
            </Card>
          </TabsContent>

          <TabsContent value='fcoNumber'>
            <Card className='mt-10 pb-8 px-6'>
              <FcoNumber />
            </Card>
          </TabsContent>
          <TabsContent value='projectClasses'>
            <Card className='mt-10 pb-8 px-6'>
              <ProjectClasses />
            </Card>
          </TabsContent>
          <TabsContent value='chartsOfAccount'>
            <Card className='mt-10 pb-8 px-6'>
              <ChartsOfAccount />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Finance;
