import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "atoms/TableAction";
import { LoadingSpinner } from "components/shared/Loading";
import {
    useDeletePartnerMutation,
    useGetAllPartnersQuery,
} from "services/modules/project/partners";
import { useState } from "react";
import Pagination from "components/shared/Pagination";

export default function AllPartner() {
    const [page, setPage] = useState(1);

    const { data: partner, isLoading } = useGetAllPartnersQuery({
        page,
        size: 20,
    });

    const handleChangePagination = (page: number) => {
        setPage(page);
    };

    const dispatch = useAppDispatch();

    const [deletePartners, { isLoading: isDeleteLoading }] =
        useDeletePartnerMutation();

    const onSubmit = async (id: string) => {
        try {
            await deletePartners(id).unwrap();
            toast.success("Deleted Successfully");
        } catch (error) {
            toast.error("Error deleting item");
        }
    };

    const onUpdate = (item: any) => {
        dispatch(
            openDialog({
                type: DialogType.AddPartners,
                dialogProps: {
                    header: "Update Partner",
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
                    Partners
                </h1>
                <Button
                    onClick={() =>
                        dispatch(
                            openDialog({
                                type: DialogType.AddPartners,
                                dialogProps: {
                                    header: "Add Partner",
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
                <div className="flex justify-between gap-x-5 text-[#756D6D] font-semibold text-sm mb-4 border-b border-gray-300 pb-4">
                    <h1 className="flex-1">Name</h1>
                    <h1 className="flex-1">Address</h1>
                    <h1 className="flex-1">City</h1>
                    <h1 className="flex-1">State</h1>
                    <h1 className="flex-1">Phone</h1>
                    <h1 className="flex-1">Email</h1>
                    <h1 className="flex-1">Website</h1>
                    <h1 className="flex-1"></h1>
                </div>

                {isLoading || isDeleteLoading ? (
                    <LoadingSpinner />
                ) : (
                    <div>
                        {partner?.data?.results.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs gap-x-5"
                            >
                                <p className="flex-1">{item.name}</p>
                                <p className="flex-1">{item.address}</p>
                                <p className="flex-1">{item.city}</p>
                                <p className="flex-1">{item.state}</p>
                                <p className="flex-1">{item.phone}</p>
                                <p className="flex-1">{item.email}</p>
                                <p className="flex-1">{item.website}</p>
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
                    total={partner?.data.pagination.count ?? 0}
                    itemsPerPage={partner?.data.pagination.page_size ?? 0}
                    onChange={handleChangePagination}
                />
            </div>
        </div>
    );
}
