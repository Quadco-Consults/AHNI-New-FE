import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";
import { ApiErrorBoundary } from "components/common/ApiErrorBoundary";
import AllCategory from "./AllCategory";
import AllSubcategories from "./AllSubcategories";
import AllDepartments from "./AllDepartments";
import AllFinancialYear from "./AllFinancialYear";

import AllLocations from "./AllLocations";
import AllPositions from "./AllPositions";
import AllGrades from "./AllGrades";
import Levels from "./Levels";
import AllExchangeRates from "./AllExchangeRates";
import AllTravelRates from "./AllTravelRates";

const Config = () => {
  return (
    <div>
      <div>
        <Tabs defaultValue='categories'>
          <TabsList>
            <TabsTrigger value='categories'>Categories</TabsTrigger>
            <TabsTrigger value='subcategories'>Subcategories</TabsTrigger>
            <TabsTrigger value='department'>Department</TabsTrigger>
            <TabsTrigger value='financialYear'>Financial Year</TabsTrigger>
            {/* <TabsTrigger value="items">Items</TabsTrigger> */}
            <TabsTrigger value='locations'>Locations</TabsTrigger>
            <TabsTrigger value='position'>Positions</TabsTrigger>
            <TabsTrigger value='grade'>Grades</TabsTrigger>
            <TabsTrigger value='level'>Levels</TabsTrigger>
            <TabsTrigger value='exchangeRate'>Exchange Rates</TabsTrigger>
            <TabsTrigger value='travelRate'>Travel Rates</TabsTrigger>
          </TabsList>
          <TabsContent value='categories'>
            <Card className='mt-10 pb-8 px-6'>
              <ApiErrorBoundary>
                <AllCategory />
              </ApiErrorBoundary>
            </Card>
          </TabsContent>
          <TabsContent value='subcategories'>
            <Card className='mt-10 pb-8 px-6'>
              <ApiErrorBoundary>
                <AllSubcategories />
              </ApiErrorBoundary>
            </Card>
          </TabsContent>
          <TabsContent value='department'>
            <Card className='mt-10 pb-8 px-6'>
              <ApiErrorBoundary>
                <AllDepartments />
              </ApiErrorBoundary>
            </Card>
          </TabsContent>
          <TabsContent value='financialYear'>
            <Card className='mt-10 pb-8 px-6'>
              <ApiErrorBoundary>
                <AllFinancialYear />
              </ApiErrorBoundary>
            </Card>
          </TabsContent>
          {/* <TabsContent value="items">
                        <Card className="mt-10 pb-8 px-6">
                            <AllItems />
                        </Card>
                    </TabsContent> */}
          <TabsContent value='locations'>
            <Card className='mt-10 pb-8 px-6'>
              <ApiErrorBoundary>
                <AllLocations />
              </ApiErrorBoundary>
            </Card>
          </TabsContent>
          <TabsContent value='position'>
            <Card className='mt-10 pb-8 px-6'>
              <ApiErrorBoundary>
                <AllPositions />
              </ApiErrorBoundary>
            </Card>
          </TabsContent>
          <TabsContent value='grade'>
            <Card className='mt-10 pb-8 px-6'>
              <ApiErrorBoundary>
                <AllGrades />
              </ApiErrorBoundary>
            </Card>
          </TabsContent>
          <TabsContent value='level'>
            <Card className='mt-10 pb-8 px-6'>
              <ApiErrorBoundary>
                <Levels />
              </ApiErrorBoundary>
            </Card>
          </TabsContent>
          <TabsContent value='exchangeRate'>
            <Card className='mt-10 pb-8 px-6'>
              <ApiErrorBoundary>
                <AllExchangeRates />
              </ApiErrorBoundary>
            </Card>
          </TabsContent>
          <TabsContent value='travelRate'>
            <Card className='mt-10 pb-8 px-6'>
              <ApiErrorBoundary>
                <AllTravelRates />
              </ApiErrorBoundary>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Config;
