import { ColumnDef } from "@tanstack/react-table";
import Card from "components/shared/Card";
import DataTable from "components/Table/DataTable";
import { useLocation } from "react-router-dom";
import ProcurementTrackerAPI from "services/procurementApi/procurement-tracker";

const SummaryCard = () => {
    const { data } = ProcurementTrackerAPI.useGetProcurementTrackersQuery({});

    const { pathname } = useLocation();

    const isAdminTracker = pathname.includes("admin-tracker");

    const columns: ColumnDef<any>[] = [
        {
            header: "Donor Name",
            accessorKey: "donor_name",
            size: 150,
        },
        {
            header: "Project",
            accessorKey: "project",
            size: 150,
        },

        {
            header: "Programme Requesting",
            accessorKey: "programme_requesting",
            size: 150,
        },

        {
            header: "Office Requesting",
            accessorKey: "office_requesting",
            size: 200,
            cell: ({ row }) => {
                return <div>{row.original?.deparment}</div>;
            },
        },

        {
            header: `${
                isAdminTracker
                    ? "Admin Officer Responsible"
                    : "Procurement Officer Responsible"
            }`,
            accessorKey: "procurement_officer_responsible",
            size: 195,
        },

        {
            header: "PR No.",
            accessorKey: "pr_no. ",
            size: 150,
            cell: ({ row }) => {
                return <div>{row.original?.pr_reference}</div>;
            },
        },

        {
            header: "Date PR Received",
            accessorKey: "date_pr_received",
            size: 200,
            cell: ({ row }) => {
                return <div>{row.original?.request_date}</div>;
            },
        },

        {
            header: "Item Category (drop down)",
            accessorKey: "item_category",
            size: 150,
        },

        {
            header: "Date Goods are Required",
            accessorKey: "date-goods-are-required",
            size: 150,
        },

        {
            header: "Date Procurement Process Initiated",
            accessorKey: "date-procurement-process-initiated",
            size: 160,
        },

        {
            header: "FCO",
            accessorKey: "f-c-o",
            size: 150,
            cell: ({ row }) => {
                return (
                    <div>{row.original?.purchse_order?.fco_number || "-"}</div>
                );
            },
        },
        {
            header: "Description of goods/ services",
            accessorKey: "description-of-goods-services",
            size: 350,
            cell: ({ row }) => {
                return <div>{row.original?.item_name}</div>;
            },
        },
        {
            header: "Unit",
            accessorKey: "unit",
            size: 150,
        },
        {
            header: "Quantity",
            accessorKey: "quantity",
            size: 150,

            cell: ({ row }) => {
                return (
                    <div>
                        {" "}
                        {Number(row.original?.quantity || 0).toLocaleString()}
                    </div>
                );
            },
        },
    ];

    return (
        <Card className="space-y-5">
            <DataTable data={data?.data?.results || []} columns={columns} />
        </Card>
    );
};

export default SummaryCard;
