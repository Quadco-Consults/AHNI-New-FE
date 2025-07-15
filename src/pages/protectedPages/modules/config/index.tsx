import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";
import AllCategory from "./AllCategory";
import AllDepartments from "./AllDepartments";
import AllFinancialYear from "./AllFinancialYear";

import AllLocations from "./AllLocations";
import AllPositions from "./AllPositions";
import AllGrades from "./AllGrades";

const Config = () => {
  return (
    <div>
      <div>
        <Tabs defaultValue='categories'>
          <TabsList>
            <TabsTrigger value='categories'>Categories</TabsTrigger>
            <TabsTrigger value='department'>Department</TabsTrigger>
            <TabsTrigger value='financialYear'>Financial Year</TabsTrigger>
            {/* <TabsTrigger value="items">Items</TabsTrigger> */}
            <TabsTrigger value='locations'>Locations</TabsTrigger>
            <TabsTrigger value='position'>Positions</TabsTrigger>
            <TabsTrigger value='grade'>Grade</TabsTrigger>
          </TabsList>
          <TabsContent value='categories'>
            <Card className='mt-10 pb-8 px-6'>
              <AllCategory />
            </Card>
          </TabsContent>
          <TabsContent value='department'>
            <Card className='mt-10 pb-8 px-6'>
              <AllDepartments />
            </Card>
          </TabsContent>
          <TabsContent value='financialYear'>
            <Card className='mt-10 pb-8 px-6'>
              <AllFinancialYear />
            </Card>
          </TabsContent>
          {/* <TabsContent value="items">
                        <Card className="mt-10 pb-8 px-6">
                            <AllItems />
                        </Card>
                    </TabsContent> */}
          <TabsContent value='locations'>
            <Card className='mt-10 pb-8 px-6'>
              <AllLocations />
            </Card>
          </TabsContent>
          <TabsContent value='position'>
            <Card className='mt-10 pb-8 px-6'>
              <AllPositions />
            </Card>
          </TabsContent>
          <TabsContent value='grade'>
            <Card className='mt-10 pb-8 px-6'>
              <AllGrades />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Config;
