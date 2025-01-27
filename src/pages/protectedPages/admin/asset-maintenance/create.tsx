import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import FormTextArea from "atoms/FormTextArea";
import { Card, CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { AdminRoutes } from "constants/RouterConstants";
import {
    AssetMaintenanceSchema,
    TAssetMaintenanceFormData,
} from "definations/admin/asset-maintenance";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateAssetMaintenanceMutation } from "services/admin/asset-maintenance";
import { useGetAllAssetsQuery } from "services/admin/inventory-management/asset";
import { useGetAllUsersQuery } from "services/auth/user";
import { useGetAllDepartmentsQuery } from "services/modules/config/department";
import { useGetAllLocationsQuery } from "services/modules/config/location";
import { toast } from "sonner";

const descOptions = [
    {
        label: "Complaints",
        value: "Complaints",
    },
    {
        label: "Diagnosis",
        value: "Diagnosis",
    },
];

export default function CreateAssetMaintenance() {
    const form = useForm<TAssetMaintenanceFormData>({
        resolver: zodResolver(AssetMaintenanceSchema),
        defaultValues: {
            maintenance_datetime: "",
            asset: "",
            maintenance_type: "",
            rate: "",
            cost_estimate: "",
            total_cost_estimate: "",
            description: "",
            description_type: "",
            reviewer: "",
            authorizer: "",
            approver: "",
        },
    });

    console.log(form.formState.errors);

    const navigate = useNavigate();

    const { data: user } = useGetAllUsersQuery({ page: 1, size: 2000000 });

    const userOptions = useMemo(
        () =>
            user?.data.results.map(({ first_name, last_name, id }) => ({
                label: `${first_name} ${last_name}`,
                value: id,
            })),
        [user]
    );

    const { data: department } = useGetAllDepartmentsQuery({
        page: 1,
        size: 2000000,
    });

    const departmentOptions = useMemo(
        () =>
            department?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [department]
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

    const { data: asset } = useGetAllAssetsQuery({
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

    const [createAssetMaintenance, { isLoading: isCreateLoading }] =
        useCreateAssetMaintenanceMutation();

    const onSubmit: SubmitHandler<TAssetMaintenanceFormData> = async (data) => {
        try {
            await createAssetMaintenance(data).unwrap();
            toast.success("Asset Maintenance Ticket Raised");
            navigate(AdminRoutes.INDEX_ASSET_MAINTENANCE);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <div className="flex flex-col gap-y-6">
            <BackNavigation extraText="Request Asset Maintenance" />
            <Card>
                <CardContent className="py-7">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-y-6"
                            action=""
                        >
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <FormInput
                                    label="Date/Time"
                                    name="maintenance_datetime"
                                    type="date"
                                    required
                                />

                                <FormSelect
                                    label="Asset "
                                    name="asset"
                                    placeholder="Select Asset"
                                    required
                                    options={assetOptions}
                                />

                                <FormSelect
                                    label="Maintenance Type "
                                    name="maintenance_type"
                                    placeholder="Enter Maintenance Type"
                                    required
                                    options={[
                                        {
                                            label: "CORRECTIVE",
                                            value: "CORRECTIVE",
                                        },
                                        {
                                            label: "PREVENTIVE",
                                            value: "PREVENTIVE",
                                        },
                                    ]}
                                />

                                <FormInput
                                    label="Rate"
                                    name="rate"
                                    placeholder="Enter Rate"
                                    required
                                />

                                <FormInput
                                    label="Cost Estimate"
                                    name="cost_estimate"
                                    placeholder="Enter Cost Estimate"
                                    required
                                />

                                <FormInput
                                    label="Total Cost Estimate"
                                    name="total_cost_estimate"
                                    placeholder="Enter Total Cost Estimate"
                                    required
                                />
                            </div>

                            <div className="space-y-2 max-w-md">
                                <FormSelect
                                    label="Description Type"
                                    name="description_type"
                                    placeholder="Select Description Type"
                                    required
                                    options={descOptions}
                                />
                            </div>

                            <FormTextArea
                                label="Description of Problem"
                                name="description"
                                placeholder="Enter Problem Description"
                                required
                            />
                            {/* 
                            <FormTextArea
                                label="Justification for Disposal"
                                name="disposal_justification"
                                placeholder="Enter Justification"
                                required
                            /> */}

                            <FormSelect
                                label="Reviewer"
                                name="reviewer"
                                placeholder="Select Reviewer"
                                required
                                options={userOptions}
                            />

                            <FormSelect
                                label="Authorizer"
                                name="authorizer"
                                placeholder="Select Authorizer"
                                required
                                options={userOptions}
                            />

                            <FormSelect
                                label="Approver"
                                name="approver"
                                placeholder="Select Approver"
                                required
                                options={userOptions}
                            />

                            <div className="flex justify-end">
                                <FormButton loading={isCreateLoading}>
                                    Submit
                                </FormButton>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
