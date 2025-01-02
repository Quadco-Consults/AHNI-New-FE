import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Form } from "components/ui/form";
import { AdminRoutes } from "constants/RouterConstants";
import {
    AssetRequestSchema,
    TAssetRequestFormValues,
} from "definations/admin/inventory-management/asset-request";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useGetAllAssetsQuery } from "services/admin/inventory-management/asset";
import { useCreateAssetRequestMutation } from "services/admin/inventory-management/asset-request";
import { useGetAllUsersQuery } from "services/auth/user";
import { toast } from "sonner";

export default function CreateAssetRequest() {
    const { data: asset } = useGetAllAssetsQuery({
        page: 1,
        size: 2000000,
    });

    const { data: user } = useGetAllUsersQuery({
        page: 1,
        size: 2000000,
    });

    const assetOptions = useMemo(
        () =>
            asset?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [asset]
    );

    const userOptions = useMemo(
        () =>
            user?.data.results.map(({ first_name, last_name, id }) => ({
                label: `${first_name} ${last_name}`,
                value: id,
            })),
        [user]
    );

    const navigate = useNavigate();

    const form = useForm<TAssetRequestFormValues>({
        resolver: zodResolver(AssetRequestSchema),
        defaultValues: {
            asset: "",
            reviewer: "",
            authorizer: "",
            approver: "",
            type: "",
            recommendation: "",
            description: "",
        },
    });

    const [createAssetRequest, { isLoading: isCreateLoading }] =
        useCreateAssetRequestMutation();

    const onSubmit: SubmitHandler<TAssetRequestFormValues> = async (data) => {
        try {
            await createAssetRequest(data).unwrap();
            toast.success("Asset Request Created");
            navigate(AdminRoutes.ASSETS_REQUEST);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-x-5">
                <GoBack />
                <h4 className="text-xl font-bold">Asset Request</h4>
            </div>
            <Card>
                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormSelect
                            label="Asset"
                            name="asset"
                            required
                            placeholder="Select Asset"
                            options={assetOptions}
                        />

                        <FormSelect
                            label="Request Type"
                            name="type"
                            placeholder="Select Request Type"
                            required
                            options={[
                                { label: "Movement", value: "MOVEMENT" },
                                { label: "Disposal", value: "DISPOSAL" },
                            ]}
                        />

                        <FormInput
                            label="Recommendation"
                            name="recommendation"
                            placeholder="Enter Recommendation"
                            required
                        />

                        <FormTextArea
                            label="Description"
                            name="description"
                            placeholder="Enter Description"
                            required
                        />

                        <FormInput
                            label="Disposal Justification"
                            name="disposal_justification"
                            placeholder="Enter Disposal Justification"
                            required
                        />

                        <FormSelect
                            label="Reviewer"
                            name="reviewer"
                            required
                            placeholder="Select Reviewer"
                            options={userOptions}
                        />

                        <FormSelect
                            label="Authorizer"
                            name="authorizer"
                            required
                            placeholder="Select Authorizer"
                            options={userOptions}
                        />

                        <FormSelect
                            label="Approver"
                            name="approver"
                            required
                            placeholder="Select Approver"
                            options={userOptions}
                        />

                        <div className="flex justify-end">
                            <FormButton type="submit" loading={isCreateLoading}>
                                Create Asset Request
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
}

/*    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <FormTextArea
                                    name=""
                                    label="Justification for Disposal"
                                    placeholder="This can be repaired and we donate it to CBOs"
                                />
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                    <FormSelect
                                        name=""
                                        placeholder="Select approval"
                                        options={APPROVAL_PROCESS}
                                    />
                                    <FormSelect
                                        name=""
                                        placeholder="Select name"
                                        options={APPROVAL_PROCESS}
                                    />
                                </div>
                                <Button variant="custom" type="button">
                                    Approve
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <FormTextArea
                                    name=""
                                    label="GT CT Approval"
                                    placeholder="This can be repaired and we donate it to CBOs"
                                />
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                    <FormSelect
                                        name=""
                                        placeholder="Select approval"
                                        options={APPROVAL_PROCESS}
                                    />
                                    <FormSelect
                                        name=""
                                        placeholder="Select name"
                                        options={APPROVAL_PROCESS}
                                    />
                                </div>
                                <Button variant="custom" type="button">
                                    Approve
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <FormTextArea
                                    name=""
                                    label="CCM Approval"
                                    placeholder="This can be repaired and we donate it to CBOs"
                                />
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                    <FormSelect
                                        name=""
                                        placeholder="Select approval"
                                        options={APPROVAL_PROCESS}
                                    />
                                    <FormSelect
                                        name=""
                                        placeholder="Select name"
                                        options={APPROVAL_PROCESS}
                                    />
                                </div>
                                <Button variant="custom" type="button">
                                    Approve
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <FormTextArea name="" label="Remarks" />
                                <FormSelect
                                    name=""
                                    placeholder="Select approval"
                                    options={APPROVAL_PROCESS}
                                />
                                <Button variant="custom" type="button">
                                    Approve
                                </Button>
                            </div>
                        </div> */
