"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import SupervisionCategory from "../AllSupervisionCategory";
import SupervisionCriteria from "../AllSupervisionCriteria";
import Facility from "../AllFacility";
import RiskCategory from "../AllRiskCategory";
import Interventions from "../AllInterventions";
import AllModules from "../AllModules";
import BudgetLine from "@/features/admin/components/finance/AllBudgetLines";
import CostCategories from "@/features/admin/components/finance/AllCostCategories";
import CostInput from "@/features/admin/components/finance/AllCostInputs";
import AllCostGroupings from "@/features/admin/components/finance/AllCostGroupings";
import FcoNumber from "@/features/admin/components/finance/AllFCONumber";

const Programs = () => {
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
        <h1 className="text-2xl font-bold text-gray-800">Programs Configuration</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage program master data including modules, intervention areas, budget lines, and cost structures
        </p>
      </div>
      <div>
        <Tabs defaultValue='modules'>
          <TabsList>
            <TabsTrigger value='modules'>Modules</TabsTrigger>
            <TabsTrigger value='interventions'>Intervention Areas</TabsTrigger>
            <TabsTrigger value='budgetLine'>Budget Lines</TabsTrigger>
            <TabsTrigger value='categories'>Cost Categories</TabsTrigger>
            <TabsTrigger value='costGrouping'>Cost Groupings</TabsTrigger>
            <TabsTrigger value='costInput'>Cost Inputs</TabsTrigger>
            <TabsTrigger value='fcoNumber'>FCO Numbers</TabsTrigger>
            <TabsTrigger value='facility'>Facilities</TabsTrigger>
            <TabsTrigger value='risk'>Risk Categories</TabsTrigger>
            <TabsTrigger value='category'>Supervision Categories</TabsTrigger>
            <TabsTrigger value='criteria'>Supervision Criteria</TabsTrigger>
          </TabsList>

          <TabsContent value='modules'>
            <Card className='mt-10 pb-8 px-6'>
              <AllModules />
            </Card>
          </TabsContent>

          <TabsContent value='interventions'>
            <Card className='mt-10 pb-8 px-6'>
              <Interventions />
            </Card>
          </TabsContent>

          <TabsContent value='budgetLine'>
            <Card className='mt-10 pb-8 px-6'>
              <BudgetLine />
            </Card>
          </TabsContent>

          <TabsContent value='categories'>
            <Card className='mt-10 pb-8 px-6'>
              <CostCategories />
            </Card>
          </TabsContent>

          <TabsContent value='costGrouping'>
            <Card className='mt-10 pb-8 px-6'>
              <AllCostGroupings />
            </Card>
          </TabsContent>

          <TabsContent value='costInput'>
            <Card className='mt-10 pb-8 px-6'>
              <CostInput />
            </Card>
          </TabsContent>

          <TabsContent value='fcoNumber'>
            <Card className='mt-10 pb-8 px-6'>
              <FcoNumber />
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
        </Tabs>
      </div>
    </div>
  );
};

export default Programs;