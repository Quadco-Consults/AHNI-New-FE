import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import TableFilters from "components/Table/TableFilters";
import DataTable from "components/Table/DataTable";
import { TAssetSingleData } from "definations/admin/inventory-management/asset";
import { ColumnDef } from "@tanstack/react-table";
import DescriptionCard from "components/shared/DescriptionCard";
import { LoadingSpinner } from "components/shared/Loading";
import { useSearchParams } from "react-router-dom";
import { useGetSingleAssetQuery } from "services/admin/inventory-management/asset";
import { skipToken } from "@reduxjs/toolkit/query/react";
import BackNavigation from "atoms/BackNavigation";

export default function AssetDetails() {
    const [params] = useSearchParams();
    const assetId = params.get("id");

    const { data: asset, isLoading } = useGetSingleAssetQuery(
        assetId ?? skipToken
    );

    return (
        <>
            <BackNavigation />

            <Card>
                <CardHeader className="font-bold">
                    {asset?.data.name}
                    <Separator className="mt-4" />
                </CardHeader>

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    asset && (
                        <>
                            <CardContent className="grid grid-cols-3 gap-y-8 gap-x-4">
                                <DescriptionCard
                                    label="Asset Name"
                                    description={asset.data.name}
                                />

                                <DescriptionCard
                                    label="Assignee"
                                    description={`${asset.data.assignee.first_name} ${asset.data.assignee.last_name}`}
                                />

                                <DescriptionCard
                                    label="Asset Code"
                                    description={asset.data.asset_code}
                                />

                                <DescriptionCard
                                    label="Acquisition Date"
                                    description={asset.data.acquisition_date}
                                />

                                <DescriptionCard
                                    label="State"
                                    description={asset.data.state}
                                />

                                <DescriptionCard
                                    label="Asset Condtion"
                                    description={
                                        asset.data.asset_condition.name
                                    }
                                />

                                <DescriptionCard
                                    label="Manufacturer"
                                    description={
                                        asset?.data?.asset_type?.manufacturer ||
                                        "N/A"
                                    }
                                />

                                <DescriptionCard
                                    label="Location"
                                    description={asset.data.location.name}
                                />

                                <DescriptionCard
                                    label="Life of Project"
                                    description={asset.data.estimated_life_span}
                                />

                                <DescriptionCard
                                    label="Asset Classification"
                                    description={asset.data.classification.name}
                                />

                                <DescriptionCard
                                    label="USD Cost"
                                    description={`$${asset.data.usd_cost}`}
                                />

                                <DescriptionCard
                                    label="NGN Cost"
                                    description={`₦${asset.data.ngn_cost}`}
                                />

                                <DescriptionCard
                                    label="Unit"
                                    description={asset.data.unit}
                                />

                                <DescriptionCard
                                    label="Implementer"
                                    description={`${asset.data.implementer.last_name} ${asset.data.implementer.last_name}`}
                                />
                            </CardContent>

                            <CardHeader className="font-bold text-lg">
                                <Separator className="my-4" />
                                Asset History Movement
                            </CardHeader>

                            <div className="px-5">
                                <TableFilters>
                                    <DataTable data={[]} columns={columns} />
                                </TableFilters>
                            </div>
                        </>
                    )
                )}
            </Card>
        </>
    );
}

const columns: ColumnDef<TAssetSingleData>[] = [
    {
        header: "Date",
        accessorKey: "date",
    },
    {
        header: "Description",
        accessorKey: "description",
    },
    {
        header: "Status",
        accessorKey: "status",
    },
    {
        header: "Remark",
        accessorKey: "remark",
    },
];
