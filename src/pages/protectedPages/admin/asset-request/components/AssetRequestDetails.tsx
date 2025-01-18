import { LoadingSpinner } from "components/shared/Loading";
import DescriptionCard from "components/shared/DescriptionCard";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { useSearchParams } from "react-router-dom";
import { useGetSingleAssetRequestQuery } from "services/admin/inventory-management/asset-request";
import { skipToken } from "@reduxjs/toolkit/query";
import { Separator } from "components/ui/separator";

export default function AssetRequestDetails() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const { data: assetRequest, isLoading } = useGetSingleAssetRequestQuery(
        id ?? skipToken
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
                            label="Description"
                            description={assetRequest?.data.description}
                        />

                        <DescriptionCard
                            label="Remark"
                            description={assetRequest?.data.comments || "N/A"}
                        />

                        <DescriptionCard
                            label="Recommendation"
                            description={assetRequest?.data.recommendation}
                        />
                    </CardContent>
                )
            )}
        </Card>
    );
}
