import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "components/ui/select";

import { Form } from "components/ui/form";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useGetAssetsQuery } from "services/admin/assetsApi";
import {
    useApproveRequestMutation,
    useGetOneVehicleRequestsQuery,
} from "services/admin/VehicleRequestApi";
import { toast } from "sonner";
import { APPROVAL_PROCESS } from "../FacilitiesManagment/FacilitiesMaintanance";
import { useGetAllUsersQuery } from "services/auth/user";

const AssetsItem = ({
    desc,
    heading,
    className,
}: {
    heading?: string;
    desc?: string;
    className?: string;
}) => {
    return (
        <div className={className}>
            <h4 className="text-base font-semibold ">{heading}</h4>
            <p className="text-[#4D4545] text-sm">{desc}</p>
        </div>
    );
};

const ViewVehicle = () => {
    const form = useForm({
        defaultValues: {
            vehicles: [{ vehicle: "", driver: "" }],
        },
    });

    const [VehicleId] = useState(sessionStorage.getItem("vehicle_request"));

    const [searchParams] = useSearchParams();

    const id = searchParams.get("id") as string;

    const { data: oneVehicle } = useGetOneVehicleRequestsQuery({
        id: String(VehicleId),
    });

    const { data } = useGetAssetsQuery({
        classification: "Vehicle",
    });

    const { data: user } = useGetAllUsersQuery({
        page: 1,
        size: 2000000,
    });

    const [approveRequest, { isLoading }] = useApproveRequestMutation();

    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "vehicles",
    });
    const onSubmit = async (data: any) => {
        const payload = {
            id: String(id),
            body: {
                ...data,
                status: "Approved",
            },
        };
        try {
            await approveRequest(payload).unwrap();

            toast.success("Data was successfully submitted");
        } catch (error) {
            toast.error(" Error Submitting data ");
        }
    };

    return (
        <div className="space-y-4">
            <BackNavigation />
            <Card className="p-6 mx-auto space-y-5 ">
                <AssetsItem
                    heading="Requesting Staff"
                    desc={`${String(
                        oneVehicle?.requesting_staff?.first_name
                    )} ${String(oneVehicle?.requesting_staff?.last_name)}`}
                />

                <div className="grid grid-cols-3 gap-5 mb-6">
                    <AssetsItem
                        heading="Location"
                        desc={String(oneVehicle?.location?.name)}
                    />
                    <AssetsItem
                        heading="Date Of Request"
                        desc={String(oneVehicle?.request_date)}
                    />
                    <AssetsItem
                        heading="Travel Destination"
                        desc={String(oneVehicle?.destination)}
                    />
                    <AssetsItem
                        heading="Departure Date"
                        desc={String(oneVehicle?.departure_date)}
                    />
                    <AssetsItem
                        heading="Return Date"
                        desc={String(oneVehicle?.return_date)}
                    />
                    <AssetsItem
                        heading="Point of Departure"
                        desc={String(oneVehicle?.point_of_departure)}
                    />
                </div>

                <h3 className="mb-2 text-lg font-bold text-yellow-500">
                    Travel Team Members ({oneVehicle?.team_members?.length})
                </h3>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {oneVehicle?.team_members?.map((item, i) => (
                        <Card key={i} className="p-2 space-y-3 bg-amber-50">
                            <p>
                                <span className="font-bold">Name:</span>{" "}
                                {item.first_name} {item.last_name}
                            </p>
                            <p>
                                <span className="font-bold">Position:</span>{" "}
                                {item.designation}
                            </p>
                            <p>
                                <span className="font-bold">Tel:</span>{" "}
                                {item.phone_number}
                            </p>
                        </Card>
                    ))}
                </div>

                <h3 className="text-lg font-bold">Approval</h3>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select approval" />
                        </SelectTrigger>
                        <SelectContent>
                            {APPROVAL_PROCESS.map((approval, index) => (
                                <SelectItem key={index} value={approval.value}>
                                    {approval.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select name" />
                        </SelectTrigger>
                        <SelectContent>
                            {APPROVAL_PROCESS.map((approval, index) => (
                                <SelectItem key={index} value={approval.value}>
                                    {approval.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <h3 className="mb-2 text-lg font-bold">Vehicle</h3>
                <Form {...form}>
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex mb-2 space-x-2">
                                <div className="w-[45%]">
                                    <FormSelect
                                        placeholder="Select Vehicle"
                                        name={`vehicles.${index}.vehicle`}
                                        options={[]}
                                    />
                                </div>
                                <div className="w-[45%]">
                                    <FormSelect
                                        placeholder="Select Driver"
                                        name={`vehicles.${index}.driver`}
                                        options={[]}
                                    />
                                </div>

                                <div className="flex justify-end flex-1">
                                    <Button
                                        variant="destructive"
                                        onClick={() => remove(index)}
                                    >
                                        X
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button
                            type="button"
                            className="mb-6 text-white bg-green-500"
                            onClick={() => append({ vehicle: "", driver: "" })}
                        >
                            + Add Vehicle
                        </Button>
                        <div className="mb-6">
                            <FormInput
                                name="recommendations"
                                label="Recommendations"
                            />
                        </div>
                        <FormButton
                            loading={isLoading}
                            type="submit"
                            className="w-2/12 text-white bg-red-500"
                        >
                            Approve Request
                        </FormButton>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default ViewVehicle;
