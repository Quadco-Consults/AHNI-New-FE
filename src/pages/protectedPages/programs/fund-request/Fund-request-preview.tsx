import { useNavigate } from "react-router-dom";
import FundRequstLayout from "./create/Layout";
import DataTable from "components/Table/DataTable";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { RouteEnum } from "constants/RouterConstants";

import { ColumnDef } from "@tanstack/react-table";
import { useGetSingleProjectQuery } from "services/project";
import {
    TFundRequestActivity,
    TFundRequestActivityFormValues,
    TFundRequestFormValues,
} from "definations/program-validator";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetSingleUserQuery } from "services/auth/user";
import { useCreateFundRequestMutation } from "services/programsApi/fund-request";
import { useGetSingleFinancialYearQuery } from "services/modules/config/financial-year";
import { useGetSingleLocationQuery } from "services/modules/config/location";

export default function Summary() {
    const navigate = useNavigate();

    const programFundRequest: TFundRequestFormValues &
        TFundRequestActivityFormValues = JSON.parse(
        localStorage.getItem("programFundRequest") || "{}"
    );

    const { data: project } = useGetSingleProjectQuery(
        programFundRequest.project ?? skipToken
    );

    const { data: financialYear } = useGetSingleFinancialYearQuery(
        programFundRequest.financial_year ?? skipToken
    );

    const { data: location } = useGetSingleLocationQuery(
        programFundRequest.location ?? skipToken
    );

    const { data: reviewer } = useGetSingleUserQuery(
        programFundRequest.reviewer ?? skipToken
    );

    const [createFundRequest, { isLoading: isCreateLoading }] =
        useCreateFundRequestMutation();

    const handleSubmit = async () => {
        try {
            await createFundRequest(programFundRequest).unwrap();
            toast.success("Fund Request Created");
            navigate(RouteEnum.PROGRAM_FUND_REQUEST);
            localStorage.removeItem("programFundRequest");
        } catch (error: any) {
            toast.error(error.data.message || "Something went wring");
        }
    };

    return (
        <FundRequstLayout>
            <div className="space-y-5">
                <div className="space-y-3">
                    <h3 className="font-semibold">Project Name</h3>
                    <p className="text-sm text-gray-500">
                        {/* {programFundRequest?.} */}
                    </p>
                </div>

                <div className="grid pb-5 grid-cols-2 gap-5 md:grid-cols-3">
                    <div className="space-y-3">
                        <h3 className="font-semibold">Project ID</h3>
                        <p className="text-sm text-gray-500">
                            {project?.data.project_id}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Month</h3>
                        <p className="text-sm text-gray-500">
                            {programFundRequest?.month}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Project Start Date</h3>
                        <p className="text-sm text-gray-500">
                            {project?.data.start_date}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Project End Date</h3>
                        <p className="text-sm text-gray-500">
                            {project?.data.end_date}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Currency</h3>
                        <p className="text-sm text-gray-500">
                            {programFundRequest?.currency}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Financial Year</h3>
                        <p className="text-sm text-gray-500">
                            {financialYear?.data.year}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Location</h3>
                        <p className="text-sm text-gray-500">
                            {location?.data.name}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Reviewer</h3>
                        <p className="text-sm text-gray-500">
                            {reviewer?.data.first_name}&nbsp;
                            {reviewer?.data.last_name}
                        </p>
                    </div>
                </div>

                <hr className="pb-5" />

                <h3 className="space-y-3 py-3 font-semibold">Activities</h3>
            </div>

            <DataTable
                data={programFundRequest?.activities || []}
                columns={columns()}
                isLoading={false}
            />

            <div className="flex justify-end gap-5 mt-16">
                <Button
                    type="button"
                    className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
                <FormButton
                    onClick={handleSubmit}
                    type="submit"
                    suffix={<ChevronRight size={14} />}
                    loading={isCreateLoading}
                    disabled={isCreateLoading}
                >
                    Submit Request
                </FormButton>
            </div>
        </FundRequstLayout>
    );
}

const columns = (): ColumnDef<TFundRequestActivity>[] => {
    return [
        {
            header: "S/N",
            accessorFn: (data, index) => `${index}`,
            size: 80,
        },

        {
            header: "Description of Activity",
            id: "description",
            accessorKey: "activity_description",
            size: 200,
            footer: "GRAND TOTAL",
        },

        {
            header: "Amount",
            id: "amount",
            accessorKey: "amount",
            size: 200,
        },

        {
            header: "Unit Cost",
            id: "unit_cost",
            accessorKey: "unit_cost",
            size: 200,
        },
        {
            header: "Frequency",
            id: "frequency",
            accessorKey: "frequency",
            size: 200,
        },
        {
            header: "Cost Category",
            accessorKey: "category",
            size: 200,
        },

        {
            header: "Comments",
            id: "comments",
            accessorKey: "comment",
            size: 200,
        },
    ];
};
