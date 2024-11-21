import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    useAddPrequalificationCriteriaMutation,
    useUpdatePrequalificationCriteriaMutation,
} from "services/moduleProcurement";
import {
    TPrequalificationCriteria,
    prequalificationCriteriaSchema,
} from "definations/module-procurement";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";

const AddPrequalificationCriteria = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TPrequalificationCriteria;
    const form = useForm<TPrequalificationCriteria>({
        resolver: zodResolver(prequalificationCriteriaSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
            category: data?.category ?? "",
        },
    });

    const [prequalificationCriteria, { isLoading }] =
        useAddPrequalificationCriteriaMutation();
    const [
        updatePrequalificationCriteria,
        { isLoading: updatePrequalificationCriteriaLoading },
    ] = useUpdatePrequalificationCriteriaMutation();

    const dispatch = useAppDispatch();
    const onSubmit: SubmitHandler<TPrequalificationCriteria> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updatePrequalificationCriteria({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await prequalificationCriteria(data).unwrap();
            toast.success("Pre-qualification Criteria Added Succesfully");
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
                    <div className="grid grid-cols-1 gap-y-7">
                        <FormInput
                            label="Description"
                            placeholder="Enter description"
                            name="description"
                            required
                        />
                        <FormInput
                            label="Category"
                            name="category"
                            placeholder="Enter category"
                            required
                        />
                    </div>
                    <div className="flex justify-start gap-4">
                        <FormButton
                            loading={
                                isLoading ||
                                updatePrequalificationCriteriaLoading
                            }
                        >
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddPrequalificationCriteria;
