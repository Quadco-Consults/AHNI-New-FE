import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { assestColum } from "components/Table/columns/assest";

import { Button } from "components/ui/button";

import { AdminRoutes } from "constants/RouterConstants";
import { DialogType, mediumDailogScreen } from "constants/dailogs";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { FileDown, Plus } from "lucide-react";
import { useMemo } from "react";
import { Link, generatePath } from "react-router-dom";
import { useGetAssetsQuery } from "services/adminApi/assetsApi";
import { assetSelector } from "store/assets";
import { openDialog } from "store/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import FilterIcon from "components/icons/FilterIcon";
import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import Card from "components/shared/Card";

const Assets = () => {
  const { data } = useGetAssetsQuery({
    page: 1,
    page_size: 20,
  });

  const asset = useAppSelector(assetSelector);

  const drivedData = useMemo(() => {
    return (
      data?.results.map((item) => {
        return {
          ...item,
          implementer: item.implementer.name,
          asset_type: item.asset_type.name,
          asset_condition: item.asset_condition.name,
          location: item.location.name,
        };
      }) || []
    );
  }, [data?.results]);

  const dispatch = useAppDispatch();

  const AssetAction = () => {
    return (
      <Button
        onClick={() => {
          dispatch(
            openDialog({
              type: DialogType.AssestAction,
              dialogProps: {
                ...mediumDailogScreen,
              },
            })
          );
        }}
        className="text-red-600 bg-red-200"
      >
        Raise Action
      </Button>
    );
  };

  const FilterAction = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <FilterIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Asset Condition</DropdownMenuItem>
          <DropdownMenuItem>Organization</DropdownMenuItem>
          <DropdownMenuItem>Category</DropdownMenuItem>
          <DropdownMenuItem>Manufacture</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Link to={generatePath(AdminRoutes.CreateAssets)}>
          <Button>
            <span>
              <Plus size={20} />
            </span>
            Add Asset
          </Button>
        </Link>
      </div>
      <div className="flex gap-x-4 justify-end">
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
      </div>
      <Card className="space-y-4">
        <TableFilters
          filterAction={<FilterAction />}
          leftAction={asset.length > 0 ? <AssetAction /> : ""}
        >
          <DataTable columns={assestColum} data={drivedData} />
        </TableFilters>
      </Card>
    </div>
  );
};

export default Assets;
