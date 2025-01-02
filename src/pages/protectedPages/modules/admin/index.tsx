import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";
import AssetConditions from "./AllAssetCondition";
import AssetTypes from "./AllAssetType";

const Admin = () => {
    return (
        <div>
            <div>
                <Tabs defaultValue="conditions">
                    <TabsList>
                        <TabsTrigger value="conditions">
                            Asset Conditions inventory-asset-conditions
                        </TabsTrigger>
                        <TabsTrigger value="types">
                            Asset types inventory-asset-types
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="conditions">
                        <Card className="mt-10 pb-8 px-6">
                            <AssetConditions />
                        </Card>
                    </TabsContent>
                    <TabsContent value="types">
                        <Card className="mt-10 pb-8 px-6">
                            <AssetTypes />
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Admin;
