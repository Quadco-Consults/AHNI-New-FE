import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import CostCategories from "./AllCostCategories";
import BudgetLine from "./AllBudgetLines";
import CostInput from "./AllCostInputs";
import FcoNumber from "./AllFCONumber";
import ProjectClasses from "./AllProjectClasses";
import ChartsOfAccount from "./AllChartAccounts";
import AllCostGroupings from "./AllCostGroupings";
import DeductionRateDefaults from "../deduction-rate-defaults";

const Finance = () => {
  const router = useRouter();

  return (
    <div>
      <div className="mb-6">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="sm"
          className="gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Finance Module Configuration</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage finance-related configurations including cost categories, budget lines, and FCO numbers
        </p>
      </div>
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
          <TabsList>
            <TabsTrigger value='deductionRates'>Deduction Rate Defaults</TabsTrigger>
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
          <TabsContent value='deductionRates'>
            <Card className='mt-10 pb-8 px-6'>
              <DeductionRateDefaults />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Finance;
