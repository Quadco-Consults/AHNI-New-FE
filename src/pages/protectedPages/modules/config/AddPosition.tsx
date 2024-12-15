import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import {
    PositionSchema,
    TPositionData,
    TPositionFormValues,
} from "definations/modules/config/position";
import {
    useAddPositionMutation,
    useUpdatePositionMutation,
} from "services/modules/config/position";

const AddPosition = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TPositionData;

    console.log({ data });

    const form = useForm<TPositionFormValues>({
        resolver: zodResolver(PositionSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const dispatch = useAppDispatch();

    const [addPosition, { isLoading: isAddLoading }] = useAddPositionMutation();

    const [updatePosition, { isLoading: isUpdateLoading }] =
        useUpdatePositionMutation();

    const onSubmit: SubmitHandler<TPositionFormValues> = async (data) => {
        try {
            if (dialogProps?.type === "update") {
                await updatePosition({
                    // @ts-ignore
                    id: String(dialogProps?.data?.id),
                    body: data,
                }).unwrap();
            } else {
                await addPosition(data).unwrap();
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
                className="flex flex-col gap-y-7"
            >
                <FormInput
                    label="Name"
                    name="name"
                    placeholder="Enter Name"
                    required
                />

                <FormInput
                    label="Description"
                    name="description"
                    placeholder="Enter Description"
                    required
                />

                <div className="flex justify-start gap-4">
                    <FormButton loading={isAddLoading || isUpdateLoading}>
                        Save
                    </FormButton>
                </div>
            </form>
        </Form>
    );
};

export default AddPosition;
