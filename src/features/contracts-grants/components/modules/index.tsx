"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import AllPreAwardQuestions from "../AllPreAwardQuestions";

export default function CGModules() {
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
                <h1 className="text-2xl font-bold text-gray-800">Contracts & Grants Module Configuration</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Manage contracts and grants configurations including pre-award questions
                </p>
            </div>
            <Tabs defaultValue="preaward">
                <TabsList>
                    <TabsTrigger value="preaward">Pre-Award Questions</TabsTrigger>
                </TabsList>
                <TabsContent value="preaward">
                    <AllPreAwardQuestions />
                </TabsContent>
            </Tabs>
        </div>
    );
}