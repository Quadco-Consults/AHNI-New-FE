import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";

import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import {
    useAddAssetConditionMutation,
    useUpdateAssetConditionMutation,
} from "services/modules/admin/asset-condition";
import {
    AssetConditionSchema,
    TAssetConditionData,
    TAssetConditionFormValues,
} from "definations/modules/admin/asset-condition";

const AddAssetConditions = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TAssetConditionData;

    const form = useForm<TAssetConditionFormValues>({
        resolver: zodResolver(AssetConditionSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const dispatch = useAppDispatch();
    const [assetConditions, { isLoading }] = useAddAssetConditionMutation();

    const [updateAssetConditions, { isLoading: updateAssetConditionsLoading }] =
        useUpdateAssetConditionMutation();

    const onSubmit: SubmitHandler<TAssetConditionFormValues> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateAssetConditions({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await assetConditions(data).unwrap();
            toast.success("Asset Condition Added Succesfully");
            dispatch(closeDialog());
            form.reset();
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
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
                />
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
