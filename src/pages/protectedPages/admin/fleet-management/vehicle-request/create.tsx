import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Card, CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { Button } from "components/ui/button";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType, largeDailogScreen } from "constants/dailogs";
import { userSelector } from "store/assets";
import { toast } from "sonner";
import { useGetAllUsersQuery } from "services/auth/user";
import { useGetAllLocationsQuery } from "services/modules/config/location";
import {
    TVehicleRequestFormValues,
    VehicleRequestSchema,
} from "definations/admin/fleet-management/vehicle-request";
import { useEffect, useMemo } from "react";
import FormTextArea from "atoms/FormTextArea";
import {
    useCreateVehicleRequestMutation,
    useEditVehicleRequestMutation,
    useGetSingleVehicleRequestQuery,
} from "services/admin/fleet-management/vehicle-request";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdminRoutes } from "constants/RouterConstants";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { addTeamMembers } from "store/admin/team-members";

const NewVehicleRequest = () => {
    const form = useForm<TVehicleRequestFormValues>({
        resolver: zodResolver(VehicleRequestSchema),
        defaultValues: {
            location: "",
            travel_destination: "",
            departure_point: "",
            departure_datetime: "",
            return_datetime: "",
            travel_team_members: [],
            supervisor: "",
            recommendations: "",
        },
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const { data: user } = useGetAllUsersQuery({ page: 1, size: 2000000 });

    const userOptions = useMemo(
        () =>
            user?.data.results.map(({ first_name, last_name, id }) => ({
                label: `${first_name} ${last_name}`,
                value: id,
            })),
        [user]
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

    const users = useAppSelector(userSelector);

    const [createVehicleRequest, { isLoading: isCreateLoading }] =
        useCreateVehicleRequestMutation();

    const [editVehicleRequest, { isLoading: isEditLoading }] =
        useEditVehicleRequestMutation();

    const onSubmit: SubmitHandler<TVehicleRequestFormValues> = async (data) => {
        try {
            if (id) {
                await editVehicleRequest({ id, body: data }).unwrap();
                toast.success("Updated Vehicle Request");
            } else {
                await createVehicleRequest(data).unwrap();
                toast.success("Vehicle Request Submitted");
            }

            navigate(AdminRoutes.INDEX_VEHICLE_REQUEST);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    const onTeamClick = () => {
        dispatch(
            openDialog({
                type: DialogType.AddTeamMenbers,
                dialogProps: {
                    ...largeDailogScreen,
                },
            })
        );
    };

    const { teamMembers } = useAppSelector((state) => state.teamMember);

    useEffect(() => {
        form.setValue(
            "travel_team_members",
            teamMembers.map(({ id }) => id)
        );
    }, [teamMembers]);

    const { data: vehicleRequest } = useGetSingleVehicleRequestQuery(
        id ?? skipToken
    );

    useEffect(() => {
        if (vehicleRequest) {
            const {
                location,
                travel_destination,
                departure_point,
                return_point,
                departure_datetime,
                return_datetime,
                travel_team_members,
                supervisor,
                recommendations,
            } = vehicleRequest.data;

            form.reset({
                location: location.id,
                travel_destination,
                departure_point,
                return_point,
                departure_datetime,
                return_datetime,
                supervisor: supervisor.id,
                recommendations,
            });

            dispatch(addTeamMembers(travel_team_members));
        }
    }, [vehicleRequest]);

    return (
        <div>
            <BackNavigation extraText="Vehicle Request" />
            <div>
                <Card>
                    <CardContent className="py-8">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex flex-col gap-y-6"
                            >
                                <FormSelect
                                    label="Location"
                                    name="location"
                                    placeholder="Select Location"
                                    required
                                    options={locationOptions}
                                />

                                <div className="grid grid-cols-2 gap-5">
                                    <FormInput
                                        label="Destination of Travel"
                                        name="travel_destination"
                                        placeholder="Enter Travel Destination"
                                        required
                                    />

                                    <FormInput
                                        label="Point of Departure"
                                        name="departure_point"
                                        placeholder="Enter Departure Point"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-5">
                                    <FormInput
                                        label="Point of Return"
                                        name="return_point"
                                        placeholder="Enter Return Point"
                                        required
                                    />

                                    <FormInput
                                        label="Date of Departure"
                                        name="departure_datetime"
                                        type="date"
                                        required
                                    />

                                    <FormInput
                                        label="Date of Return"
                                        name="return_datetime"
                                        type="date"
                                        required
                                    />
                                </div>
                                <div>
                                    <p className="my-2 font-semibold">
                                        Travel Team Members (
                                        {teamMembers?.length})
                                    </p>

                                    <div className="grid grid-cols-4 gap-5 ">
                                        {teamMembers.map(
                                            ({
                                                id,
                                                first_name,
                                                last_name,
                                                designation,
                                                position,
                                                mobile_number,
                                            }) => (
                                                <div
                                                    className="p-3 bg-yellow-100"
                                                    key={id}
                                                >
                                                    <p>
                                                        <span className="font-semibold">
                                                            Name:&nbsp;
                                                        </span>
                                                        {`${first_name} ${last_name}`}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">
                                                            Position:&nbsp;
                                                        </span>
                                                        {designation}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">
                                                            Tel:&nbsp;
                                                        </span>
                                                        {mobile_number}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <Button
                                    onClick={() => onTeamClick()}
                                    type="button"
                                    className="w-3/12 text-[#DEA004] bg-white border "
                                >
                                    Click to select team members
                                </Button>

                                <FormSelect
                                    label="Supervisor"
                                    name="supervisor"
                                    placeholder="Select Supervisor"
                                    required
                                    options={userOptions}
                                />
                                <FormTextArea
                                    label="Recommendations"
                                    name="recommendations"
                                    placeholder="Enter Recommendations"
                                    required
                                />

                                <div className="ml-auto">
                                    <FormButton
                                        loading={
                                            isCreateLoading || isEditLoading
                                        }
                                        type="submit"
                                    >
                                        Submit
                                    </FormButton>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NewVehicleRequest;
