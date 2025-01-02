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
import { useMemo } from "react";
import FormTextArea from "atoms/FormTextArea";

const NewVehicleRequest = () => {
    const form = useForm<TVehicleRequestFormValues>({
        resolver: zodResolver(VehicleRequestSchema),
        defaultValues: {
            travel_destination: "",
            departure_date: "",
            departure_point: "",
            return_date: "",
            reccomendations: "",
            created_by: "",
            location: "",
            supervisor: "",
            travel_team_members: [],
        },
    });

    const dispatch = useAppDispatch();

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

    const users = useAppSelector(userSelector);

    const onSubmit: SubmitHandler<TVehicleRequestFormValues> = async (data) => {
        try {
            toast.success("Vehicle request successfully submitted");
        } catch (error) {
            toast.error("Failed to create vehicle request:");
            // Handle error (e.g., show an error message)
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
                                    name="requesting_staff"
                                    label="Requesting Staff"
                                    required
                                    options={userOptions}
                                />

                                <FormSelect
                                    options={[]}
                                    name="location"
                                    label="Location"
                                    required
                                />

                                <FormInput
                                    name="destination"
                                    label="Destination of Travel"
                                    required
                                />

                                <FormTextArea
                                    name="Purpose of Travel"
                                    label="Date of Departure"
                                    type="date"
                                    required
                                />

                                <div className="grid grid-cols-6 gap-x-6">
                                    <div className="col-span-2">
                                        <FormInput
                                            name="departure_date"
                                            label="Date of Departure"
                                            type="date"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <FormInput
                                            name="point_of_departure"
                                            label="Point of Departure"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <FormInput
                                            name="point_of_departure"
                                            label="Point of Return"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <FormInput
                                            name="return_date"
                                            label="Date of Return"
                                            type="date"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="my-2 font-semibold">
                                        Travel Team Members ({users?.length})
                                    </p>
                                    {/* <div className="grid grid-cols-4 gap-5 ">
                                        {users?.length > 0
                                            ? users?.map((member) => {
                                                  return (
                                                      <div
                                                          className="p-3 bg-yellow-100"
                                                          key={member.id}
                                                      >
                                                          <p className="">
                                                              <span className="font-semibold">
                                                                  Name:
                                                              </span>{" "}
                                                              {`${member.first_name} ${member.last_name}`}
                                                          </p>
                                                          <p>
                                                              <span className="font-semibold">
                                                                  Position:
                                                              </span>{" "}
                                                              {
                                                                  member.designation
                                                              }
                                                          </p>
                                                          <p>
                                                              <span className="font-semibold">
                                                                  Tel:
                                                              </span>{" "}
                                                              {
                                                                  member.phone_number
                                                              }
                                                          </p>
                                                      </div>
                                                  );
                                              })
                                            : ""}
                                    </div> */}
                                </div>

                                <Button
                                    onClick={() => onTeamClick()}
                                    type="button"
                                    className="w-3/12 text-[#DEA004] bg-white border "
                                >
                                    Click to select team members
                                </Button>

                                <FormInput
                                    name="supervisor"
                                    label="Supervisor"
                                    required
                                />
                                <FormTextArea
                                    name="recommendations"
                                    label="Recommendations"
                                />
                                <div className="ml-auto">
                                    <FormButton loading={false} type="submit">
                                        Raise Request
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
