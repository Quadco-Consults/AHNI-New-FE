import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import Card from "components/shared/Card";
import {
    FundRequestData,
    FundRequestResultsData,
    Line_Items,
} from "definations/program-types/fund-request";
import { Dialog, DialogContent, DialogTrigger } from "components/ui/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "components/ui/accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "components/ui/table";

const FundSummary = (data: FundRequestData) => {
    return (
        <Card>
            <DataTable
                data={data?.results || []}
                columns={columns}
                isLoading={false}
            />

            <div className="flex justify-end my-10">
                <h4 className="font-semibold">
                    General Comment/Recommendation
                </h4>
            </div>
        </Card>
    );
};

export default FundSummary;

const columns: ColumnDef<FundRequestResultsData>[] = [
    {
        header: "S/N",
        id: "id",
        size: 80,
        cell: ({ row, table }: any) =>
            (table
                .getSortedRowModel()
                ?.flatRows?.findIndex(
                    (flatRow: any) => flatRow.id === row.id
                ) || 0) + 1,
    },
    {
        header: "Description of Activity",
        id: "description",
        accessorFn: (data) =>
            `${data.line_items?.map(
                (lineItem: Line_Items) => lineItem.description
            )}`,
        size: 350,
        footer: "GRAND TOTAL",
    },
    {
        header: "Fund Request for this period",
        id: "amount",
        accessorFn: (data) =>
            `₦${data.line_items?.map(
                (lineItem: Line_Items) => lineItem.amount
            )}`,
        size: 300,
        footer: (info: any) => info.column.id,
    },
    {
        header: "Unique Identifier Code	",
        accessorKey: "unique_identifier_code",
        size: 250,
        id: "1111.0004-01",
        footer: (info: any) => info.column.id,
    },
    {
        header: "",
        id: "actions",
        cell: ({ row }: any) => <ActionListAction data={row.original} />,
    },
];

const ActionListAction = ({ data }: any) => {
    return (
        <Dialog>
            <DialogTrigger>
                <div className="rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-primary dark:text-black dark:hover:text-primary">
                    View
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[650px]">
                <div className="space-y-5 p-10">
                    <div className="space-y-3">
                        <h4 className="font-semibold text-yellow-600">
                            AHNI Adamawa H/O
                        </h4>
                        <h3 className="font-semibold">Project Name</h3>
                        <p className="text-sm text-gray-500">
                            {/* {data.unique_identifier_code} */}
                        </p>
                    </div>

                    <div className="grid pb-5 grid-cols-2 gap-5 md:grid-cols-3">
                        <div className="space-y-3">
                            <h3 className="font-semibold">Project ID</h3>
                            <p className="text-sm text-gray-500">
                                {data.project_id}
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold">State</h3>
                            <p className="text-sm text-gray-500">
                                AHNI Adamawa H/O
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold">Month</h3>
                            <p className="text-sm text-gray-500">
                                {data.month_year}
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold">
                                Project Start Date
                            </h3>
                            <p className="text-sm text-gray-500">10/04/2023</p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold">Project End Date</h3>
                            <p className="text-sm text-gray-500">10/04/2023</p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold">Currency</h3>
                            <p className="text-sm text-gray-500">
                                {data.currency}
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold">Financial Year</h3>
                            <p className="text-sm text-gray-500">
                                {data.financial_year}
                            </p>
                        </div>
                    </div>

                    <hr />

                    <div className="space-y-3">
                        <h4 className="font-semibold text-yellow-600">
                            Detailed Breakdown
                        </h4>

                        <div className="overflow-auto">
                            <Table className="border rounded-xl w-full overflow-auto">
                                <TableHeader className="bg-gray-200">
                                    <TableRow>
                                        <TableHead className="w-[300px]">
                                            Description of Activity
                                        </TableHead>
                                        <TableHead className="w-[300px]">
                                            Unit Cost
                                        </TableHead>
                                        <TableHead className="w-[300px]">
                                            Frequency
                                        </TableHead>
                                        <TableHead className="w-[300px]">
                                            Amount
                                        </TableHead>
                                        <TableHead className="w-[300px]">
                                            Comment
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.line_items?.map(
                                        (item: Line_Items) => (
                                            <TableRow
                                                key={item.id}
                                                className=""
                                            >
                                                <TableCell>
                                                    {item.description}
                                                </TableCell>
                                                {/* <TableCell>{}</TableCell> */}
                                                <TableCell>
                                                    {item.unit_cost}
                                                </TableCell>
                                                <TableCell>
                                                    {item.frequency}
                                                </TableCell>
                                                <TableCell>
                                                    {item.amount}
                                                </TableCell>
                                                <TableCell>
                                                    {item.comments}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
