import { Button } from "components/ui/button";
import { useAssetTypesQuery, useDeleteAssetTypesMutation } from "services/moduleAdmin";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "atoms/TableAction";

const AssetTypes = () => {
  const { data } = useAssetTypesQuery({
    no_paginate: false,
  });

  const dispatch = useAppDispatch();

  const [deleteAssetTypes] = useDeleteAssetTypesMutation();

  const onSubmit = async (id: string) => {
    try {
      await deleteAssetTypes(id).unwrap();
      toast.success("Deleted Successfully");
    } catch (error) {
      toast.error("Error deleteing item");
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddAssetTypes,
        dialogProps: {
          header: "Update Asset Types",
          data: item,
          type: "update",
        },
      })
    );
  };
return (
<div>
    <div className="flex items-center justify-between py-6 mb-6">
    <h1 className="text-[#D92D20] font-semibold text-sm">Asset Types</h1>

    <Button
      onClick={() =>
        dispatch(
          openDialog({
            type: DialogType.AddAssetTypes,
            dialogProps: {
              header: "Add Asset Types",
            },
          })
        )
      }
      variant="outline"
      className="gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#DEA004] border-[1px] border-[#C7CBD5]"
      size="sm"
    >
      Click to add New
    </Button>
  </div>
  <div>
    <div className="flex justify-between text-[#756D6D] font-semibold text-sm mb-10">
      <h1>Name</h1>
      <h1>Manufacturer</h1>
      <h1>Model</h1>
      <h1></h1>
    </div>
    <div>
      {data?.results.map((item) => {
        return (
          <div
            key={item.id}
            className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
          >
            <div className="flex justify-between w-[53%] lg:w-[78%] ">
              <p className="w-[25%]">{item.name}</p>
              <p className="w-[31%]">{item.manufacturer}</p>
              <p className="w-[10%] mr-[1.2rem]">{item.model}</p>
            </div>
            <div>
              <TableAction
                update
                removeView
                action={() => onSubmit(item.id)}
                updateAction={() => onUpdate(item)}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>
)
}

export default AssetTypes