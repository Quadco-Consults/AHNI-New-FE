import { skipToken } from "@reduxjs/toolkit/query/react";
import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import GoBack from "components/shared/GoBack";
import { LoadingSpinner } from "components/shared/Loading";
import { Button } from "components/ui/button";
import { CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { FileDown } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetSingleGoodReceiveNoteQuery } from "services/admin/inventory-management/good-receive-note";

export default function GoodReceiveNoteDetails() {
    const { id } = useParams();

    const { data, isLoading } = useGetSingleGoodReceiveNoteQuery(
        id ?? skipToken
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <GoBack />

                <Button variant="custom">
                    <span>
                        <FileDown size={18} />
                    </span>
                    Download
                </Button>
            </div>

            <Card>
                <CardHeader className="font-bold">
                    Good Receive Note Details
                    <Separator className="mt-4" />
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        data && (
                            <div className="grid grid-cols-1 p-10 gap-8 md:grid-cols-3">
                                <DescriptionCard
                                    label="Vendor"
                                    description={
                                        data.data.purchase_order.vendor_name
                                    }
                                />

                                <DescriptionCard
                                    label="Supplier Address"
                                    description="N/A"
                                />

                                <DescriptionCard
                                    label="PO Number"
                                    description={
                                        data?.data.purchase_order
                                            .purchase_order_number
                                    }
                                />

                                <DescriptionCard
                                    label="Description"
                                    description="N/A"
                                />

                                <DescriptionCard
                                    label="Quantity Ordered"
                                    description="N/A"
                                />

                                <DescriptionCard
                                    label="Quantity Received"
                                    description="N/A"
                                />

                                <DescriptionCard
                                    label="Invoice Number"
                                    description={data.data.invoice_number}
                                />

                                <DescriptionCard
                                    label="Waybill Number"
                                    description={data.data.waybill_number}
                                />

                                <DescriptionCard
                                    label="Procurement Officer"
                                    description="N/A"
                                />

                                <DescriptionCard
                                    label="Requestor"
                                    description={
                                        data.data.purchase_order.request_dept
                                    }
                                />

                                <DescriptionCard
                                    label="Inventory Officer"
                                    description="N/A"
                                />

                                <DescriptionCard
                                    label="Goods Received by Store"
                                    description="N/A"
                                />

                                <DescriptionCard
                                    label="Receiving Location"
                                    description={
                                        data.data.purchase_order.ship_to_address
                                    }
                                />

                                <DescriptionCard
                                    label="Remark"
                                    description={data.data.remark}
                                />
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
