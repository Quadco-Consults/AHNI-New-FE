import logoPng from "assets/imgs/logo.png";
import { skipToken } from "@reduxjs/toolkit/query/react";
import useQuery from "hooks/useQuery";
import { useGetSingleFundRequestQuery } from "services/programsApi/fund-request";
import { useGetSingleProjectQuery } from "services/project";
import Card from "components/shared/Card";
import FundActivityTable from "./FundActivityTable";
import { LoadingSpinner } from "components/shared/Loading";

export default function ViewFundRequestActivity() {
    const query = useQuery();

    const id = query.get("fundRequestId");

    const { data: fundRequest, isLoading } = useGetSingleFundRequestQuery(
        id ?? skipToken
    );

    const { data: project } = useGetSingleProjectQuery(
        fundRequest?.data.project.id ?? skipToken
    );

    return (
        <Card className="py-16">
            <div className="flex flex-col items-center">
                <img src={logoPng} alt="logo" width={150} />
                <h4 className="mt-5 text-lg font-bold">
                    Achieving Health Nigeria Initiative (AHNI)
                </h4>

                <h4 className="text-red-500 font-bold mt-2">
                    FUND REQUEST DETAILS - ACEBAY PHO
                </h4>
            </div>

            <div className="border-[#DEA004] border-solid border-[2px] rounded-lg p-5 grid grid-cols-3 gap-8 mt-10">
                <div className="space-y-3">
                    <h3 className="font-semibold">Location:</h3>

                    <p className="text-sm font-semibold text-[#DEA004]">
                        {fundRequest?.data.location.name}
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">ID Code/Project Code:</h3>

                    <p className="text-sm text-gray-500">
                        {project?.data.project_id}
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">Unique Identifier Code</h3>

                    <p className="text-sm text-gray-500">
                        {fundRequest?.data.uuid_code}
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">Award/Project Title:</h3>

                    <p className="text-sm font-semibold text-[#DEA004]">
                        {project?.data.title}
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">Award/Project ID</h3>

                    <p className="text-sm text-gray-500">
                        {project?.data.project_id}
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">Currency</h3>

                    <p className="text-sm text-gray-500">
                        {fundRequest?.data.currency}
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">Month</h3>

                    <p className="text-sm text-gray-500">
                        {fundRequest?.data.month}
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
            </div>

            <h2 className="text-gray-700 font-bold text-center my-8 text-lg">
                Fund Request Details
            </h2>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                fundRequest && (
                    <FundActivityTable
                        data={fundRequest.data.activities}
                        availableBalance={fundRequest.data.available_balance}
                        currency={fundRequest.data.currency}
                    />
                )
            )}
        </Card>
    );
}
