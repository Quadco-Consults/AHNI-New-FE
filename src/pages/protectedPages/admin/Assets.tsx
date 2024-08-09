import FhiIcon from "assets/FhiIcon";
import RoundBack from "assets/svgs/RoundBack";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { assestColum } from "components/Table/columns/assest";

import { Button } from "components/ui/button";

import { AdminRoutes } from "constants/RouterConstants";
import { DialogType, mediumDailogScreen } from "constants/dailogs";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { Link, generatePath, useNavigate } from "react-router-dom";
import { useGetAssetsQuery } from "services/adminApi/assetsApi";
import { assetSelector } from "store/assets";
import { openDialog } from "store/ui";

const Assets = () => {
  const navigate = useNavigate();

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

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-x-2">
            <div onClick={() => navigate(-1)}>
              <RoundBack />
            </div>
            <h4 className="text-xl font-bold">Item Registration</h4>
          </div>
          <div className="flex items-center mx-3 gap-x-3">
            <FhiIcon />
            <div>
              <h4 className="text-xl font-bold">Family Health</h4>
              <h4 className="text-xl font-bold">International (FHI 360)</h4>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Link to={generatePath(AdminRoutes.CreateAssets)}>
            <Button>
              <span>
                <Plus size={20} />
              </span>
              Add Asset
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-10 space-y-6">
        <TableFilters leftAction={asset.length > 0 ? <AssetAction /> : ""}>
          <DataTable columns={assestColum} data={drivedData} />
        </TableFilters>
      </div>
    </div>
  );
};

export default Assets;
