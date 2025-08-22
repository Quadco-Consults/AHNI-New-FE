import BackNavigation from "components/atoms/BackNavigation";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "components/ui/tabs";
import AssetRequestDetails from "./components/AssetRequestDetails";
import ManagementApproval from "./components/ManagementApproval";
import Upload from "./components/Upload";

export default function ViewAssetRequest() {
    return (
        <div>
            <div className="">
                <Tabs defaultValue="details">
                    <TabsList>
                        <BackNavigation />
                        <TabsTrigger value="details">Asset Details</TabsTrigger>
                        <TabsTrigger value="approval">
                            Management Approval
                        </TabsTrigger>
                        <TabsTrigger value="uploads">Uploads</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                        <AssetRequestDetails />
                    </TabsContent>

                    <TabsContent value="approval">
                        <ManagementApproval />
                    </TabsContent>

                    <TabsContent value="uploads">
                        <Upload />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
