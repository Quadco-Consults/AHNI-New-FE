import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { Link, generatePath } from "react-router-dom";
import Card from "components/shared/Card";
import { useGetAllAssetsQuery } from "services/admin/inventory-management/asset";
import { useState } from "react";
import { assetColumn } from "components/Table/columns/admin/inventory-management/asset";
import { useGetAllItemsQuery } from "services/modules/config/item";

export default function AssetHomePage() {
  const [page, setPage] = useState(1);

  const { data: asset, isFetching } = useGetAllItemsQuery({
    page,
    size: 20,
    category: "17ca9ee7-603a-43a9-91e8-979652a8231c",
  });
  console.log({ asse: asset?.data });

  return (
    <div className='space-y-5'>
      <div className='flex justify-end'>
        <Link to={generatePath(AdminRoutes.CreateAssets)}>
          <Button>
            <Plus size={20} />
            Create Asset
          </Button>
        </Link>
      </div>

      <Card className='space-y-4'>
        <TableFilters>
          <DataTable
            data={asset?.data?.results || []}
            columns={assetColumn}
            isLoading={isFetching}
            pagination={{
              total: asset?.data.pagination.count ?? 0,
              pageSize: asset?.data.pagination.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </div>
  );
}

{
  /* <div className="flex gap-x-4 justify-end">
                <Button variant="outline">
                    <span>
                        <UploadFileSvg />
                    </span>
                    Upload
                </Button>
                <Button variant="custom">
                    <span>
                        <FileDown size={18} />
                    </span>
                    Download
                </Button>
            </div> */
}

/*   <TableFilters
                    // filterAction={<FilterAction />}
                    // leftAction={asset.length > 0 ? <AssetAction /> : ""}
                >
                    <DataTable columns={assestColum} data={drivedData} />
                </TableFilters> */
