import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import {
    SupervisionCriteriaSchema,
    TSupervisionCriteriaData,
    TSupervisionCriteriaFormValues,
} from "definations/modules/program/supervision-criteria";
import {
    useAddSupervisionCriteriaMutation,
    useUpdateSupervisionCriteriaMutation,
} from "services/modules/program/supervision-criteria";
import { useGetAllSupervisionCategoryQuery } from "services/modules/program/supervision-category";

const AddSupervisionCriteria = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TSupervisionCriteriaData;

    const form = useForm<TSupervisionCriteriaFormValues>({
        resolver: zodResolver(SupervisionCriteriaSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
            evaluation_category: data?.evaluation_category ?? "",
        },
    });

    const dispatch = useAppDispatch();

    const { data: category } = useGetAllSupervisionCategoryQuery({
        page: 1,
        size: 2000000,
    });

    const categoryOptions = category?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
    }));

    const [addSupervisionCriteria, { isLoading }] =
        useAddSupervisionCriteriaMutation();

    const [updateSupervisionCriteria, { isLoading: updateSupervisionLoading }] =
        useUpdateSupervisionCriteriaMutation();

    const onSubmit: SubmitHandler<TSupervisionCriteriaFormValues> = async (
        data
    ) => {
        try {
            dialogProps?.type === "update"
                ? await updateSupervisionCriteria({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await addSupervisionCriteria(data).unwrap();
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
                            placeholder="Enter Name"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1">
                        <FormInput
                            label="Description"
                            placeholder="Enter Description"
                            name="description"
                        />
                    </div>

                    <div className="grid grid-cols-1">
                        <FormSelect
                            label="Supervision Evaluation Category"
                            placeholder="Select Evaluation Category"
                            name="evaluation_category"
                            required
                            options={categoryOptions}
                        />
                    </div>

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

export default AddSupervisionCriteria;
