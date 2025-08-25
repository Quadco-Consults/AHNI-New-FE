"use client";

"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";
import VendorRegistration from "./vendor-registration/Registration";
import Prequalification from "./prequalification/index";
import EOI from "./eoi/EOI";

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
              <VendorRegistration />
            </Card>
          </TabsContent>
          <TabsContent value='prequalification'>
            <Card className='mt-10 pb-8 px-6'>
              <Prequalification />
            </Card>
          </TabsContent>
          <TabsContent value='eoi'>
            <Card className='mt-10 pb-8 px-6'>
              <EOI />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorManagement;