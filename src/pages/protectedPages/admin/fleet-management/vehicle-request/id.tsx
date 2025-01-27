import { skipToken } from "@reduxjs/toolkit/query/react";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import DeleteIcon from "components/icons/DeleteIcon";
import DescriptionCard from "components/shared/DescriptionCard";
import { LoadingSpinner } from "components/shared/Loading";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useGetSingleVehicleRequestQuery } from "services/admin/fleet-management/vehicle-request";
import { useGetAllAssetsQuery } from "services/admin/inventory-management/asset";
import { useGetAllUsersQuery } from "services/auth/user";

export default function VehicleRequestDetails() {
    const { id } = useParams();

    const { data, isLoading } = useGetSingleVehicleRequestQuery(
        id ?? skipToken
    );

    const form = useForm();

    const { data: vehicle } = useGetAllAssetsQuery({ page: 1, size: 2000000 });

    const vehicleOptions = useMemo(
        () =>
            vehicle?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [vehicle]
    );

    const { data: driver } = useGetAllUsersQuery({ page: 1, size: 2000000 });

    const driverOptions = useMemo(
        () =>
            driver?.data.results.map(({ first_name, last_name, id }) => ({
                label: `${first_name} ${last_name}`,
                value: id,
            })),
        [driver]
    );

    return (
        <div className="space-y-4">
            <BackNavigation extraText="View Vehicle Request" />
            <Card className="p-6 mx-auto space-y-5 ">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    data && (
                        <>
                            <DescriptionCard
                                label="Requesting Staff"
                                description={`${
                                    data?.data?.requesting_staff?.first_name ||
                                    ""
                                } ${
                                    data?.data?.requesting_staff?.last_name ||
                                    ""
                                }`}
                            />

                            <div className="grid grid-cols-3 gap-5 mb-6">
                                <DescriptionCard
                                    label="Location"
                                    description={data?.data.location.name}
                                />

                                <DescriptionCard
                                    label="Date of Request"
                                    description={format(
                                        data?.data.created_datetime,
                                        "dd-MMM-yyyy"
                                    )}
                                />

                                <DescriptionCard
                                    label="Travel Destination"
                                    description={data?.data.travel_destination}
                                />

                                <DescriptionCard
                                    label="Departure Date"
                                    description={format(
                                        data?.data.departure_datetime,
                                        "dd-MMM-yyyy"
                                    )}
                                />

                                <DescriptionCard
                                    label="Return Date"
                                    description={format(
                                        data?.data.return_datetime,
                                        "dd-MMM-yyyy"
                                    )}
                                />

                                <DescriptionCard
                                    label="Point of Departure"
                                    description={data?.data.departure_point}
                                />
                            </div>

                            <h3 className="mb-2 text-lg font-bold text-yellow-500">
                                Travel Team Members (
                                {data?.data.travel_team_members.length})
                            </h3>
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                {data?.data.travel_team_members.map(
                                    ({
                                        id,
                                        first_name,
                                        last_name,
                                        position,
                                        mobile_number,
                                    }) => (
                                        <Card
                                            key={id}
                                            className="p-2 space-y-3 bg-amber-50"
                                        >
                                            <p>
                                                <span className="font-bold">
                                                    Name:&nbsp;
                                                </span>
                                                {first_name}&nbsp;
                                                {last_name}
                                            </p>
                                            <p>
                                                <span className="font-bold">
                                                    Position:
                                                </span>
                                                &nbsp;
                                                {position || "N/A"}
                                            </p>
                                            <p>
                                                <span className="font-bold">
                                                    Tel:&nbsp;
                                                </span>
                                                {mobile_number || "N/A"}
                                            </p>
                                        </Card>
                                    )
                                )}
                            </div>

                            <FormProvider {...form}>
                                <form className="space-y-5">
                                    <h3 className="mb-2 text-lg font-bold">
                                        Vehicle
                                    </h3>

                                    <div className="flex items-center gap-5">
                                        <FormSelect
                                            name=""
                                            className="flex-1"
                                            placeholder="Select Vehicle"
                                            options={vehicleOptions}
                                        />

                                        <FormSelect
                                            name=""
                                            className="flex-1"
                                            placeholder="Select Driver"
                                            options={driverOptions}
                                        />

                                        <Button variant="ghost">
                                            <DeleteIcon />
                                        </Button>
                                    </div>

                                    <Button type="button">
                                        Add Vehicle <PlusIcon />
                                    </Button>

                                    <FormTextArea
                                        label="Comment"
                                        name="comment"
                                        placeholder="Enter Comment"
                                    />

                                    <FormButton
                                        size="lg"
                                        className="bg-green-500"
                                    >
                                        Approve Request
                                    </FormButton>
                                </form>
                            </FormProvider>
                        </>
                    )
                )}
            </Card>
        </div>
    );
}
