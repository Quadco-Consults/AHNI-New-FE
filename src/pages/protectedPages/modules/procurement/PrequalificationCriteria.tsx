import { Button } from "components/ui/button";
import {
    usePrequalificationCriteriaQuery,
    useDeletePrequalificationCriteriaMutation,
} from "services/moduleProcurement";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "atoms/TableAction";

const PrequalificationCriteria = () => {
    const { data } = usePrequalificationCriteriaQuery({
        no_paginate: false,
    });

    const dispatch = useAppDispatch();

    const [deletePrequalificationCriteria] =
        useDeletePrequalificationCriteriaMutation();

    const onSubmit = async (id: string) => {
        try {
            await deletePrequalificationCriteria(id).unwrap();
            toast.success("Deleted Successfully");
        } catch (error) {
            toast.error("Error deleteing item");
        }
    };

    const onUpdate = (item: any) => {
        dispatch(
            openDialog({
                type: DialogType.AddPrequalificationCriteria,
                dialogProps: {
                    header: "Update Pre-qualification Criteria",
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
                    Pre-qualification Criteria
                </h1>
                <Button
                    onClick={() =>
                        dispatch(
                            openDialog({
                                type: DialogType.AddPrequalificationCriteria,
                                dialogProps: {
                                    header: "Add Prequalification Criteria",
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
                    <h1>Description</h1>
                    <h1>Category</h1>
                    <h1></h1>
                </div>
                <div>
                    {data?.data?.results.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
                        >
                            <div className=" flex justify-between">
                                <p className="w-[40%]">{item.name}</p>
                                <p>{item.description}</p>
                                <p>{item.category}</p>
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PrequalificationCriteria;
