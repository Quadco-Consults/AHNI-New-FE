"use client";

import BackNavigation from "components/atoms/BackNavigation";
import { Card } from "components/ui/card";
import { useParams } from "next/navigation";
import DescriptionCard from "components/DescriptionCard";
import { useGetSingleVehicleMaintenanceQuery } from "@/features/admin/controllers/vehicleMaintenanceController";
import { LoadingSpinner } from "components/Loading";
import { Textarea } from "components/ui/textarea";

export default function ViewVehicleMaintenance() {
    const { id } = useParams();

    const { data: vehicleMaintenance, isLoading } =
        useGetSingleVehicleMaintenanceQuery(id || "", !!id);

    return (
        <div className="space-y-4">
            <BackNavigation extraText="View Vehicle Maintenance Ticket" />
            <Card className="p-6 mx-auto space-y-5 ">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    vehicleMaintenance && (
                        <>
                            <div className="grid grid-cols-3 gap-5 mb-6">
                                <DescriptionCard
                                    label="Asset"
                                    description={
                                        vehicleMaintenance?.data.asset.name
                                    }
                                />

                                <DescriptionCard
                                    label="Maintenance Type"
                                    description={
                                        vehicleMaintenance?.data
                                            .maintenance_type
                                    }
                                />

                                <DescriptionCard
                                    label="FCO Number"
                                    description={
                                        vehicleMaintenance?.data.fco.name
                                    }
                                />

                                <DescriptionCard
                                    label="Cost Estimate"
                                    description={`$${vehicleMaintenance?.data.cost_estimate}`}
                                />

                                <DescriptionCard
                                    label="Reviewer"
                                    description="N/A"
                                />

                                <DescriptionCard
                                    label="Authorizer"
                                    description="N/A"
                                />

                                <DescriptionCard
                                    label="Approver"
                                    description="N/A"
                                />
                            </div>

                            <DescriptionCard
                                label="Description"
                                description={
                                    vehicleMaintenance?.data.description
                                }
                            />
                        </>
                    )
                )}
            </Card>
        </div>
    );
}
