"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import AllPreAwardQuestions from "../AllPreAwardQuestions";

export default function CGModules() {
    return (
        <Tabs defaultValue="preaward">
            <TabsList>
                <TabsTrigger value="preaward">Pre-Award Questions</TabsTrigger>
            </TabsList>
            <TabsContent value="preaward">
                <AllPreAwardQuestions />
            </TabsContent>
        </Tabs>
    );
}