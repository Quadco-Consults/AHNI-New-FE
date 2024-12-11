import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import Summary from "./Summary";
import Uploads from "./Upload";
import { Loading } from "components/shared/Loading";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { RouteEnum } from "constants/RouterConstants";
import { useGetSingleProjectQuery } from "services/projectsApi/projectsApi";
import { skipToken } from "@reduxjs/toolkit/query/react";
import Performance from "./Performance";
import Activity from "./Activity";
import ProjectObligation from "./Obligation";

const ProjectDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    localStorage.setItem("projectDetailID", id as string);

    const { data: project, isLoading } = useGetSingleProjectQuery(
        id ?? skipToken
    );

    const goBack = () => {
        navigate(-1);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="space-y-6 relative min-h-screen">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={RouteEnum.PROJECTS}>
                            Projects
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Icon icon="iconoir:slash" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <button
                onClick={goBack}
                className="w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
            >
                <LongArrowLeft />
            </button>

            <Tabs defaultValue="summary" className="space-y-5">
                <TabsList className="ml-10">
                    <TabsTrigger value="summary">Project Summary</TabsTrigger>

                    <TabsTrigger value="obligation">
                        Project Obligation
                    </TabsTrigger>

                    <TabsTrigger value="performance">
                        Project Performance
                    </TabsTrigger>

                    <TabsTrigger value="uploads">Uploads</TabsTrigger>

                    <TabsTrigger value="activity">Activity/Report</TabsTrigger>
                </TabsList>

                {project && (
                    <>
                        <TabsContent value="summary">
                            <Card>
                                <Summary {...project.data} />
                            </Card>
                        </TabsContent>

                        <TabsContent value="obligation">
                            <Card>
                                <ProjectObligation {...project.data} />
                            </Card>
                        </TabsContent>

                        <TabsContent value="performance">
                            <Card>
                                <Performance {...project.data} />
                            </Card>
                        </TabsContent>

                        <TabsContent value="uploads">
                            <Uploads {...project.data} />
                        </TabsContent>

                        <TabsContent value="activity">
                            <Activity />
                        </TabsContent>
                    </>
                )}
            </Tabs>
        </div>
    );
};

export default ProjectDetail;
