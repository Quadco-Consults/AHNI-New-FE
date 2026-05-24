import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ApiErrorBoundary } from "@/components/common/ApiErrorBoundary";
import AllCategory from "./AllCategory";
import AllSubcategories from "./AllSubcategories";
import AllDepartments from "./AllDepartments";
import AllFinancialYear from "./AllFinancialYear";

import AllLocations from "./AllLocations";
import AllClusters from "./AllClusters";
import AllStates from "./AllStates";
import AllPositions from "./AllPositions";
import AllGrades from "./AllGrades";
import Levels from "./Levels";
import AllExchangeRates from "./AllExchangeRates";
import AllTravelRates from "./AllTravelRates";

const Config = () => {
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
        <h1 className="text-2xl font-bold text-gray-800">Configuration Module</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage system configurations including categories, departments, locations, and exchange rates
        </p>
      </div>
      <div>
        <Tabs defaultValue='categories'>
          <TabsList>
            <TabsTrigger value='categories'>Categories</TabsTrigger>
            <TabsTrigger value='subcategories'>Subcategories</TabsTrigger>
            <TabsTrigger value='department'>Department</TabsTrigger>
            <TabsTrigger value='financialYear'>Financial Year</TabsTrigger>
            {/* <TabsTrigger value="items">Items</TabsTrigger> */}
            <TabsTrigger value='locations'>Locations</TabsTrigger>
            <TabsTrigger value='clusters'>Clusters</TabsTrigger>
            <TabsTrigger value='states'>States</TabsTrigger>
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
          <TabsContent value='clusters'>
            <Card className='mt-10 pb-8 px-6'>
              <ApiErrorBoundary>
                <AllClusters />
              </ApiErrorBoundary>
            </Card>
          </TabsContent>
          <TabsContent value='states'>
            <Card className='mt-10 pb-8 px-6'>
              <ApiErrorBoundary>
                <AllStates />
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
