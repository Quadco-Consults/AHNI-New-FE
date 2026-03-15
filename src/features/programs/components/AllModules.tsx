"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dailogs";
import TableAction from "@/components/TableAction";
import { LoadingSpinner } from "@/components/Loading";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import {
  useGetAllModules,
  useDeleteModule,
} from "@/features/modules/controllers/project/moduleController";

export default function AllModules() {
  const [page, setPage] = useState(1);

  const { data: modules, isFetching } = useGetAllModules({
    page,
    size: 20,
    search: "",
  });

  const dispatch = useAppDispatch();
  const [deleteModule, { isLoading: isDeleteLoading }] = useDeleteModule();

  const onDelete = async (id: string) => {
    try {
      await deleteModule(id);
      toast.success("Module deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Something went wrong");
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddModule,
        dialogProps: {
          header: "Update Module",
          data: item,
          type: "update",
        },
      })
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">Modules</h1>
        <div className="flex gap-2">
          <Button
            onClick={() =>
              dispatch(
                openDialog({
                  type: DialogType.AddModule,
                  dialogProps: {
                    header: "Add Module",
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
      </div>
      <div>
        <div className="flex text-[#756D6D] font-semibold text-sm mb-10">
          <h1 className="flex-1">Name</h1>
          <h1 className="flex-1">Code</h1>
          <h1 className="flex-1">Description</h1>
          <h1 className="flex-1"></h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {modules?.data?.results?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
              >
                <p className="flex-1">{item.name}</p>
                <p className="flex-1">{item.code || "N/A"}</p>
                <p className="flex-1">{item.description || "N/A"}</p>
                <div className="flex-1">
                  <TableAction
                    update
                    removeView
                    action={() => onDelete(item.id)}
                    updateAction={() => onUpdate(item)}
                  />
                </div>
              </div>
            ))}
            {modules?.data?.results?.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No modules found. Create one to get started.
              </p>
            )}
          </>
        )}
      </div>
      {modules?.data?.pagination && (
        <Pagination
          totalItems={modules.data.pagination.count}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
