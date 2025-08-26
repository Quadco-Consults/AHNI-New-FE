"use client";

import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
// import { TAssetSingleData } from "features/admin/types/inventory-management/asset";
// import { ColumnDef } from "@tanstack/react-table";
import DescriptionCard from "components/DescriptionCard";
import { LoadingSpinner } from "components/Loading";
import { useSearchParams } from "next/navigation";
import BackNavigation from "components/atoms/BackNavigation";
import { useGetSingleItemQuery } from "@/features/modules/controllers";

export default function AssetDetails() {
  const params = useSearchParams();
  const assetId = params.get("id");

  const { data: asset, isLoading } = useGetSingleItemQuery(
    assetId || "",
    !!assetId
  );

  return (
    <>
      <BackNavigation />

      <Card>
        <CardHeader className='font-bold'>
          {asset?.data?.name}
          <Separator className='mt-4' />
        </CardHeader>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          asset && (
            <>
              <CardContent className='grid grid-cols-4 gap-y-8 gap-x-4'>
                <DescriptionCard
                  label='Asset Name'
                  description={asset?.data?.name}
                />

                <DescriptionCard
                  label='Assignee'
                  description={`${asset?.data?.assignee}` || "N/A"}
                  // description={`${asset?.data?.assignee?.first_name} ${asset?.data?.assignee?.last_name}`}
                />

                <DescriptionCard
                  label='Asset Code'
                  description={asset?.data?.asset_code || "N/A"}
                />

                <DescriptionCard
                  label='Acquisition Date'
                  description={asset?.data?.acquisition_date || "N/A"}
                />

                <DescriptionCard
                  label='State'
                  description={asset?.data?.state || "N/A"}
                />

                <DescriptionCard
                  label='Asset Condtion'
                  // description={asset?.data?.asset_condition.name}
                  description={asset?.data?.asset_condition || "N/A"}
                />

                <DescriptionCard
                  label='Manufacturer'
                  description={asset?.data?.asset_type || "N/A"}
                  // description={asset?.data?.asset_type?.manufacturer || "N/A"}
                />

                <DescriptionCard
                  label='Location'
                  description={asset?.data?.location || "N/A"}
                  // description={asset?.data?.location.name}
                />

                <DescriptionCard
                  label='Life of Project'
                  description={asset?.data?.estimated_life_span || "N/A"}
                />

                <DescriptionCard
                  label='Asset Classification'
                  description={asset?.data?.classification || "N/A"}
                  // description={asset?.data?.classification.name}
                />

                <DescriptionCard
                  label='USD Cost'
                  description={`$${asset?.data?.usd_cost}` || "N/A"}
                />

                <DescriptionCard
                  label='NGN Cost'
                  description={`₦${asset?.data?.ngn_cost}` || "N/A"}
                />

                <DescriptionCard
                  label='Unit'
                  description={asset?.data?.unit || "N/A"}
                />

                <DescriptionCard
                  label='Implementer'
                  description={`${asset?.data?.implementer}` || "N/A"}
                  // description={`${asset?.data?.implementer.last_name} ${asset?.data?.implementer.last_name}`}
                />

                {asset?.data?.asset_type?.name?.toLowerCase() === "vehicle" && (
                  <>
                    <DescriptionCard
                      label='Plate Number'
                      description={asset?.data?.plate_number || "N/A"}
                    />

                    <DescriptionCard
                      label='Chasis Number'
                      description={asset?.data?.chasis_number || "N/A"}
                    />
                  </>
                )}

                <div className='col-span-3'>
                  <DescriptionCard
                    label='Description'
                    description={asset?.data?.description || "N/A"}
                  />
                </div>
              </CardContent>

              {/* <CardHeader className='font-bold text-lg'>
                <Separator className='my-4' />
                Asset History Movement
              </CardHeader>

              <div className='px-5'>
                <TableFilters>
                  <DataTable data={[]} columns={columns} />
                </TableFilters>
              </div> */}
            </>
          )
        )}
      </Card>
    </>
  );
}

// const columns: ColumnDef<TAssetSingleData>[] = [
//   {
//     header: "Date",
//     accessorKey: "date",
//   },
//   {
//     header: "Description",
//     accessorKey: "description",
//   },
//   {
//     header: "Status",
//     accessorKey: "status",
//   },
//   {
//     header: "Remark",
//     accessorKey: "remark",
//   },
// ];
