import DescriptionCard from "components/shared/DescriptionCard";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { useSearchParams } from "react-router-dom";
import { useGetSingleAssetQuery } from "services/admin/inventory-management/asset";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { LoadingSpinner } from "components/shared/Loading";

export default function ManagementApproval() {
    const [params] = useSearchParams();
    const assetId = params.get("id");

    const { data: asset, isLoading } = useGetSingleAssetQuery(
        assetId ?? skipToken
    );

    return (
        <Card>
            <CardHeader className="font-bold">
                Asset Details
                <Separator className="mt-4" />
            </CardHeader>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                asset && (
                    <CardContent className="flex flex-col gap-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                            <DescriptionCard
                                label="Asset"
                                description={asset?.data.name}
                                className="px-5 py-3 border rounded-md"
                            />

                            <DescriptionCard
                                label="Asset Code"
                                description={asset?.data.asset_code}
                                className="px-5 py-3 border rounded-md"
                            />

                            <DescriptionCard
                                label="Manufacturer"
                                description="N/A"
                                className="px-5 py-3 border rounded-md"
                            />

                            <DescriptionCard
                                label="Model"
                                description="N/A"
                                className="px-5 py-3 border rounded-md"
                            />

                            <DescriptionCard
                                label="Serial Number"
                                description="N/A"
                                className="px-5 py-3 border rounded-md"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <DescriptionCard
                                label="Acquisition Date"
                                description={asset?.data.acquisition_date}
                            />

                            <DescriptionCard
                                label="State"
                                description={asset?.data.state}
                            />

                            <DescriptionCard
                                label="Location"
                                description={asset?.data.location.name}
                            />

                            <DescriptionCard
                                label="Implementer"
                                description={`${asset?.data.implementer.first_name} ${asset?.data.implementer.last_name}`}
                            />

                            <DescriptionCard
                                label="Assignee"
                                description={`${asset?.data.assignee}`}
                            />

                            <DescriptionCard
                                label="Life of Project"
                                description={`${asset?.data.estimated_life_span}`}
                            />

                            <DescriptionCard
                                label="USD Cost"
                                description={`${asset?.data.usd_cost}`}
                            />

                            <DescriptionCard
                                label="NGN Cost"
                                description={`${asset?.data.ngn_cost}`}
                            />

                            <DescriptionCard
                                label="Unit"
                                description={`${asset?.data.unit}`}
                            />
                        </div>
                    </CardContent>
                )
            )}
        </Card>
    );
}

// ADD CUSTOM APPROVAL COMPONENT