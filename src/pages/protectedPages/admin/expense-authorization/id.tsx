import { skipToken } from "@reduxjs/toolkit/query/react";
import FormButton from "atoms/FormButton";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import GoBack from "components/shared/GoBack";
import { LoadingSpinner } from "components/shared/Loading";
import { CardContent, CardHeader } from "components/ui/card";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useGetSingleExpenseAuthorizationQuery } from "services/admin/expense-authorization";

export default function ExpenseAuthorizationDetailsPage() {
    const { id } = useParams();

    const { data, isLoading } = useGetSingleExpenseAuthorizationQuery(
        id ?? skipToken
    );

    const form = useForm();

    const onSubmit = async () => {};

    return (
        <div className="space-y-4">
            <GoBack />

            <Card>
                <CardHeader className="font-bold text-lg">
                    Expense Authorization Details
                </CardHeader>

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    data && (
                        <CardContent className="space-y-10">
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                <DescriptionCard
                                    label="Project Name"
                                    description={data?.data.project.title}
                                />

                                <DescriptionCard
                                    label="Project Number"
                                    description="N/A"
                                />

                                <DescriptionCard
                                    label="Full Name"
                                    description={`${data?.data.created_by.first_name} ${data?.data.created_by.last_name}`}
                                />
                                <DescriptionCard
                                    label="Email"
                                    description={data?.data.created_by.email}
                                />

                                <DescriptionCard
                                    label="Phone Number"
                                    description={
                                        data?.data.created_by.mobile_number
                                    }
                                />

                                <DescriptionCard
                                    label="Address"
                                    description={data?.data.address}
                                />

                                <DescriptionCard
                                    label="TA Number"
                                    description={data?.data.ta_number}
                                />

                                <DescriptionCard
                                    label="Department"
                                    description={data?.data.department.name}
                                />

                                <DescriptionCard
                                    label="City"
                                    description={data?.data.city}
                                />

                                <DescriptionCard
                                    label="FCO"
                                    description={data?.data.fco.name}
                                />

                                <DescriptionCard
                                    label="Arrival Date"
                                    description={data?.data.arrival_date}
                                />

                                <DescriptionCard
                                    label="Departure Date"
                                    description={data?.data.departure_date}
                                />

                                <DescriptionCard
                                    label="Destination"
                                    description={data?.data.destination}
                                />
                            </div>

                            <div className="space-y-5">
                                <h3 className="text-lg font-bold">
                                    Special Requests
                                </h3>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                    <DescriptionCard
                                        label="Travel advances are based on current State Department per diem rates which are updated on a monthly basis or approved local rates for the projects"
                                        description={
                                            data?.data
                                                .is_travel_advances_dependent
                                                ? "Yes"
                                                : "No"
                                        }
                                    />

                                    <DescriptionCard
                                        label="Documents needed more than 3 days prior to departure?"
                                        description={
                                            data?.data.is_document_needed
                                                ? "Yes"
                                                : "No"
                                        }
                                    />

                                    <DescriptionCard
                                        label="Car Rental?"
                                        description={
                                            data?.data.is_car_rental_allowed
                                                ? "Yes"
                                                : "No"
                                        }
                                    />

                                    <DescriptionCard
                                        label="Hotel Reservations?"
                                        description={
                                            data?.data
                                                .is_hotel_reservation_required
                                                ? "Yes"
                                                : "No"
                                        }
                                    />

                                    <DescriptionCard
                                        label="Hotel transfer/taxi/other transportation needed (International travel only)"
                                        description={
                                            data?.data
                                                .is_hotel_transport_required
                                                ? "Yes"
                                                : "No"
                                        }
                                    />

                                    <DescriptionCard
                                        label="Is Managing Director Notified?"
                                        description={
                                            data?.data
                                                .is_managing_director_notified
                                                ? "Yes"
                                                : "No"
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <h3 className="text-lg font-bold">
                                    Travel Office Use
                                </h3>

                                <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                                    <DescriptionCard
                                        label="Lodging"
                                        description="N/A"
                                    />

                                    <DescriptionCard
                                        label="Meals"
                                        description="N/A"
                                    />

                                    <DescriptionCard
                                        label="Number of Nights"
                                        description="N/A"
                                    />

                                    <DescriptionCard
                                        label="Interstate"
                                        description="N/A"
                                    />

                                    <DescriptionCard
                                        label="Airport Taxi"
                                        description="N/A"
                                    />

                                    <DescriptionCard
                                        label="Car Hire"
                                        description="N/A"
                                    />
                                </div>
                            </div>

                            <Form {...form}>
                                <form
                                    className="space-y-3"
                                    onSubmit={form.handleSubmit(onSubmit)}
                                >
                                    <FormTextArea
                                        label="Comment"
                                        name="comment"
                                        placeholder="Enter Comment"
                                        required
                                    />

                                    <FormButton
                                        type="submit"
                                        className="bg-green-500"
                                        size="lg"
                                    >
                                        Approve
                                    </FormButton>
                                </form>
                            </Form>
                        </CardContent>
                    )
                )}
            </Card>
        </div>
    );
}
