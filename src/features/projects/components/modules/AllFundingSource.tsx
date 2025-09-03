import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "components/atoms/TableAction";
import { LoadingSpinner } from "components/Loading";
import Pagination from "components/Pagination";
import {
    useUseGetAllFundingSourceQuery,
    useDeleteFundingSourceMutation,
} from "@/features/modules/controllers/project/fundingSourceController";
import { useState } from "react";

export default function AllFundingSource() {
    const [page, setPage] = useState(1);

    const { data: fundingSources, isFetching } = useUseGetAllFundingSourceQuery(
        {
            page,
            size: 20,
        }
    );

    const handleChangePagination = (page: number) => {
        setPage(page);
    };

    const dispatch = useAppDispatch();

    const [deleteFunding, { isLoading: isDeleteLoading }] =
        useDeleteFundingSourceMutation();

    const onSubmit = async (id: string) => {
        try {
            await deleteFunding(id);
            toast.success("Deleted Successfully");
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    const onUpdate = (item: any) => {
        dispatch(
            openDialog({
                type: DialogType.AddFundingSource,
                dialogProps: {
                    header: "Update Funding Source",
                    data: item,
                    type: "update",
                },
            })
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between py-6 mb-6">
                <h1 className="text-[#D92D20] font-semibold text-sm">Donors</h1>

                <Button
                    onClick={() =>
                        dispatch(
                            openDialog({
                                type: DialogType.AddFundingSource,
                                dialogProps: {
                                    header: "Add Funding Source",
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
                <div className="grid grid-cols-7 gap-4 text-[#756D6D] font-semibold text-sm mb-10">
                    <h1>Name</h1>
                    <h1>Email</h1>
                    <h1>Address</h1>
                    <h1>Contact Person</h1>
                    <h1>Contact Email</h1>
                    <h1>Contact Phone</h1>
                    <h1>Actions</h1>
                </div>

                {isFetching || isDeleteLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {fundingSources?.data.results.map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-7 gap-4 mt-6 text-[#756D6D] font-normal text-xs items-center"
                                >
                                    <p className="truncate" title={item.name}>{item.name}</p>
                                    <p className="truncate" title={item.email_donor || "N/A"}>
                                        {item.email_donor || "N/A"}
                                    </p>
                                    <p className="truncate" title={item.address_donor || "N/A"}>
                                        {item.address_donor || "N/A"}
                                    </p>
                                    <p className="truncate" title={item.contact_person_name || "N/A"}>
                                        {item.contact_person_name || "N/A"}
                                    </p>
                                    <p className="truncate" title={item.email_contact_person || "N/A"}>
                                        {item.email_contact_person || "N/A"}
                                    </p>
                                    <p className="truncate" title={item.contact_person_phone || "N/A"}>
                                        {item.contact_person_phone || "N/A"}
                                    </p>
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
                    </>
                )}

                <Pagination
                    total={fundingSources?.data.pagination.count ?? 0}
                    itemsPerPage={
                        fundingSources?.data.pagination.page_size ?? 0
                    }
                    onChange={handleChangePagination}
                />
            </div>
        </div>
    );
}
