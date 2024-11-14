import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import {
    DialogType,
    largeDailogScreen,
    mediumDailogScreen,
} from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { ChevronRight } from "lucide-react";

import { useRolesQuery } from "services/users";
import { openDialog } from "store/ui";

const RoleList = () => {
    const { data } = useRolesQuery({
        no_paginate: false,
    });

    const dispatch = useAppDispatch();

    const onRoleClick = (id: string, permission: string) => {
        dispatch(
            openDialog({
                type: DialogType.AddPermissionToRole,
                dialogProps: {
                    ...largeDailogScreen,
                    id,
                    permission: permission,
                },
            })
        );
    };
    return (
        <div className="mt-6">
            <Card>
                <CardContent className="p-4">
                    <Button
                        className="float-end"
                        onClick={() =>
                            dispatch(
                                openDialog({
                                    type: DialogType.AddNewRoleModal,
                                    dialogProps: {
                                        header: "Add New Role",
                                        width: "max-w-md",
                                        height: "max-h-[700px]",
                                    },
                                })
                            )
                        }
                    >
                        <AddSquareIcon />
                        Add New Role
                    </Button>
                    {data?.map((item, i) => {
                        return (
                            <div
                                key={item.id}
                                className="flex justify-between py-5 border-b clear-end"
                            >
                                <div className="flex item-center gap-x-4">
                                    <p className=" rounded-full bg-[#DBDFE9] h-6 w-6 flex items-center justify-center text-sm ">
                                        {i + 1}
                                    </p>
                                    <h4 className="text-lg font-bold capitalize">
                                        {item.name}
                                    </h4>
                                </div>
                                <div>
                                    <ChevronRight
                                        className="cursor-pointer "
                                        onClick={() =>
                                            onRoleClick(
                                                String(item.id),
                                                item.permissions as unknown as string
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
};

export default RoleList;
