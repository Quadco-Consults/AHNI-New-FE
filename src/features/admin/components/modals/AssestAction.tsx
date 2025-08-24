"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import RoundBack from "assets/svgs/RoundBack";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import { Form } from "components/ui/form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";

import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { assetSelector, clearAssets } from "store/assets";
import { closeDialog } from "store/ui";
import { z } from "zod";

const assetActionSchema = z.object({
    remark: z.string().min(1, "Remark is required"),
    justification_for_disposal: z
        .string()
        .min(1, "Justification for disposal is required"),
    life_span_at_report: z.string().min(1, "Life span must be a valid integer"),
    recommendation: z.string().min(1, "Recommendation is required"),
    asset_condition_id: z.string().uuid("Asset condition must be a valid UUID"),
});

type AssetActionFormData = z.infer<typeof assetActionSchema>;

const AssestAction = () => {
    const form = useForm<AssetActionFormData>({
        resolver: zodResolver(assetActionSchema),
        defaultValues: {
            remark: "",
            justification_for_disposal: "",
            life_span_at_report: "",
            recommendation: "",
            asset_condition_id: "",
        },
    });

    // const { data: conditions } = useGetAssetConditionsQuery({
    //     page: 1,
    //     page_size: 20,
    // });

    const assets = useAppSelector(assetSelector);

    // const [assetCondition, { isLoading }] = useCreateAssetActionsMutation();

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<AssetActionFormData> = async (data) => {
        try {
            // await assetCondition({
            //     ...data,
            //     assets,
            // });
            toast.success("Action Successful");
            dispatch(closeDialog());
            dispatch(clearAssets());
        } catch (error) {
            toast.error("Action Failed");
        }
    };
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-x-2">
                <div
                    onClick={() => {
                        dispatch(closeDialog());
                    }}
                >
                    <RoundBack />
                </div>

                <h4 className="font-bold">Asset Action</h4>
            </div>
            <div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-y-6"
                    >
                        <FormInput
                            label="Remark"
                            required
                            name="remark"
                            placeholder="Asset is OBSOLETE in BAD condition"
                        />
                        <div className="">
                            <FormInput
                                label="Justification for Disposal"
                                required
                                name="justification_for_disposal"
                            />
                        </div>
                        <div className="">
                            <FormInput
                                label="Life Span at Report"
                                required
                                name="life_span_at_report"
                                type="number"
                            />
                        </div>
                        <div className="">
                            <FormInput
                                label="Recommendation"
                                required
                                name="recommendation"
                            />
                        </div>
                        <div className="">
                            <FormSelect
                                label="Asset Condition"
                                required
                                name="asset_condition_id"
                                options={[]}
                            />
                        </div>

                        <div className="w-3/12">
                            <FormButton loading={false}>
                                Raise Request
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default AssestAction;