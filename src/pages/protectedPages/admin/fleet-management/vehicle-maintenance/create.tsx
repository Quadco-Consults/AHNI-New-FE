import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query/react";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import FormTextArea from "atoms/FormTextArea";
import { Card, CardContent } from "components/ui/card";
import { AdminRoutes } from "constants/RouterConstants";
import {
    TVehicleMaintenanceFormValues,
    VehicleMaintenanceSchema,
} from "definations/admin/fleet-management/vehicle-maintenance";
import { useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    useCreateVehicleMaintenanceMutation,
    useEditVehicleMaintenanceMutation,
    useGetSingleVehicleMaintenanceQuery,
} from "services/admin/fleet-management/vehicle-maintenance";
import { useGetAllAssetsQuery } from "services/admin/inventory-management/asset";
import { useGetAllUsersQuery } from "services/auth/user";
import { useGetAllFCONumbersQuery } from "services/modules/finance/fco-number";
import { toast } from "sonner";

const maintenanceTypeOptions = [
    {
        label: "PREVENTIVE",
        value: "PREVENTIVE",
    },
    {
        label: "CORRECTIVE",
        value: "CORRECTIVE",
    },
];

export default function CreateVehicleMaintenance() {
    const form = useForm<TVehicleMaintenanceFormValues>({
        resolver: zodResolver(VehicleMaintenanceSchema),
        defaultValues: {
            asset: "",
            maintenance_type: "",
            fco: "",
            cost_estimate: "",
            description: "",
            reviewer: "",
            authorizer: "",
            approver: "",
        },
    });

    const navigate = useNavigate();

    const { data: asset } = useGetAllAssetsQuery({
        page: 1,
        size: 2000000,
    });

    const assetOptions = useMemo(
        () =>
            asset?.data.results.map(({ id, name }) => ({
                label: name,
                value: id,
            })),
        [asset]
    );

    const { data: fcoNumber } = useGetAllFCONumbersQuery({
        page: 1,
        size: 2000000,
    });

    const fcoNumberOptions = useMemo(
        () =>
            fcoNumber?.data.results.map(({ id, name }) => ({
                label: name,
                value: id,
            })),
        [fcoNumber]
    );

    const { data: user } = useGetAllUsersQuery({
        page: 1,
        size: 2000000,
    });

    const userOptions = useMemo(
        () =>
            user?.data.results.map(({ first_name, last_name, id }) => ({
                label: `${first_name} ${last_name}`,
                value: id,
            })),
        [user]
    );

    const [createVehicleMaintenance, { isLoading: isCreateLoading }] =
        useCreateVehicleMaintenanceMutation();

    const [editVehicleMaintenance, { isLoading: isEditLoading }] =
        useEditVehicleMaintenanceMutation();

    const onSubmit: SubmitHandler<TVehicleMaintenanceFormValues> = async (
        data
    ) => {
        try {
            if (id) {
                await editVehicleMaintenance({ id, body: data }).unwrap();
                toast.success("Vehicle Maintenance Request Updated");
            } else {
                await createVehicleMaintenance(data).unwrap();
                toast.success("Vehicle Maintenance Request Raised");
            }

            navigate(AdminRoutes.INDEX_VEHICLE_MAINTENANCE);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    const [searchParams] = useSearchParams();

    const id = searchParams.get("id");

    const { data: vehicleMaintenance } = useGetSingleVehicleMaintenanceQuery(
        id ?? skipToken
    );

    useEffect(() => {
        if (vehicleMaintenance) {
            form.reset({
                asset: vehicleMaintenance?.data.asset.id,
                maintenance_type: vehicleMaintenance?.data.maintenance_type,
                fco: vehicleMaintenance?.data.fco.id,
                cost_estimate: vehicleMaintenance?.data.cost_estimate,
                description: vehicleMaintenance?.data.description,
            });
        }
    }, [vehicleMaintenance]);

    return (
        <div>
            <BackNavigation extraText="Vehicle Maintenance Ticket" />
            <Card>
                <CardContent className="p-5">
                    <FormProvider {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-y-8"
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <FormSelect
                                    label="Asset"
                                    name="asset"
                                    placeholder="Select Asset"
                                    required
                                    options={assetOptions}
                                />

                                <FormSelect
                                    label="Maintenance Type"
                                    name="maintenance_type"
                                    placeholder="Select Maintenance Type"
                                    options={maintenanceTypeOptions}
                                />

                                <FormSelect
                                    name="fco"
                                    label="FCO Number"
                                    placeholder="Select FCO Number"
                                    required
                                    options={fcoNumberOptions}
                                />
                                <FormInput
                                    name="cost_estimate"
                                    label="Cost Estimate"
                                    placeholder="Enter Cost Estimate"
                                    required
                                />
                            </div>

                            <FormTextArea
                                label="Description of Problem"
                                name="description"
                                placeholder="Enter Description"
                                required
                            />

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
                                <FormButton
                                    loading={isCreateLoading || isEditLoading}
                                >
                                    {id ? "Update Request" : "Raise Request"}
                                </FormButton>
                            </div>
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </div>
    );
}

/* <form className="space-y-4">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                            </div>
                        </form> */
