"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import LeaveSettings from "../LeaveSettings";

export default function HRModules() {
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
                <h1 className="text-2xl font-bold text-gray-800">HR Module Configuration</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Manage human resources configurations including leave settings and policies
                </p>
            </div>
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
        </div>
    );
}