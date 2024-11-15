import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { TCreateUser, userSchema } from "definations/users";

import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDepartmentsQuery } from "services/moduleConfig";
import { useCreateUserMutation } from "services/users";
import { toast } from "sonner";

const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
];

const CreateUsers = () => {
    const form = useForm<TCreateUser>({
        resolver: zodResolver(userSchema),
    });
    const { data } = useDepartmentsQuery({ page: 1, page_size: 100 });

    console.log({ departmentQuery: data });

    const [createUser, { isLoading }] = useCreateUserMutation();

    const navigate = useNavigate();

    const onSubmit: SubmitHandler<TCreateUser> = async (data) => {
        try {
            await createUser(data).unwrap();
            toast.success("User Created Succesfully");
            form.reset();
            navigate("/users");
        } catch (error: any) {
            const keys = Object.keys(error.data);
            const errMsg = error.data[keys[0]][0];
            toast.error(errMsg || "Something went wrong");
        }
    };
    return (
        <div>
            <div>
                <BackNavigation extraText="Add Users" />
            </div>
            <div>
                <Card>
                    <CardContent className="p-6">
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
                                    <FormInput
                                        label="Email"
                                        name="email"
                                        required
                                    />
                                    <FormInput
                                        label="Contact"
                                        name="phone_number"
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
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <FormButton loading={isLoading}>
                                        Create
                                    </FormButton>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateUsers;
