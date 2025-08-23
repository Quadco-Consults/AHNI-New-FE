"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";
import LeaveSettings from "../LeaveSettings";

export default function HRModules() {
    return (
        <Tabs defaultValue="leave">
            <TabsList>
                <TabsTrigger value="leave">Leave Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="leave">
                <Card className="mt-10 pb-8 px-6">
                    <LeaveSettings />
                </Card>
            </TabsContent>
        </Tabs>
    );
}