"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Lots from "../AllLots";
import Solicitation from "../AllSolicitationEvaluationCriteria";
import PrequalificationCategory from "../AllPrequalificationCategory";
import PrequalificationCriteria from "../AllPrequalificationCriteria";
import Questionairs from "../AllQuestionnaire";
import AllItems from "../AllItems";
import MarketPrice from "../MarketPrice";

const Procurement = () => {
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
        <h1 className="text-2xl font-bold text-gray-800">Procurement Module Configuration</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage procurement configurations including lots, items, market prices, and evaluation criteria
        </p>
      </div>
      <div>
        <Tabs defaultValue='lots'>
          <TabsList>
            <TabsTrigger value='lots'>Lots</TabsTrigger>
            <TabsTrigger value='market-price'>Market Price</TabsTrigger>
            <TabsTrigger value='items'>Items</TabsTrigger>
            <TabsTrigger value='solicitation'>
              Solicitation Evaluation Criteria
            </TabsTrigger>
            <TabsTrigger value='category'>
              Pre-qualification Category
            </TabsTrigger>
            <TabsTrigger value='criteria'>
              Pre-qualification Criteria
            </TabsTrigger>
            <TabsTrigger value='questionnaire'>Questionnaire</TabsTrigger>
          </TabsList>
          <TabsContent value='lots'>
            <Card className='mt-10 pb-8 px-6'>
              <Lots />
            </Card>
          </TabsContent>
          <TabsContent value='market-price'>
            <Card className='mt-10 pb-8 px-6'>
              <MarketPrice />
            </Card>
          </TabsContent>
          <TabsContent value='items'>
            <Card className='mt-10 pb-8 px-6'>
              <AllItems />
            </Card>
          </TabsContent>
          <TabsContent value='solicitation'>
            <Card className='mt-10 pb-8 px-6'>
              <Solicitation />
            </Card>
          </TabsContent>
          <TabsContent value='category'>
            <Card className='mt-10 pb-8 px-6'>
              <PrequalificationCategory />
            </Card>
          </TabsContent>
          <TabsContent value='criteria'>
            <Card className='mt-10 pb-8 px-6'>
              <PrequalificationCriteria />
            </Card>
          </TabsContent>
          <TabsContent value='questionnaire'>
            <Card className='mt-10 pb-8 px-6'>
              <Questionairs />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Procurement;