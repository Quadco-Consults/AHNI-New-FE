import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
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
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useGetAllAssetsQuery } from "services/admin/inventory-management/asset";
import {
    useCreateAssetRequestMutation,
    useEditAssetRequestMutation,
    useGetSingleAssetRequestQuery,
} from "services/admin/inventory-management/asset-request";
import { useGetAllUsersQuery } from "services/auth/user";
import { toast } from "sonner";
import AssetRequestLayout from "./Layout";
import { useGetAllLocationsQuery } from "services/modules/config/location";

export default function CreateAssetRequestDetails() {
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
    const { pathname } = useLocation();

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

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const { data: assetRequest } = useGetSingleAssetRequestQuery(
        id ?? skipToken
    );

    const { data: location } = useGetAllLocationsQuery({
        page: 1,
        size: 2000000,
    });

    const locationOptions = useMemo(
        () =>
            location?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [location]
    );

    const [editAssetRequest, { isLoading: isEditLoading }] =
        useEditAssetRequestMutation();

    const [createAssetRequest, { isLoading: isCreateLoading }] =
        useCreateAssetRequestMutation();

    const onSubmit: SubmitHandler<TAssetRequestFormValues> = async (data) => {
        let newAssetRequestId;

        try {
            if (id) {
                await editAssetRequest({ id, body: data }).unwrap();
                toast.success("Asset Request Updated");
            } else {
                let response = await createAssetRequest(data).unwrap();
                newAssetRequestId = response.data.id;
                toast.success("Asset Request Created");
            }

            if (form.watch("type") === "DISPOSAL") {
                let path = pathname;

                path = path.substring(0, path.lastIndexOf("/"));

                path += `/uploads?id=${id ?? newAssetRequestId}`;

                navigate(path);
                return;
            }

            navigate(AdminRoutes.ASSETS_REQUEST);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    useEffect(() => {
        if (assetRequest) {
            form.reset({
                asset: assetRequest?.data.asset.id,
                type: assetRequest?.data.type,
                recommendation: assetRequest?.data.recommendation,
                description: assetRequest?.data.description,
                disposal_justification:
                    assetRequest?.data.disposal_justification,
            });
        }
    }, [assetRequest]);

    const requestType = form.watch("type");

    return (
        <AssetRequestLayout>
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
                            <div className="grid grid-cols-2 gap-10">
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
                                        {
                                            label: "Movement",
                                            value: "MOVEMENT",
                                        },
                                        {
                                            label: "Disposal",
                                            value: "DISPOSAL",
                                        },
                                    ]}
                                />
                            </div>

                            {requestType === "MOVEMENT" && (
                                <div className="grid grid-cols-2 gap-10">
                                    <FormSelect
                                        label="From"
                                        name="from"
                                        id="from"
                                        placeholder="Select Location"
                                        required
                                        options={locationOptions}
                                    />

                                    <FormSelect
                                        label="To"
                                        name="to"
                                        id="to"
                                        placeholder="Select Location"
                                        required
                                        options={locationOptions}
                                    />
                                </div>
                            )}

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

                            <div className="grid grid-cols-2 gap-10">
                                <FormInput
                                    label="Justification"
                                    name="disposal_justification"
                                    placeholder="Enter Justification"
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
                            </div>

                            <div className="flex justify-end">
                                <FormButton
                                    type="submit"
                                    size="lg"
                                    loading={isCreateLoading || isEditLoading}
                                >
                                    Submit
                                </FormButton>
                            </div>
                        </form>
                    </Form>
                </Card>
            </div>
        </AssetRequestLayout>
    );
}
