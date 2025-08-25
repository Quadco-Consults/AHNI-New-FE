"use client";

import Card from "components/Card";
import GoBack from "components/GoBack";
import { Button } from "components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Save } from "lucide-react";
import Onboarding from "./Onboarding";
import { useParams } from "next/navigation";
// import Todo from "./Todo";

const OnboardingDetail = () => {
  const { id } = useParams(); 
  return (
    <div className='space-y-6'>
      <div className='flex-items'>
        <GoBack />
         
      </div>
      <Tabs defaultValue='onboarding'>
        <TabsList>
          <TabsTrigger value='onboarding'>Onboarding</TabsTrigger>
          {/* <TabsTrigger value="to-do">To-do</TabsTrigger> */}
        </TabsList>
        <TabsContent value='onboarding'>
          <Card className='px-6'>
            <Onboarding id={id} />
          </Card>
        </TabsContent>
        {/* <TabsContent value="to-do">
          <Card className="px-6">
            <Todo />
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default OnboardingDetail;
