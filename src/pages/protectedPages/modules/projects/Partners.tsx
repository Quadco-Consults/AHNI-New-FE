import { Button } from "components/ui/button";
import {
    usePartnersQuery,
    useDeletePartnersMutation,
} from "services/moduleProjects";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "atoms/TableAction";

const Partners = () => {
    const { data } = usePartnersQuery({
        no_paginate: false,
    });

    const dispatch = useAppDispatch();

    const [deletePartners] = useDeletePartnersMutation();

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
                                    header: "Add Partners",
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
                <div className="flex justify-between text-[#756D6D] font-semibold text-sm mb-4 border-b border-gray-300 pb-4">
                    <h1 className="">Name</h1>
                    <h1 className="ml-[-1rem]">Address</h1>
                    <h1>City</h1>
                    <h1>State</h1>
                    <h1>Phone</h1>
                    <h1>Email</h1>
                    <h1>Website</h1>
                    <h1></h1>
                </div>
                <div>
                    {data?.data?.results.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs"
                        >
                            <div className="w-[98%] flex justify-between">
                                <p className="w-[10%]">{item.name}</p>
                                <p className="w-[12%] mr-[1.5rem]">
                                    {item.address}
                                </p>
                                <p className="w-[6%] mr-[3rem]">{item.city}</p>
                                <p className="w-[8%] mr-[2.5rem]">
                                    {item.state}
                                </p>
                                <p className="w-[10%]">{item.phone}</p>
                                <p className="w-[13%]">{item.email}</p>
                                <p className="w-[10%] mr-[1.8rem]">
                                    {item.website}
                                </p>
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

export default Partners;
