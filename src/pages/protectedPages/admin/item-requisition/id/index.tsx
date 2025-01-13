import { skipToken } from "@reduxjs/toolkit/query/react";
import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import GoBack from "components/shared/GoBack";
import { LoadingSpinner } from "components/shared/Loading";
import { Separator } from "components/ui/separator";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { useGetSingleItemRequisitionQuery } from "services/admin/inventory-management/item-requisition";

export default function ItemRequisitionDetailPage() {
    const { id } = useParams();

    const { data: itemRequisition, isLoading } =
        useGetSingleItemRequisitionQuery(id ?? skipToken);

    const requestorName = `${itemRequisition?.data.created_by.first_name} ${itemRequisition?.data.created_by.last_name}`;

    const itemsRequested = itemRequisition?.data.consummables
        .map((con) => con.consummable.name)
        .join(", ");

    const quantityRequested = itemRequisition?.data.consummables
        .map((item) => item.quantity)
        .reduce((accumulator, value) => {
            return accumulator + value;
        }, 0);

    return (
        <div className="space-y-6">
            <GoBack />
            <Card className="space-y-6">
                <h4 className="font-semibold text-lg">
                    Item Requisition Detail
                </h4>
                <Separator />

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    itemRequisition?.data && (
                        <div className="grid grid-cols-2 gap-8 mt-6">
                            <DescriptionCard
                                label="Requestor Name"
                                description={requestorName}
                            />

                            <DescriptionCard
                                label="Department/Unit"
                                description={
                                    itemRequisition?.data.department.name
                                }
                            />

                            <DescriptionCard
                                label="Date Requested"
                                description={format(
                                    itemRequisition?.data.created_datetime,
                                    "yyyy-dd-MM"
                                )}
                            />

                            <DescriptionCard
                                label="Date Treated"
                                description={format(
                                    itemRequisition?.data.treatment_datetime ??
                                        new Date(),
                                    "yyyy-dd-MM"
                                )}
                            />

                            <DescriptionCard
                                label="Item Requested"
                                description={itemsRequested}
                            />
                            <DescriptionCard
                                label="Quantity Requested"
                                description={quantityRequested}
                            />
                            <DescriptionCard
                                label="Status"
                                description={itemRequisition?.data.status}
                            />

                            <DescriptionCard
                                label="Approved by"
                                description="N/A"
                            />
                        </div>
                    )
                )}
            </Card>
        </div>
    );
}
