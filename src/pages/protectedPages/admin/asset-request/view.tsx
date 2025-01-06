import BackNavigation from "atoms/BackNavigation";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { useGetSingleAssetRequestQuery } from "services/admin/inventory-management/asset-request";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { LoadingSpinner } from "components/shared/Loading";
import DescriptionCard from "components/shared/DescriptionCard";
import { format } from "date-fns";

export default function ViewAssetRequest() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const { data: assetRequest, isLoading } = useGetSingleAssetRequestQuery(
        id ?? skipToken
    );

    return (
        <div>
            <div className="">
                <Tabs defaultValue="details">
                    <TabsList>
                        <BackNavigation />
                        <TabsTrigger value="details">Asset Details</TabsTrigger>
                        <TabsTrigger value="approval">Approval</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                        <Card>
                            <CardHeader className="font-bold">
                                Asset Details
                                <Separator className="mt-4" />
                            </CardHeader>

                            {isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                assetRequest && (
                                    <CardContent className="grid grid-cols-3 gap-y-8 gap-x-4">
                                        <DescriptionCard
                                            label="Asset Name"
                                            description={
                                                assetRequest?.data.asset.name
                                            }
                                        />

                                        <DescriptionCard
                                            label="Asset Code"
                                            description={
                                                assetRequest?.data.asset.name
                                            }
                                        />

                                        <DescriptionCard
                                            label="Asset Type"
                                            description={
                                                assetRequest?.data.asset.name
                                            }
                                        />

                                        <DescriptionCard
                                            label="Asset Condition"
                                            description={
                                                assetRequest?.data.asset.name
                                            }
                                        />

                                        <DescriptionCard
                                            label="Disposal Justification"
                                            description={
                                                assetRequest?.data
                                                    .disposal_justification
                                            }
                                        />

                                        <DescriptionCard
                                            label="Disposal Justification"
                                            description={
                                                assetRequest?.data
                                                    .disposal_justification
                                            }
                                        />

                                        <DescriptionCard
                                            label="Request Date"
                                            description={format(
                                                assetRequest?.data
                                                    .created_datetime,
                                                "MMM dd, yyyy"
                                            )}
                                        />

                                        <DescriptionCard
                                            label="Description"
                                            description={
                                                assetRequest?.data.description
                                            }
                                        />

                                        <DescriptionCard
                                            label="Remark"
                                            description={
                                                assetRequest?.data.comments ||
                                                "N/A"
                                            }
                                        />

                                        <DescriptionCard
                                            label="Recommendation"
                                            description={
                                                assetRequest?.data
                                                    .recommendation
                                            }
                                        />
                                    </CardContent>
                                )
                            )}
                        </Card>
                    </TabsContent>

                    <TabsContent value="approval">
                        <Card>
                            <CardHeader className="font-bold">
                                Approval Details
                                <Separator className="mt-4" />
                            </CardHeader>

                            <CardContent className="flex flex-col gap-y-4"></CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

{
    /*    
<div className="space-y-2">
<Button className="mt-2">
GT CT Approval
</Button>
</div>
<div className="space-y-2">
<Button className="mt-2">
CCM Approval
</Button>
</div> */
}
