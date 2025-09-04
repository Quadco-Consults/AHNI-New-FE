"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import {
    SolicitationEvaluationCriteriaSchema,
    TSolicitationEvaluationCriteriaData,
    TSolicitationEvaluationCriteriaFormValues,
} from "components/modules-types/procurement/solicitation-evaluation-criteria";
import {
    useAddSolicitationEvaluationCriteria,
    useUpdateSolicitationEvaluationCriteria,
} from "@/features/modules/controllers/procurement/solicitation-evaluation-criteriaController";
import FormTextArea from "components/atoms/FormTextArea";

const AddSolicitationEvaluationCriteria = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data =
        dialogProps?.data as unknown as TSolicitationEvaluationCriteriaData;
    const form = useForm<TSolicitationEvaluationCriteriaFormValues>({
        resolver: zodResolver(SolicitationEvaluationCriteriaSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const { solicitation, isLoading } =
        useAddSolicitationEvaluationCriteria();
    const { updateSolicitation, isLoading: updateSolicitationLoading } =
        useUpdateSolicitationEvaluationCriteria();

    const dispatch = useAppDispatch();
    const onSubmit: SubmitHandler<
        TSolicitationEvaluationCriteriaFormValues
    > = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateSolicitation({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  })
                : await solicitation(data)();
            toast.success("Solicitation Criteria Evaluation Added Succesfully");
            dispatch(closeDialog());
            form.reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
        }
    };
    return (
        <CardContent>
            <Form {...form}>
                <form
                    action=""
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-y-7"
                >
                    <FormInput
                        label="Name"
                        name="name"
                        placeholder="Enter Name"
                        required
                    />

                    <FormTextArea
                        label="Description"
                        name="description"
                        placeholder="Enter Description"
                    />
                    <div className="flex justify-start gap-4">
                        <FormButton
                            loading={isLoading || updateSolicitationLoading}
                        >
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddSolicitationEvaluationCriteria;
