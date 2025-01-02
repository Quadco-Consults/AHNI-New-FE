import BackNavigation from "atoms/BackNavigation";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "components/ui/tabs";
import AssetDetails from "./components/AssetDetails";
import ManagementApproval from "./components/ManagementApproval";

export default function ViewAsset() {
    
    return (
        <Tabs defaultValue="details">
            <BackNavigation />
            <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="approval">Management Approval</TabsTrigger>
                <TabsTrigger value="uploads">Uploads</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
                <AssetDetails />
            </TabsContent>

            <TabsContent value="approval">
                <ManagementApproval />
            </TabsContent>

            <TabsContent value="uploads"></TabsContent>
        </Tabs>
    );
}
