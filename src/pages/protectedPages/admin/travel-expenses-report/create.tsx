import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import {
    FormProvider,
    SubmitHandler,
    useFieldArray,
    useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormButton from "atoms/FormButton";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import BackNavigation from "atoms/BackNavigation";
import { Separator } from "components/ui/separator";
import AddSquareIconFaded from "components/icons/AddSquareIconFaded";
import {
    TravelExpenseSchema,
    TTravelExpenseFormData,
} from "definations/admin/travel-expense";
import { useGetAllUsersQuery } from "services/auth/user";
import { useEffect, useMemo } from "react";
import {
    useCreateTravelExpenseMutation,
    useGetSingleTravelExpenseQuery,
    useModifyTravelExpenseMutation,
} from "services/admin/travel-expense";
import { toast } from "sonner";
import { skipToken } from "@reduxjs/toolkit/query/react";
import DeleteIcon from "components/icons/DeleteIcon";

const visaFreeOptions = [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
];

export default function CreateTravelExpenseReportPage() {
    const form = useForm<TTravelExpenseFormData>({
        resolver: zodResolver(TravelExpenseSchema),
        defaultValues: {
            user: "",
            staff_id: "",
            travel_purpose: "",
            activities: [
                {
                    date: "",
                    activity: "",
                    departure_datetime: "",
                    departure_point: "",
                    arrival_datetime: "",
                    assignment_location: "",
                    visa_free: "",
                    airport_taxi_fee: "",
                    registration_fee: "",
                    inter_city_taxi_fee: "",
                    total_amount: "",
                    others: "",
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "activities",
        control: form.control,
    });

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

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const [createTravelExpense, { isLoading: isCreateLoading }] =
        useCreateTravelExpenseMutation();

    const [modifyTravelExpense, { isLoading: isModifyLoading }] =
        useModifyTravelExpenseMutation();

    const onSubmit: SubmitHandler<TTravelExpenseFormData> = async (data) => {
        try {
            if (id) {
                await modifyTravelExpense({ id, body: data }).unwrap();
                toast.success("Travel Expense Report Updated");
            } else {
                await createTravelExpense(data).unwrap();
                toast.success("Travel Expense Report Created");
            }

            navigate(AdminRoutes.TRAVEL_EXPENSE_REPORT);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    const { data: travelExpense } = useGetSingleTravelExpenseQuery(
        id ?? skipToken
    );

    useEffect(() => {
        if (travelExpense) {
            const { data } = travelExpense;

            form.reset({
                user: data.user.id,
                staff_id: data.staff_id,
                travel_purpose: data.travel_purpose,
                activities: data.activities.map((activity) => ({
                    date: activity.date,
                    activity: activity.activity,
                    departure_datetime: activity.departure_datetime,
                    departure_point: activity.departure_point,
                    arrival_datetime: activity.arrival_datetime,
                    assignment_location: activity.assignment_location,
                    visa_free: String(activity.visa_free),
                    airport_taxi_fee: activity.airport_taxi_fee,
                    registration_fee: activity.registration_fee,
                    inter_city_taxi_fee: activity.inter_city_taxi_fee,
                    total_amount: activity.total_amount,
                    others: activity.others,
                })),
            });
        }
    }, [travelExpense, user]);

    return (
        <div>
            <BackNavigation />

            <Card>
                <CardContent>
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-2 gap-8">
                                <FormSelect
                                    label="User"
                                    name="user"
                                    placeholder="Select User"
                                    required
                                    options={userOptions}
                                />

                                <FormInput
                                    label="Staff ID No"
                                    name="staff_id"
                                    placeholder="Enter Staff ID No"
                                    required
                                />
                            </div>

                            <div className="mt-5">
                                <FormInput
                                    label="Purpose of Travel"
                                    name="travel_purpose"
                                    placeholder="Purpose of Travel"
                                    required
                                />
                            </div>

                            <Separator className="my-10" />

                            <div className="space-y-8">
                                {fields.map((field, index) => (
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg">
                                                Day {index + 1}
                                            </h3>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                title={`Delete Activity ${
                                                    index + 1
                                                }`}
                                                className="text-red-500"
                                                onClick={() => remove(index)}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </div>

                                        <div
                                            key={field.id}
                                            className="grid grid-cols-2 gap-8 mt-5"
                                        >
                                            <FormInput
                                                label="Date"
                                                name={`activities.${index}.date`}
                                                type="date"
                                                required
                                            />

                                            <FormInput
                                                label="Activity"
                                                name={`activities.${index}.activity`}
                                                placeholder="Enter Activity"
                                                required
                                            />

                                            <FormInput
                                                label="Departure Date"
                                                name={`activities.${index}.departure_datetime`}
                                                type="date"
                                                required
                                            />

                                            <FormInput
                                                label="Point of Departure"
                                                name={`activities.${index}.departure_point`}
                                                placeholder="Enter Departure Point"
                                                required
                                            />

                                            <FormInput
                                                label="Arrival Date"
                                                name={`activities.${index}.arrival_datetime`}
                                                type="date"
                                                required
                                            />

                                            <FormInput
                                                label="Assignment Location"
                                                name={`activities.${index}.assignment_location`}
                                                placeholder="Enter Assignment Location"
                                                required
                                            />

                                            <FormSelect
                                                label="Visa Free?"
                                                name={`activities.${index}.visa_free`}
                                                placeholder="Select Visa Free Option"
                                                required
                                                options={visaFreeOptions}
                                            />

                                            <FormInput
                                                label="Airport Taxi Fee"
                                                name={`activities.${index}.airport_taxi_fee`}
                                                placeholder="Enter Airport Taxi"
                                                required
                                            />

                                            <FormInput
                                                label="Registration Fee"
                                                name={`activities.${index}.registration_fee`}
                                                placeholder="Enter Registration"
                                                required
                                            />

                                            <FormInput
                                                label="Taxi fare within /Between cities"
                                                name={`activities.${index}.inter_city_taxi_fee`}
                                                placeholder="Enter Taxi Fare"
                                                required
                                            />

                                            <FormInput
                                                label="Total Amount"
                                                name={`activities.${index}.total_amount`}
                                                placeholder="Enter Total Amount"
                                                required
                                            />

                                            <FormInput
                                                label="Others "
                                                name={`activities.${index}.others`}
                                                placeholder="Others"
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end mt-8">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="bg-[#FFF2F2] text-primary font-semibold hover:bg-[#FFF2F2] hover:text-primary"
                                    onClick={() =>
                                        append({
                                            date: "",
                                            activity: "",
                                            departure_datetime: "",
                                            departure_point: "",
                                            arrival_datetime: "",
                                            assignment_location: "",
                                            visa_free: "",
                                            airport_taxi_fee: "",
                                            registration_fee: "",
                                            inter_city_taxi_fee: "",
                                            total_amount: "",
                                            others: "",
                                        })
                                    }
                                >
                                    <AddSquareIconFaded />
                                    Add Column
                                </Button>
                            </div>

                            <div className="flex items-center justify-end mt-10 gap-2">
                                <Link to={AdminRoutes.INDEX_PAYMENT_REQUEST}>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        size="lg"
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                                <FormButton
                                    loading={isCreateLoading || isModifyLoading}
                                    size="lg"
                                >
                                    Submit
                                </FormButton>
                            </div>
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </div>
    );
}
