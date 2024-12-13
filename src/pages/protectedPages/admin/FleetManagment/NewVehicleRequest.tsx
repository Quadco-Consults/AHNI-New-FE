import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Card, CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { useCreateVehicleRequestMutation } from "services/adminApi/VehicleRequestApi";
import { Button } from "components/ui/button";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType, largeDailogScreen } from "constants/dailogs";
import { clearUser, userSelector } from "store/assets";
import { useGetUserQuery } from "services/users";
import { useLocationQuery } from "services/modules/project/moduleProjects";
import { useMemo } from "react";
import { toast } from "sonner";

const vehicleRequestSchema = z.object({
    supervisor: z.string().min(1, "Supervisor is required"),
    point_of_departure: z.string().min(1, "Point of departure is required"),
    destination: z.string().min(1, "Destination is required"),
    request_date: z.string().min(1, "Request date is required"),
    departure_date: z.string().min(1, "Departure date is required"),
    return_date: z.string().min(1, "Return date is required"),

    recommendations: z.string().optional(),
    approved_by: z.string().optional(),
    requesting_staff: z.string().uuid("Invalid UUID"),
    location: z.string().uuid("Invalid UUID"),
});

type VehicleRequestFormData = z.infer<typeof vehicleRequestSchema>;

const defaultValues: Partial<VehicleRequestFormData> = {
    supervisor: "",
    point_of_departure: "",
    destination: "",
    request_date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
    departure_date: "",
    return_date: "",
    recommendations: "",
    approved_by: "",
    requesting_staff: "f9061c8b-783c-4411-9c9a-90e55408b9bd", // Using the ID from the provided user data
    location: "", // You might want to set this to a default location ID if available
};

const NewVehicleRequest = () => {
    const form = useForm<VehicleRequestFormData>({
        resolver: zodResolver(vehicleRequestSchema),
        defaultValues,
    });

    const dispatch = useAppDispatch();

    const { data } = useGetUserQuery({});

    const { data: location } = useLocationQuery({});

    const drivedUsers = useMemo(() => {
        return data?.results.map((userData) => {
            return {
                label: `${userData.first_name} ${userData.last_name}`,
                value: userData.id,
            };
        });
    }, [data?.results]);

    const drivedLocation = useMemo(() => {
        return location?.results.map((item: any) => {
            return {
                label: item.name,
                value: item.id,
            };
        });
    }, [location?.results]);

    const users = useAppSelector(userSelector);

    const [createVehicleRequest, { isLoading }] =
        useCreateVehicleRequestMutation();

    const onSubmit = async (data: VehicleRequestFormData) => {
        try {
            await createVehicleRequest({
                ...data,
                team_members: users.map((user) => user.id),
            }).unwrap();
            toast.success("Vehicle request successfully submitted");
            dispatch(clearUser());
            form.reset(defaultValues);
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
                                    options={drivedUsers}
                                />
                                <div className="grid grid-cols-6 gap-x-5">
                                    <div className="col-span-3">
                                        <FormSelect
                                            options={drivedLocation}
                                            name="location"
                                            label="Location"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <FormInput
                                            name="request_date"
                                            label="Date of Request"
                                            type="date"
                                            required
                                        />
                                    </div>
                                </div>
                                <FormInput
                                    name="destination"
                                    label="Destination of Travel"
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
                                    <div className="grid grid-cols-4 gap-5 ">
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
                                    </div>
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
                                <FormInput
                                    name="recommendations"
                                    label="Recommendations"
                                />
                                <div className="w-2/12">
                                    <FormButton
                                        loading={isLoading}
                                        type="submit"
                                    >
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
