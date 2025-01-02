import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { Form } from "components/ui/form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useGetAllDepartmentsQuery } from "services/modules/config/department";
import { useGetAllPositionsQuery } from "services/modules/config/position";
import {
    useGetSingleUserQuery,
    useUpdateUserMutation,
} from "services/auth/user";
import { toast } from "sonner";
import { closeDialog, dailogSelector } from "store/ui";
import {
    IUser,
    TUpdateUserFormValues,
    UpdateUserSchema,
} from "definations/auth/user";
import { Button } from "components/ui/button";
import { skipToken } from "@reduxjs/toolkit/query/react";

const genderOptions = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "Other" },
];

export default function EditUserModal() {
    const form = useForm<TUpdateUserFormValues>({
        resolver: zodResolver(UpdateUserSchema),
    });

    const { dialogProps } = useAppSelector(dailogSelector);

    const { data: department } = useGetAllDepartmentsQuery({
        page: 1,
        size: 2000000,
    });

    const departmentOptions = useMemo(
        () =>
            department?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [department]
    );

    const { data: position } = useGetAllPositionsQuery({
        page: 1,
        size: 2000000,
    });

    const positionOptions = position?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
    }));

    const dispatch = useAppDispatch();

    useEffect(() => {
        form.reset(dialogProps?.data as any);
    }, [dialogProps?.data]);

    const [updateUser, { isLoading: isUpdateLoading }] =
        useUpdateUserMutation();

    const onSubmit: SubmitHandler<TUpdateUserFormValues> = async (data) => {
        try {
            await updateUser({
                id: dialogProps?.data?.id as string,
                body: data,
            }).unwrap();
            toast.success("User Updated");
            dispatch(closeDialog());
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <div>
            <div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-y-10"
                    >
                        <div className="grid grid-cols-2 gap-x-7 gap-y-7">
                            <FormInput
                                label="First Name"
                                name="first_name"
                                required
                            />
                            <FormInput
                                label="Last Name"
                                name="last_name"
                                required
                            />

                            <FormInput label="Email" name="email" required />

                            <FormInput
                                label="Mobile Number"
                                name="mobile_number"
                                required
                                type="number"
                            />

                            <FormSelect
                                label="Gender"
                                name="gender"
                                placeholder="Select Gender"
                                required
                                options={genderOptions}
                            />

                            <FormSelect
                                label="Department"
                                name="department"
                                required
                                placeholder="Select Department"
                                options={departmentOptions}
                            />

                            <FormSelect
                                label="Position"
                                name="position"
                                required
                                placeholder="Select Position"
                                options={positionOptions}
                            />
                        </div>

                        <div className="flex justify-end">
                            <FormButton loading={isUpdateLoading}>
                                Update User
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
