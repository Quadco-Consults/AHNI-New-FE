import { Button } from "components/ui/button";

import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "components/atoms/TableAction";
import { LoadingSpinner } from "components/Loading";
import {
    useDeleteDocumentType,
    useGetAllDocumentTypes,
} from "@/features/modules/controllers/project/documentTypeController";
import { useState } from "react";
import Pagination from "components/Pagination";

export default function AllDocumentTypes() {
    const [page, setPage] = useState(1);

    const handleChangePagination = (page: number) => {
        setPage(page);
    };

    const { data: documentType, isFetching } = useGetAllDocumentTypes({
        page,
        size: 20,
        search: "",
    });
    const dispatch = useAppDispatch();

    const { deleteDocumentType, isLoading: isDeleteLoading } =
        useDeleteDocumentType();

    const onSubmit = async (id: string) => {
        try {
            await deleteDocumentType(id);
            toast.success("Deleted Successfully");
        } catch (error) {
            toast.error("Error deleting item");
        }
    };

    const onUpdate = (item: any) => {
        dispatch(
            openDialog({
                type: DialogType.AddDocumentTypes,
                dialogProps: {
                    header: "Update Document Type",
                    data: item,
                    type: "update",
                },
            })
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center py-6 mb-6">
                <h1 className="text-[#D92D20] font-semibold text-sm">
                    Document Types
                </h1>
                <Button
                    onClick={() =>
                        dispatch(
                            openDialog({
                                type: DialogType.AddDocumentTypes,
                                dialogProps: {
                                    header: "Add Document Type",
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
                <div className="flex justify-between border-b border-gray-300 pb-4 text-[#756D6D] font-semibold text-sm mb-10">
                    <h1 className="flex-1">Name</h1>
                    <h1 className="flex-1">Description</h1>
                    <h1 className="flex-1"></h1>
                </div>

                {isFetching || isDeleteLoading ? (
                    <LoadingSpinner />
                ) : (
                    <div>
                        {documentType?.data?.results.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
                            >
                                <p className="flex-1">{item.name}</p>
                                <p className="flex-1">
                                    {item.description || "N/A"}
                                </p>
                                <div className="flex-1">
                                    <TableAction
                                        update
                                        removeView
                                        action={() => onSubmit(item.id)}
                                        updateAction={() => onUpdate(item)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Pagination
                    total={documentType?.data.pagination.count ?? 0}
                    itemsPerPage={documentType?.data.pagination.page_size ?? 0}
                    onChange={handleChangePagination}
                />
            </div>
        </div>
    );
}
