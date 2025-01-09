import { skipToken } from "@reduxjs/toolkit/query/react";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormTextArea from "atoms/FormTextArea";
import DescriptionCard from "components/shared/DescriptionCard";
import { LoadingSpinner } from "components/shared/Loading";
import { Card, CardContent } from "components/ui/card";
import { format } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useGetSingleAssetMaintenanceQuery } from "services/admin/asset-maintenance";

export default function AssetMaintenanceDetailsPage() {
    const { id } = useParams();

    const { data, isLoading } = useGetSingleAssetMaintenanceQuery(
        id ?? skipToken
    );

    const form = useForm();

    return (
        <div>
            <BackNavigation extraText="Asset Maintenance Ticket Details" />

            <Card>
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    data && (
                        <CardContent className="mt-10">
                            <div className="grid grid-cols-3 gap-5">
                                <DescriptionCard
                                    label="Name of Staff"
                                    description={data?.data.staff_name}
                                    // description={`${data?.data.staff_name.first_name} ${data?.data.staff_name.last_name}`}
                                />

                                <DescriptionCard
                                    label="Department"
                                    description={data?.data.department.name}
                                />

                                <DescriptionCard
                                    label="Location"
                                    description={data?.data.location.name}
                                />

                                <DescriptionCard
                                    label="Date"
                                    description={format(
                                        data?.data.created_datetime,
                                        "dd-MMM-yyyy"
                                    )}
                                />

                                <DescriptionCard
                                    label="Facility"
                                    description={data?.data.facility.name}
                                />

                                <DescriptionCard
                                    label="Maintenance Type"
                                    description={data?.data.maintenance_type}
                                />

                                <DescriptionCard
                                    label="Rate"
                                    description={data?.data.rate}
                                />

                                <DescriptionCard
                                    label="Cost Estimate"
                                    description={data?.data.cost_estimate}
                                />

                                <DescriptionCard
                                    label="Total Cost Estimate"
                                    description={data?.data.total_cost_estimate}
                                />

                                <DescriptionCard
                                    label="Description Type"
                                    description={data?.data.description_type}
                                />

                                <DescriptionCard
                                    label="Justification for Disposal"
                                    description={
                                        data?.data.disposal_justification
                                    }
                                />

                                <DescriptionCard
                                    label="Description of Problem"
                                    description={data?.data.description}
                                />
                            </div>

                            <FormProvider {...form}>
                                <form className="space-y-6 mt-5">
                                    <FormTextArea
                                        label="Comment"
                                        name="comment"
                                        placeholder="Enter Comment"
                                    />

                                    <FormButton
                                        size="lg"
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
