import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";
import Categories from "./Categories";
import Departments from "./Departments";
import FinancialYear from "./FinancialYear";
import Items from "./Items";
import Locations from "./Locations";

const Config = () => {
  return (
    <div>
      <div>
        <Tabs defaultValue="categories">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="department">Department</TabsTrigger>
            <TabsTrigger value="financialYear">Financial Year</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>
          <TabsContent value="categories">
            <Card className="mt-10 pb-8 px-6">
              <Categories />
            </Card>
          </TabsContent>
          <TabsContent value="department">
            <Card className="mt-10 pb-8 px-6">
              <Departments />
            </Card>
          </TabsContent>
          <TabsContent value="financialYear">
            <Card className="mt-10 pb-8 px-6">
              <FinancialYear />
            </Card>
          </TabsContent>
          <TabsContent value="items">
            <Card className="mt-10 pb-8 px-6">
              <Items />
            </Card>
          </TabsContent>
          <TabsContent value="locations">
            <Card className="mt-10 pb-8 px-6">
              <Locations />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Config;
