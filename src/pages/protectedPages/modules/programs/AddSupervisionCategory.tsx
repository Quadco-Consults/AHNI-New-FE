import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    useAddSupervisionCategoryMutation,
    useUpdateSupervisionCategoryMutation,
} from "services/module-programs";
import {
    TSupervisionCategory,
    supervisionCategorySchema,
} from "definations/module-programs";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";

const jobCategoryOptions = [
    { label: "Goods", value: "Goods" },
    { label: "Service", value: "Service" },
    { label: "Work", value: "Work" },
    { label: "Others", value: "Others" },
];

const AddSupervisionCategory = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TSupervisionCategory;

    const form = useForm<TSupervisionCategory>({
        resolver: zodResolver(supervisionCategorySchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const dispatch = useAppDispatch();

    const [supervisionCategory, { isLoading }] =
        useAddSupervisionCategoryMutation();
    const [updateSupervisionCategory, { isLoading: updateSupervisionLoading }] =
        useUpdateSupervisionCategoryMutation();

    const onSubmit: SubmitHandler<TSupervisionCategory> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateSupervisionCategory({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await supervisionCategory(data).unwrap();
            toast.success("Supervision Category Added Succesfully");
            dispatch(closeDialog());
            form.reset();
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    return (
        <CardContent>
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
                            placeholder="Enter name"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1">
                        <FormInput
                            label="Description"
                            placeholder="Enter description"
                            name="description"
                            required
                        />
                        {/* <FormInput label="Code" name="code" required /> */}
                    </div>
                    {/* <div className="grid grid-cols-2 gap-x-7">
              <FormInput
                label="Serial Number"
                name="serial_number"
                type="number"
                required
              />
              <FormSelect
                label="Job Category"
                name="job_category"
                required
                options={jobCategoryOptions}
              />
            </div> */}
                    <div className="flex justify-start gap-4">
                        <FormButton
                            loading={isLoading || updateSupervisionLoading}
                        >
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddSupervisionCategory;
