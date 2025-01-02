import { zodResolver } from "@hookform/resolvers/zod";

import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { Form } from "components/ui/form";
import { TUser, userSchema } from "definations/users";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { useEffect, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import { useGetAllDepartmentsQuery } from "services/modules/config/department";
import { useGetAllPositionsQuery } from "services/modules/config/position";
import { useUpdateUserMutation } from "services/users";
import { toast } from "sonner";
import { closeDialog, dailogSelector } from "store/ui";

const genderOptions = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "Other" },
];

const EditUser = () => {
    const [user, setUser] = useState<TUser>();

    const form = useForm<TUser>({
        resolver: zodResolver(userSchema),
    });

    const { data } = useGetAllDepartmentsQuery({ page: 1, size: 2000000 });

    const departmentOptions = data?.data?.results?.map((dept) => ({
        label: dept.name,
        value: dept.id,
    }));

    const { data: position } = useGetAllPositionsQuery({
        page: 1,
        size: 2000000,
    });

    const positionOptions = position?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
    }));

    const dispatch = useAppDispatch();

    const [id, setId] = useState("");

    const { dialogProps } = useAppSelector(dailogSelector);

    useEffect(() => {
        if (dialogProps?.data) {
            const data = JSON.parse(dialogProps.data as string) as TUser;
            form.reset(data);

            setId(data.id);
        }
    }, [dialogProps?.data, form]);

    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const onSubmit: SubmitHandler<TUser> = async (data) => {
        try {
            await updateUser({
                id,
                body: data,
            }).unwrap();
            toast.success("User Updated Succesfully");
            dispatch(closeDialog());
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
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
                        <div className="grid grid-cols-2 gap-x-7">
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
                        </div>
                        <div className="grid grid-cols-2 gap-x-7">
                            <FormInput label="Email" name="email" required />
                            <FormInput
                                label="Mobile Number"
                                name="mobile_number"
                                required
                                type="number"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-x-7">
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
                                options={departmentOptions}
                            />
                        </div>

                        <div>
                            <FormSelect
                                label="Position"
                                name="position"
                                required
                                options={positionOptions}
                            />
                        </div>

                        <div className="flex justify-end">
                            <FormButton loading={isLoading}>Update</FormButton>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default EditUser;
