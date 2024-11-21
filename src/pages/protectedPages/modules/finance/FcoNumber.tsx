import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "atoms/TableAction";
import {
    useDeleteFCONumberMutation,
    useGetFCONumberQuery,
} from "services/moduleFinance";

const FcoNumber = () => {
    const dispatch = useAppDispatch();

    const { data } = useGetFCONumberQuery({ no_paginate: false });
    const [deleteFCONumber] = useDeleteFCONumberMutation();

    const onSubmit = async (id: string) => {
        try {
            await deleteFCONumber(id).unwrap();
            toast.success("Deleted Successfully");
        } catch (error) {
            toast.error("Error deleteing item");
        }
    };

    const onUpdate = (item: any) => {
        dispatch(
            openDialog({
                type: DialogType.AddFcoNumber,
                dialogProps: {
                    header: "Update FCO Number",
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
                    FCO Number
                </h1>

                <Button
                    onClick={() =>
                        dispatch(
                            openDialog({
                                type: DialogType.AddFcoNumber,
                                dialogProps: {
                                    header: "Add FCO Number",
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
                    <h1 className="ml-[8rem]">Description</h1>
                    <h1 className="ml-[5rem]">Code</h1>
                    <h1></h1>
                </div>
                <div>
                    {data?.data?.results?.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
                        >
                            <p className="w-[20%]">{item.name}</p>
                            <p className="w-[25%]">{item.description}</p>
                            <p className="w-[15%]">{item.code}</p>
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

export default FcoNumber;
