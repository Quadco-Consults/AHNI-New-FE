import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "atoms/TableAction";
import {
    useBeneficiariesQuery,
    useDeleteBeneficiariesMutation,
} from "services/moduleProjects";
import { LoadingSpinner } from "components/shared/Loading";

const Beneficiaries = () => {
    const { data, isLoading } = useBeneficiariesQuery({
        no_paginate: false,
    });

    const dispatch = useAppDispatch();
    const [deleteBeneficiary, { isLoading: isDeleteLoading }] =
        useDeleteBeneficiariesMutation();

    const onSubmit = async (id: string) => {
        try {
            await deleteBeneficiary(id).unwrap();
            toast.success("Deleted Successfully");
        } catch (error) {
            toast.error("Error deleteing item");
        }
    };

    const onUpdate = (item: any) => {
        dispatch(
            openDialog({
                type: DialogType.AddBeneficiaries,
                dialogProps: {
                    header: "Update Beneficiary",
                    data: item,
                    type: "update",
                },
            })
        );
    };
    return (
        <Card className="mt-10 pb-8 px-6">
            <div className="flex justify-between items-center py-6 mb-6">
                <h1 className="text-[#D92D20] font-semibold text-sm">
                    Beneficiaries
                </h1>
                <Button
                    onClick={() =>
                        dispatch(
                            openDialog({
                                type: DialogType.AddBeneficiaries,
                                dialogProps: {
                                    header: "Add Beneficiary",
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
                    <h1 className="flex-1">Name</h1>
                    <h1 className="flex-1">Description</h1>
                    <div className="flex-1"></div>
                </div>

                {isLoading || isDeleteLoading ? (
                    <LoadingSpinner />
                ) : (
                    <div>
                        {data?.data?.results.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
                            >
                                <p className="flex-1">{item.name}</p>
                                <p className="flex-1">{item.description}</p>
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
        </Card>
    );
};

export default Beneficiaries;
