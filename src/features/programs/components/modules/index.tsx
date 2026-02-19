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
        <h1 className="text-2xl font-bold text-gray-800">Programs Module Configuration</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage program-related configurations including supervision categories, facilities, and intervention areas
        </p>
      </div>
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