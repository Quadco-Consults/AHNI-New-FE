"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";
import Lots from "./AllLots";
import Solicitation from "./AllSolicitationEvaluationCriteria";
import PrequalificationCategory from "./AllPrequalificationCategory";
import PrequalificationCriteria from "./AllPrequalificationCriteria";
import Questionairs from "./AllQuestionnaire";
import AllItems from "./AllItems";
import MarketPrice from "./MarketPrice";

const Procurement = () => {
  return (
    <div>
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
