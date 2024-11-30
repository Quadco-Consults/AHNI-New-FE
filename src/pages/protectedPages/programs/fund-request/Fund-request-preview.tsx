import { useNavigate } from "react-router-dom";
import { Line_Items } from "definations/program-types/fund-request";
import FundRequstLayout from "./FundRequstLayout";
import DataTable from "components/Table/DataTable";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { RouteEnum } from "constants/RouterConstants";
import FundRequestAPI from "services/programsApi/fund-request";

import { ColumnDef } from "@tanstack/react-table";
import { useGetProjectsQuery } from "services/projectsApi/projectsApi";

const columns: ColumnDef<Line_Items>[] = [
    {
        header: "S/N",
        id: "description",
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
        accessorFn: (data) => {
            console.log(data.description);
            return data.description;
        },
        size: 350,
        footer: "GRAND TOTAL",
    },
    {
        header: "Amount",
        id: "amount",
        accessorFn: (data) => data.amount,
        size: 350,
        footer: "GRAND TOTAL",
    },
    {
        header: "Unit Cost",
        id: "unit_cost",
        accessorFn: (data) => data.unit_cost,
        size: 350,
        footer: "GRAND TOTAL",
    },
    {
        header: "Frequency",
        id: "frequency",
        accessorFn: (data) => data.unit_cost,
        size: 350,
        footer: "GRAND TOTAL",
    },
    {
        header: "Category",
        //id: "comments",
        accessorFn: () => "Travel: domestic",
        size: 350,
        footer: "GRAND TOTAL",
    },
    {
        header: "Comments",
        id: "comments",
        accessorFn: (data) => data.comments,
        size: 350,
        footer: "GRAND TOTAL",
    },
];

const Summary = () => {
    const [createFundRequestMutation, { isLoading }] =
        FundRequestAPI.useCreateFundRequestMutation();
    const navigate = useNavigate();
    const projectFundRequest = JSON.parse(
        localStorage.getItem("projectFundRequest") as any
    );
    const projectQueryResult = useGetProjectsQuery({
        path: { id: projectFundRequest.project as string },
    });

    const handleSubmit = async () => {
        try {
            await createFundRequestMutation(projectFundRequest).unwrap();
            toast.success("Successfully created");
            sessionStorage.removeItem("fundRequestCompletedSteps");
            localStorage.removeItem("projectFundRequest");
            navigate(RouteEnum.PROGRAM_FUND_REQUEST);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };
    return (
        <FundRequstLayout>
            <div className="space-y-5">
                <div className="space-y-3">
                    <h3 className="font-semibold">Project Name</h3>
                    <p className="text-sm text-gray-500">
                        {/* {projectQueryResult.data?.title} */}
                    </p>
                </div>

                <div className="grid pb-5 grid-cols-2 gap-5 md:grid-cols-3">
                    <div className="space-y-3">
                        <h3 className="font-semibold">Project ID</h3>
                        <p className="text-sm text-gray-500">
                            {projectFundRequest?.type}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Month</h3>
                        <p className="text-sm text-gray-500">
                            {projectFundRequest?.month_year}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Project Start Date</h3>
                        <p className="text-sm text-gray-500">
                            {/* {projectQueryResult.data?.start_date} */}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Project End Date</h3>
                        <p className="text-sm text-gray-500">
                            {/* {projectQueryResult.data?.end_date} */}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Currency</h3>
                        <p className="text-sm text-gray-500">
                            {projectFundRequest?.currency}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Financial Year</h3>
                        <p className="text-sm text-gray-500">
                            {projectFundRequest?.financial_year}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Location</h3>
                        <p className="text-sm text-gray-500">
                            Kano State Office
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Reviewer</h3>
                        <p className="text-sm text-gray-500">Musa Abdullahi</p>
                    </div>
                </div>

                <hr className="pb-5" />

                <h3 className="space-y-3 py-3 font-semibold">Activities</h3>
            </div>

            <DataTable
                data={projectFundRequest?.line_items || []}
                columns={columns}
                isLoading={false}
            />

            <div className="flex justify-end gap-5 mt-16">
                <Button
                    type="button"
                    className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                >
                    Cancel
                </Button>
                <FormButton
                    onClick={handleSubmit}
                    type="submit"
                    suffix={<ChevronRight size={14} />}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Submit Request
                </FormButton>
            </div>
        </FundRequstLayout>
    );
};

export default Summary;
