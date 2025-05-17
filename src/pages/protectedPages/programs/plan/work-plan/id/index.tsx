import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import Summary from "./Summary";
import Activity from "./activity";
import { useGetSingleWorkPlanQuery } from "services/programsApi/work-plan";
import { skipToken } from "@reduxjs/toolkit/query/react";
import BreadcrumbCard, { TBreadcrumbList } from "components/shared/Breadcrumb";
import { LoadingSpinner } from "components/shared/Loading";

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Work Plan", icon: true },
    { name: "Details", icon: false },
];

const WorkPlanDetail = () => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useGetSingleWorkPlanQuery(id ?? skipToken);

    const goBack = () => {
        navigate(-1);
    };

    console.log(data);

    return (
        <div className="space-y-6 relative min-h-screen">
            <BreadcrumbCard list={breadcrumbs} />

            <button
                onClick={goBack}
                className="w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
            >
                <LongArrowLeft />
            </button>

            <Tabs defaultValue="summary" className="space-y-10">
                <div className="relative ml-10">
                    <TabsList>
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="activity/report">
                            Activity/Report
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="summary">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <Card>{data && <Summary data={data.data} />}</Card>
                    )}
                </TabsContent>
                <TabsContent value="activity/report">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <Card>{data && <Activity data={data.data} />}</Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default WorkPlanDetail;
