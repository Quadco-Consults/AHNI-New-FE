import BackNavigation from "atoms/BackNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import PartnerSubmissionDetails from "./PartnerSubmissionDetails";

export default function PartnerSubmissionDetailsWrapper() {
    return (
        <Tabs defaultValue="details" className="space-y-5">
            <header className="flex items-center gap-5">
                <BackNavigation />

                <TabsList>
                    <TabsTrigger value="details">
                        Organization Details
                    </TabsTrigger>

                    <TabsTrigger value="uploads">Document Uploads</TabsTrigger>
                </TabsList>
            </header>

            <main>
                <TabsContent value="details">
                    <PartnerSubmissionDetails />
                </TabsContent>

                <TabsContent value="uploads"></TabsContent>
            </main>
        </Tabs>
    );
}
