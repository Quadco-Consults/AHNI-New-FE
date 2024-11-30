import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "atoms/TableAction";
import {
    useDeleteBudgetLineMutation,
    useGetBudgetLineQuery,
} from "services/moduleFinance";
import { LoadingSpinner } from "components/shared/Loading";

const BudgetLine = () => {
    const dispatch = useAppDispatch();

    const { data, isLoading } = useGetBudgetLineQuery({ no_paginate: false });
    const [deleteBudgetLine] = useDeleteBudgetLineMutation();

    const onSubmit = async (id: string) => {
        try {
            await deleteBudgetLine(id).unwrap();
            toast.success("Deleted Successfully");
        } catch (error) {
            toast.error("Error deleteing item");
        }
    };

    const onUpdate = (item: any) => {
        dispatch(
            openDialog({
                type: DialogType.AddBudgetLine,
                dialogProps: {
                    header: "Update Budget Line",
                    data: item,
                    type: "update",
                },
            })
        );
    };
    return (
        <div>
            <div className="flex items-center justify-between py-6 mb-6">
                <h1 className="text-[#D92D20] font-semibold text-sm">
                    Budget Line
                </h1>

                <Button
                    onClick={() =>
                        dispatch(
                            openDialog({
                                type: DialogType.AddBudgetLine,
                                dialogProps: {
                                    header: "Add Budget Line",
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
                <div className="flex justify-between text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4">
                    <h1 className="flex-1">Name</h1>
                    <h1 className="flex-1">Description</h1>
                    <h1 className="flex-1">Code</h1>
                    <h1 className="flex-1"></h1>
                </div>

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <div>
                        {data?.data?.results?.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
                            >
                                <p className="flex-1">{item.name}</p>
                                <p className="flex-1">{item.description}</p>
                                <p className="flex-1">{item.code}</p>
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
            </div>
        </div>
    );
};

export default BudgetLine;
