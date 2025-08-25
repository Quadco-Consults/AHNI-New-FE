import { ColumnDef } from "@tanstack/react-table";
import Card from "components/Card";
import GoBack from "components/GoBack";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { FileDown } from "lucide-react";

const FuelTableDetail = () => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <GoBack />
                <Button variant="custom">
                    <span>
                        <FileDown size={18} />
                    </span>
                    Download
                </Button>
            </div>
            <Card className="space-y-6">
                <h4 className="font-semibold text-lg">
                    AHNi HQ for Fuel Consumption Tracker for Project Vehicles in
                    Abuja
                </h4>
                <p>Vendor: EMADEB ENERGY SERVICES LIMITED. </p>
                <DataTable columns={columns} data={[]} />
            </Card>
        </div>
    );
};

export default FuelTableDetail;

type TFuelConsumption = {
    name: string;
};

const columns: ColumnDef<TFuelConsumption>[] = [
    {
        header: "Date",
        accessorKey: "name",
    },
    {
        header: "Vehicle Number",
        accessorKey: "item",
    },
    {
        header: "Name of Driver",
        accessorKey: "approval",
    },
    {
        header: "Coupon No",
        accessorKey: "approval",
        size: 250,
    },
    {
        header: "Last Odometer (KM) Reading",
        accessorKey: "approvals",
        size: 250,
    },
    {
        header: "Litre Qty",
        accessorKey: "quantity",
        size: 200,
    },
    {
        header: "Amount per litre",
        accessorKey: "department",
    },
    {
        header: "Total Amount",
        accessorKey: "status",
    },
];
