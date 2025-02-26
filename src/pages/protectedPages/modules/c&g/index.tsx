import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";
import AllPreAwardQuestions from "./AllPreAwardQuestions";
export default function CAndGModules() {
    return (
        <Tabs defaultValue="preaward">
            <TabsList>
                <TabsTrigger value="preaward">Pre-award Questions</TabsTrigger>
            </TabsList>
            <TabsContent value="preaward">
                <Card className="mt-10 pb-8 px-6">
                    <AllPreAwardQuestions />
                </Card>
            </TabsContent>
        </Tabs>
    );
}
