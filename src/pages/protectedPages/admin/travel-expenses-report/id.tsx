import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import { LoadingSpinner } from "components/shared/Loading";
import { CardContent, CardHeader } from "components/ui/card";
import { format } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useGetSingleTravelExpenseQuery } from "services/admin/travel-expense";

export default function TravelExpenseDetailsPage() {
    const { id } = useParams();

    const { data, isLoading } = useGetSingleTravelExpenseQuery(id ?? skipToken);

    const form = useForm();

    return (
        <div>
            <BackNavigation />

            <Card>
                <CardHeader className="font-bold">
                    Travel Expense Report Details
                </CardHeader>

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    data && (
                        <CardContent className="space-y-10">
                            <div className="grid grid-cols-3 gap-10">
                                <DescriptionCard
                                    label="User"
                                    description={`${data.data.user.first_name} ${data.data.user.last_name}`}
                                />

                                <DescriptionCard
                                    label="Staff ID No"
                                    description={data.data.staff_id}
                                />

                                <DescriptionCard
                                    label="Purpose of Travel"
                                    description={data.data.travel_purpose}
                                />
                            </div>

                            {data?.data.activities.map(
                                (
                                    {
                                        date,
                                        activity,
                                        departure_datetime,
                                        departure_point,
                                        arrival_datetime,
                                        assignment_location,
                                        visa_free,
                                        airport_taxi_fee,
                                        registration_fee,
                                        inter_city_taxi_fee,
                                        total_amount,
                                        others,
                                    },
                                    index
                                ) => (
                                    <div className="space-y-5">
                                        <h3 className="font-bold text-xl">
                                            Day {index + 1}
                                        </h3>

                                        <div className="grid grid-cols-3 gap-10">
                                            <DescriptionCard
                                                label="Date"
                                                description={date}
                                            />

                                            <DescriptionCard
                                                label="Activity"
                                                description={activity}
                                            />

                                            <DescriptionCard
                                                label="Departure Date"
                                                description={format(
                                                    departure_datetime,
                                                    "dd-MMM-yyyy"
                                                )}
                                            />

                                            <DescriptionCard
                                                label="Point of Departure"
                                                description={departure_point}
                                            />

                                            <DescriptionCard
                                                label="Arrival Date"
                                                description={format(
                                                    arrival_datetime,
                                                    "dd-MMM-yyyy"
                                                )}
                                            />

                                            <DescriptionCard
                                                label="Assignment Location"
                                                description={
                                                    assignment_location
                                                }
                                            />

                                            <DescriptionCard
                                                label="Visa Free"
                                                description={`${
                                                    visa_free ? "YES" : "NO"
                                                }`}
                                            />

                                            <DescriptionCard
                                                label="Airport Taxi Fee"
                                                description={`$${airport_taxi_fee}`}
                                            />

                                            <DescriptionCard
                                                label="Registration Fee"
                                                description={`$${registration_fee}`}
                                            />

                                            <DescriptionCard
                                                label="Taxi fare within /Between cities"
                                                description={`$${inter_city_taxi_fee}`}
                                            />

                                            <DescriptionCard
                                                label="Total Amount"
                                                description={`$${total_amount}`}
                                            />

                                            <DescriptionCard
                                                label="Others"
                                                description={others}
                                            />

                                            <DescriptionCard
                                                label="Total Cost"
                                                description={`$${
                                                    Number(airport_taxi_fee) +
                                                    Number(registration_fee) +
                                                    Number(
                                                        inter_city_taxi_fee
                                                    ) +
                                                    Number(total_amount)
                                                }`}
                                            />
                                        </div>
                                    </div>
                                )
                            )}

                            <FormProvider {...form}>
                                <form className="space-y-5">
                                    <FormTextArea
                                        label="Comment"
                                        name="comment"
                                        placeholder="Enter Comment"
                                        required
                                    />

                                    <FormButton
                                        size="lg"
                                        type="submit"
                                        className="bg-green-500"
                                    >
                                        Approve
                                    </FormButton>
                                </form>
                            </FormProvider>
                        </CardContent>
                    )
                )}
            </Card>
        </div>
    );
}

/* 

  <table className="table-auto border-collapse w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-2">Travel Activities</th>
                                <th className="px-4 py-2">Day 1</th>
                                <th className="px-4 py-2">Day 2</th>
                                <th className="px-4 py-2">Day 3</th>
                                <th className="px-4 py-2">Day 4</th>
                                <th className="px-4 py-2">Cost Claimed</th>
                                <th className="px-4 py-2">Cost Allowed</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="border-b">
                                <td className="px-4 py-2">
                                    Point of Departure
                                </td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">Time of Departure</td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">
                                    Point of Departure
                                </td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">Time of Arrival</td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">
                                    Assignment Location
                                </td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">Balance b/f</td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">Mileage (#30KM)</td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">Airport Taxi</td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">Visa Free</td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">
                                    Hotel Accomodation
                                </td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">
                                    Per Diem (less provided meals)DSA
                                    </td>
                                    </tr>
        
                                    <tr className="border-b">
                                        <td className="px-4 py-2">Registration</td>
                                    </tr>
        
                                    <tr className="border-b">
                                        <td className="px-4 py-2">Communication</td>
                                    </tr>
        
                                    <tr className="border-b">
                                        <td className="px-4 py-2">
                                            Taxi Between Cities
                                        </td>
                                    </tr>
        
                                    <tr className="border-b">
                                        <td className="px-4 py-2">
                                            Taxi Within Cities
                                        </td>
                                    </tr>
        
                                    <tr className="border-b">
                                        <td className="px-4 py-2">
                                            Other (Group Launch)
                                        </td>
                                    </tr>
        
                                    <tr className="border-b"></tr>
        
                                    <tr className="border-b">
                                        <td className="px-4 py-2">TOTAL COST</td>
                                    </tr>
                                </tbody>
                            </table>

*/
