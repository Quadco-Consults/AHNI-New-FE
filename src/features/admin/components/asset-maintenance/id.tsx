"use client";

import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "components/atoms/FormButton";
import FormTextArea from "components/atoms/FormTextArea";
import DescriptionCard from "components/DescriptionCard";
import { LoadingSpinner } from "components/Loading";
import { Card, CardContent } from "components/ui/card";
import { format } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useGetSingleAssetMaintenanceQuery } from "@/features/admin/controllers/assetMaintenanceController";

export default function AssetMaintenanceDetailsPage() {
    const { id } = useParams();

    const { data, isLoading } = useGetSingleAssetMaintenanceQuery(
        id || "", !!id
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
                                    label="Asset"
                                    description={data?.data.asset.name}
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
