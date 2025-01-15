import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Button } from "components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Save } from "lucide-react";
import Onboarding from "./Onboarding";
// import Todo from "./Todo";

const OnboardingDetail = () => {
  return (
    <div className='space-y-6'>
      <div className='flex-items'>
        <GoBack />
        <Button>
          <Save size={20} /> Save Changes
        </Button>
      </div>
      <Tabs defaultValue='onboarding'>
        <TabsList>
          <TabsTrigger value='onboarding'>Onboarding</TabsTrigger>
          {/* <TabsTrigger value="to-do">To-do</TabsTrigger> */}
        </TabsList>
        <TabsContent value='onboarding'>
          <Card className='px-6'>
            <Onboarding />
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
