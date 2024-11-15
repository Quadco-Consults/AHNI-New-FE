import FormButton from "atoms/FormButton";

import { Card, CardContent } from "components/ui/card";
import { Checkbox } from "components/ui/checkbox";
import { Input } from "components/ui/input";
import { ScrollArea } from "components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { cn } from "lib/utils";
import { Search } from "lucide-react";

import React, { useEffect, useState } from "react";
import { useAddUserRoleMutation, useRolesQuery } from "services/users";
import { toast } from "sonner";
import { closeDialog, dailogSelector } from "store/ui";

interface Role {
    id: number;
    name: string;
}

const RoleCheckbox: React.FC<{
    role: Role;
    checked: boolean;
    // eslint-disable-next-line no-unused-vars
    onChange: () => void;
}> = ({ role, checked, onChange }) => {
    return (
        <div
            className={cn(
                "flex items-center space-x-2 rounded-md border px-4 py-3  cursor-pointer",
                checked
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white"
            )}
            onClick={onChange}
        >
            <Checkbox
                checked={checked}
                // onCheckedChange={onChange}
                className={cn(
                    "h-4 w-4 rounded-sm border-2",
                    checked ? "border-red-500 bg-red-500" : "border-gray-300"
                )}
            />
            <span className="text-sm font-medium capitalize">{role.name}</span>
        </div>
    );
};

type TRoleSelector = {
    selectedRoles: number[];
    // eslint-disable-next-line no-unused-vars
    onSelectRole: (roleId: number) => void;
};

const RoleSelector: React.FC<TRoleSelector> = ({
    selectedRoles,
    onSelectRole,
}) => {
    const { data } = useRolesQuery({ no_paginate: false });

    return (
        <div className="flex flex-wrap gap-2">
            {data?.map((role) => (
                <RoleCheckbox
                    key={role.id}
                    role={role}
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => onSelectRole(role.id)}
                />
            ))}
        </div>
    );
};

const SearchMembers = () => {
    return (
        <div className="relative w-[40%] mx-auto">
            <Search className="absolute w-5 h-5 text-gray-500 -translate-y-1/2 right-2 top-1/2" />
            <Input
                type="text"
                placeholder="Search roles"
                className="w-full py-2 pl-4 pr-8 border border-gray-300"
            />
        </div>
    );
};

const AssignRole = () => {
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

    const { dialogProps } = useAppSelector(dailogSelector);

    const [addUserRole, { isLoading }] = useAddUserRoleMutation();

    const dispatch = useAppDispatch();

    const rolesfromstore = dialogProps?.roles as string;

    useEffect(() => {
        // @ts-ignore
        const previousRoles = rolesfromstore.map((role) => role.id);
        setSelectedRoles([...previousRoles]);
    }, []);

    const handleSelectRole = (roleId: number) => {
        const isSelected = selectedRoles.indexOf(roleId);

        if (isSelected > -1) {
            setSelectedRoles(selectedRoles.filter((role) => role !== roleId));
            return;
        }

        setSelectedRoles([...selectedRoles, roleId]);
    };

    const handleAddRole = async () => {
        try {
            await addUserRole({
                id: dialogProps?.id as string,
                body: {
                    items: selectedRoles,
                },
            }).unwrap();
            toast.success("Role Added Succesfully");
            dispatch(closeDialog());
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    return (
        <div className="pb-10">
            <ScrollArea className="h-[80vh]">
                <div className="flex items-center justify-center w-full py-7">
                    <div className="w-full space-y-7">
                        <div className="flex justify-center">
                            <img
                                src="/imgs/logo.png"
                                alt="logo"
                                className="text-center"
                            />
                        </div>
                        <h2 className="text-3xl font-bold text-center ">
                            Roles
                        </h2>
                        <p className="text-center text-gray-400">
                            You can search with name, institution
                        </p>
                        <SearchMembers />
                    </div>
                </div>
                <Card className="mx-auto w-[75%] min-h-56">
                    <CardContent className="w-full p-4">
                        <RoleSelector
                            selectedRoles={selectedRoles}
                            onSelectRole={handleSelectRole}
                        />
                    </CardContent>
                </Card>
                <div className="flex items-center justify-end gap-x-3 mt-7 px-7">
                    <p className="text-primary">
                        {selectedRoles?.length} Stakeholders Selected
                    </p>
                    <div>
                        <FormButton
                            loading={isLoading}
                            onClick={() => handleAddRole()}
                        >
                            Save & Continue
                        </FormButton>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default AssignRole;
