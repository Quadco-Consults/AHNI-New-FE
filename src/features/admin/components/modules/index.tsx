"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";
import AllAssetClassification from "../AllAssetClassification";
import AllAssetTypes from "../AllAssetType";
import AllAssetCondition from "../AllAssetCondition";

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
                        <TabsTrigger value="classification">
                            Asset Classifications
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="conditions">
                        <Card className="mt-10 pb-8 px-6">
                            <AllAssetCondition />
                        </Card>
                    </TabsContent>
                    <TabsContent value="types">
                        <Card className="mt-10 pb-8 px-6">
                            <AllAssetTypes />
                        </Card>
                    </TabsContent>

                    <TabsContent value="classification">
                        <Card className="mt-10 pb-8 px-6">
                            <AllAssetClassification />
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Admin;