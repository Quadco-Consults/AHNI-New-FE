"use client";

import { LoadingSpinner } from "components/Loading";
import DescriptionCard from "components/DescriptionCard";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { useSearchParams } from "next/navigation";
import { useGetSingleAssetRequestQuery } from "@/features/admin/controllers/assetRequestController";
import { Separator } from "components/ui/separator";

export default function AssetRequestDetails() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const { data: assetRequest, isLoading } = useGetSingleAssetRequestQuery(
        id || "", !!id
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
                assetRequest && (
                    <CardContent className="grid grid-cols-3 gap-y-8 gap-x-4">
                        <DescriptionCard
                            label="Asset Name"
                            description={assetRequest?.data.asset.name}
                        />

                        <DescriptionCard
                            label="Asset Code"
                            description={assetRequest?.data.asset.name}
                        />

                        <DescriptionCard
                            label="Asset Type"
                            description={assetRequest?.data.asset.name}
                        />

                        <DescriptionCard
                            label="Asset Condition"
                            description={assetRequest?.data.asset.name}
                        />

                        <DescriptionCard
                            label="Request Type"
                            description={assetRequest?.data.type}
                        />

                        {assetRequest?.data.type === "MOVEMENT" && (
                            <>
                                <DescriptionCard
                                    label="From"
                                    description={
                                        assetRequest?.data.from_location.name
                                    }
                                />

                                <DescriptionCard
                                    label="To"
                                    description={
                                        assetRequest?.data.to_location.name
                                    }
                                />
                            </>
                        )}

                        <DescriptionCard
                            label="Disposal Justification"
                            description={
                                assetRequest?.data.disposal_justification
                            }
                        />

                        <DescriptionCard
                            label="Disposal Justification"
                            description={
                                assetRequest?.data.disposal_justification
                            }
                        />

                        <DescriptionCard
                            label="Request Date"
                            description={format(
                                assetRequest?.data.created_datetime,
                                "MMM dd, yyyy"
                            )}
                        />

                        <DescriptionCard
                            label="Recommendation"
                            description={assetRequest?.data.recommendation}
                        />

                        <DescriptionCard
                            label="Remark"
                            description={assetRequest?.data.comments || "N/A"}
                        />

                        <DescriptionCard
                            label="Description"
                            description={assetRequest?.data.description}
                        />
                    </CardContent>
                )
            )}
        </Card>
    );
}
