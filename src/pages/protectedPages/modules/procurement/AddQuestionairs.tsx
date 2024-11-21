import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    useAddQuestionairsMutation,
    useUpdateQuestionairsMutation,
} from "services/moduleProcurement";
import {
    TQuestionairs,
    questionairsSchema,
} from "definations/module-procurement";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";

const AddQuestionairs = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TQuestionairs;
    const form = useForm<TQuestionairs>({
        resolver: zodResolver(questionairsSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const [questionairs, { isLoading }] = useAddQuestionairsMutation();
    const [updateQuestionairs, { isLoading: updateQuestionairsLoading }] =
        useUpdateQuestionairsMutation();

    const dispatch = useAppDispatch();
    const onSubmit: SubmitHandler<TQuestionairs> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateQuestionairs({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await questionairs(data).unwrap();
            toast.success("Questionairs Added Succesfully");
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
                    </div>
                    <div className="flex justify-start gap-4">
                        <FormButton
                            loading={isLoading || updateQuestionairsLoading}
                        >
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddQuestionairs;
