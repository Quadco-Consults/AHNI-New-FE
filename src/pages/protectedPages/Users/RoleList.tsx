import DeleteIcon from "components/icons/DeleteIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { LoadingSpinner } from "components/shared/Loading";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import { DialogType, largeDailogScreen } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useDeleteRoleMutation, useGetAllRolesQuery } from "services/auth/role";
import { toast } from "sonner";
import { openDialog } from "store/ui";

export default function AllRoles() {
    const [roleId, setRoleId] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);

    const { data: role, isLoading } = useGetAllRolesQuery({
        page: 1,
        size: 2000000,
    });

    const dispatch = useAppDispatch();

    const onRoleClick = (id: string, name: string, permission: string) => {
        dispatch(
            openDialog({
                type: DialogType.AddPermissionToRole,
                dialogProps: {
                    ...largeDailogScreen,
                    id,
                    name,
                    permission: permission,
                },
            })
        );
    };

    const [deleteRole, { isLoading: isDeleteLoading }] =
        useDeleteRoleMutation();

    const onDeleteRole = async () => {
        try {
            console.log(roleId);
            // await deleteRole(roleId).unwrap();
            toast.success("Role Deleted");
            setDialogOpen(false);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <div className="mt-6">
            <Card>
                <CardContent className="p-4">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : role?.data.results.length === 0 ? (
                        <></>
                    ) : (
                        role?.data.results.map(
                            ({ id, name, permissions }, i) => (
                                <>
                                    <div
                                        key={id}
                                        className="flex justify-between py-5 border-b clear-end"
                                    >
                                        <div className="flex item-center gap-x-4">
                                            <p className=" rounded-full bg-[#DBDFE9] h-6 w-6 flex items-center justify-center text-sm ">
                                                {i + 1}
                                            </p>
                                            <h4 className="text-lg font-bold capitalize">
                                                {name}
                                            </h4>
                                        </div>
                                        <div className="flex items-center">
                                            <Button
                                                variant="ghost"
                                                title="Manage Permissions"
                                                onClick={() =>
                                                    onRoleClick(
                                                        String(id),
                                                        name,
                                                        permissions as unknown as string
                                                    )
                                                }
                                            >
                                                <ChevronRight className="cursor-pointer " />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                title="Delete Role"
                                                onClick={() =>
                                                    setDialogOpen(true)
                                                }
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </div>
                                    </div>

                                    <ConfirmationDialog
                                        open={dialogOpen}
                                        title="Are you sure you want to delete this role?"
                                        loading={isDeleteLoading}
                                        onCancel={() => {
                                            setRoleId(id);
                                            // setDialogOpen(false);
                                        }}
                                        onOk={onDeleteRole}
                                    />
                                </>
                            )
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
