import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";

const VendorManagement = () => {
  return (
    <div>
      <div>
        <Tabs defaultValue='vendor-registration'>
          <TabsList>
            <TabsTrigger value='vendor-registration'>Vendor Registration</TabsTrigger>
            <TabsTrigger value='prequalification'>Prequalification</TabsTrigger>
            <TabsTrigger value='eoi'>Expression of Interest</TabsTrigger>
          </TabsList>
          <TabsContent value='vendor-registration'>
            <Card className='mt-10 pb-8 px-6'>
              <div>Vendor Registration Content</div>
            </Card>
          </TabsContent>
          <TabsContent value='prequalification'>
            <Card className='mt-10 pb-8 px-6'>
              <div>Prequalification Content</div>
            </Card>
          </TabsContent>
          <TabsContent value='eoi'>
            <Card className='mt-10 pb-8 px-6'>
              <div>Expression of Interest Content</div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorManagement;