"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import AllAssetClassification from "../AllAssetClassification";
import AllAssetTypes from "../AllAssetType";
import AllAssetCondition from "../AllAssetCondition";

const Admin = () => {
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
                <h1 className="text-2xl font-bold text-gray-800">Admin Module Configuration</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Manage asset configurations including asset conditions, types, and classifications
                </p>
            </div>
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