import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";
import Categories from "./AllCategory";
import Departments from "./AllDepartments";
import FinancialYear from "./AllFinancialYear";
import Items from "./AllItems";
import Locations from "./AllLocations";
import Position from "./AllPositions";

const Config = () => {
    return (
        <div>
            <div>
                <Tabs defaultValue="categories">
                    <TabsList>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                        <TabsTrigger value="department">Department</TabsTrigger>
                        <TabsTrigger value="financialYear">
                            Financial Year
                        </TabsTrigger>
                        <TabsTrigger value="items">Items</TabsTrigger>
                        <TabsTrigger value="locations">Locations</TabsTrigger>
                        <TabsTrigger value="position">Positions</TabsTrigger>
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
                    <TabsContent value="position">
                        <Card className="mt-10 pb-8 px-6">
                            <Position />
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Config;
