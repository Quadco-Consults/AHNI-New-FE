import BackNavigation from "atoms/BackNavigation";
import { Card } from "components/ui/card";
import { useParams } from "react-router-dom";
import DescriptionCard from "components/shared/DescriptionCard";
import { useGetSingleVehicleMaintenanceQuery } from "services/admin/fleet-management/vehicle-maintenance";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { LoadingSpinner } from "components/shared/Loading";
import { Textarea } from "components/ui/textarea";

export default function ViewVehicleMaintenance() {
    const { id } = useParams();

    const { data: vehicleMaintenance, isLoading } =
        useGetSingleVehicleMaintenanceQuery(id ?? skipToken);

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
