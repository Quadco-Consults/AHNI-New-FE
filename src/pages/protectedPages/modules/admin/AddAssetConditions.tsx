import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import {
    TAssetConditions,
    assetConditionsSchema,
} from "definations/module-admin";
import {
    useAddAssetConditionsMutation,
    useUpdateAssetConditionsMutation,
} from "services/moduleAdmin";

import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";

const AddAssetConditions = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TAssetConditions;

    const form = useForm<TAssetConditions>({
        resolver: zodResolver(assetConditionsSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const dispatch = useAppDispatch();
    const [assetConditions, { isLoading }] = useAddAssetConditionsMutation();

    const [updateAssetConditions, { isLoading: updateAssetConditionsLoading }] =
        useUpdateAssetConditionsMutation();

    const onSubmit: SubmitHandler<TAssetConditions> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateAssetConditions({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await assetConditions(data).unwrap();
            toast.success("Asset Conditions Added Succesfully");
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
                        placeholder="Enter name"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 gap-y-7">
                    <FormInput
                        label="Description"
                        name="description"
                        placeholder="Enter description"
                        required
                    />
                </div>
                <div className="flex justify-start gap-4">
                    <FormButton
                        loading={isLoading || updateAssetConditionsLoading}
                    >
                        Save
                    </FormButton>
                </div>
            </form>
        </Form>
    );
};

export default AddAssetConditions;
