import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { generatePath, Link, useNavigate, useParams } from "react-router-dom";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import Summary from "./Summary";
import { Button } from "components/ui/button";
import FundSummary from "./Fund-summary";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { LoadingSpinner } from "components/shared/Loading";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetSingleProjectQuery } from "services/project";
import { RouteEnum } from "constants/RouterConstants";

const FundRequestDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: project, isLoading } = useGetSingleProjectQuery(
        id ?? skipToken
    );

    const dispatch = useAppDispatch();

    const goBack = () => {
        navigate(-1);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6 relative min-h-screen">
            <button
                onClick={goBack}
                className="w-[3rem] absolute top-0 left-0 aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
            >
                <LongArrowLeft />
            </button>

            <Tabs defaultValue="summary" className="space-y-10">
                <div className="relative flex justify-between gap-5 ml-16">
                    <TabsList>
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="fund Request Summary">
                            Fund Request Summary
                        </TabsTrigger>
                        <TabsTrigger value="approval Status">
                            Approval Status
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <Link
                            to={{
                                pathname: generatePath(
                                    RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ALL_FUND_REQUESTS,
                                    { id }
                                ),
                            }}
                        >
                            <Button
                                variant="ghost"
                                className="bg-[#FFF2F2] text-primary hover:bg-[#FFF2F2] hover:text-primary"
                            >
                                Preview
                            </Button>
                        </Link>
                        <Button
                            onClick={() => {
                                dispatch(
                                    openDialog({
                                        type: DialogType.SspApproveModal,
                                        dialogProps: {
                                            header: "Request Approval",
                                            width: "max-w-2xl",
                                        },
                                    })
                                );
                            }}
                        >
                            Approval
                        </Button>
                    </div>
                </div>
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    project?.data && (
                        <>
                            <TabsContent value="summary">
                                <Card>
                                    <Summary data={project.data} />
                                </Card>
                            </TabsContent>
                            <TabsContent value="fund Request Summary">
                                <FundSummary />
                            </TabsContent>
                            <TabsContent value="approval Status">
                                {/* <ApprovalStatus /> */}
                            </TabsContent>
                        </>
                    )
                )}
            </Tabs>
        </div>
    );
};

export default FundRequestDetail;
