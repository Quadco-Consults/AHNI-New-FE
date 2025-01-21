import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import LeaveSettings from "./LeaveSettings";

const Finance = () => {
  return (
    <div>
      <div>
        <Tabs defaultValue='leaveSettings'>
          <TabsList>
            <TabsTrigger value='leaveSettings'>Leave Settings</TabsTrigger>
          </TabsList>

          <TabsContent value='leaveSettings'>
            <LeaveSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Finance;
