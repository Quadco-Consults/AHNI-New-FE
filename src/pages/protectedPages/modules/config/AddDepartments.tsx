import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import {
    DepartmentSchema,
    TDepartmentData,
    TDepartmentFormValues,
} from "definations/modules/config/department";
import {
    useAddDepartmentMutation,
    useUpdateDepartmentMutation,
} from "services/modules/config/department";

const AddDepartments = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TDepartmentData;

    const form = useForm<TDepartmentFormValues>({
        resolver: zodResolver(DepartmentSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const dispatch = useAppDispatch();
    const [departments, { isLoading }] = useAddDepartmentMutation();

    const [updateDepartments, { isLoading: updateDepartmentsLoading }] =
        useUpdateDepartmentMutation();

    const onSubmit: SubmitHandler<TDepartmentFormValues> = async (data) => {
        try {
            if (dialogProps?.type === "update") {
                await updateDepartments({
                    //@ts-ignore
                    id: String(dialogProps?.data?.id),
                    body: data,
                }).unwrap();
            } else {
                await departments(data).unwrap();
            }

            toast.success("Department Added Succesfully");
            dispatch(closeDialog());
            form.reset();
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };
    return (
        <Form {...form}>
            <form
                action=""
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-y-10"
            >
                <div className="grid grid-cols-1 gap-y-7">
                    <FormInput
                        label="Name"
                        name="name"
                        placeholder="Enter Name"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 gap-y-7">
                    <FormInput
                        label="Description"
                        name="description"
                        placeholder="Enter Description"
                        required
                    />
                </div>
                <div className="flex justify-start gap-4">
                    <FormButton loading={isLoading || updateDepartmentsLoading}>
                        Save
                    </FormButton>
                </div>
            </form>
        </Form>
    );
};

export default AddDepartments;
