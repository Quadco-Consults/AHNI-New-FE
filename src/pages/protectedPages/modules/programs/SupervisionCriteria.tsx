import { Button } from "components/ui/button";
import {
    useDeleteSupervisionCriteriaMutation,
    useGetSupervisionCriteriaQuery,
} from "services/module-programs";
import TableAction from "atoms/TableAction";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { DialogType } from "constants/dailogs";
import { openDialog } from "store/ui";

const SupervisionCriteria = () => {
    const { data } = useGetSupervisionCriteriaQuery({ no_paginate: false });
    const [deleteSupervisionCriteria] = useDeleteSupervisionCriteriaMutation();

    const dispatch = useAppDispatch();

    const onSubmit = async (id: string) => {
        try {
            await deleteSupervisionCriteria(id).unwrap();
            toast.success("Deleted Successfully");
        } catch (error) {
            toast.error("Error deleteing item");
        }
    };

    const onUpdate = (item: any) => {
        dispatch(
            openDialog({
                type: DialogType.AddSupervisionCriteria,
                dialogProps: {
                    header: "Update Supervision Criteria",
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
                    Supervision Evaluation Criteria
                </h1>

                <Button
                    onClick={() =>
                        dispatch(
                            openDialog({
                                type: DialogType.AddSupervisionCriteria,
                                dialogProps: {
                                    header: "Add Supervision Criteria",
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
                    <h1>Name</h1>
                    <h1 className="">Description</h1>
                    <h1></h1>
                </div>
                <div>
                    {data?.data?.results.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
                        >
                            <p className="w-[30%]">{item.name}</p>
                            <p className="w-[25%]">{item.description}</p>
                            <TableAction
                                update
                                removeView
                                action={() => onSubmit(item.id)}
                                updateAction={() => onUpdate(item)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SupervisionCriteria;
