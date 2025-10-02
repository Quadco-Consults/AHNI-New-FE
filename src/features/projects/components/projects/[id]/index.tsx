import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useParams } from "next/navigation";
import GoBack from "components/GoBack";
import Card from "components/Card";
import Summary from "./Summary";
import Uploads from "./Upload";
import { Loading, LoadingSpinner } from "components/Loading";
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
import { useGetSingleProject } from "@/features/projects/controllers/projectController";
import Performance from "./Performance";
import Activity from "./Activity";
import ObligationHistory from "features/contracts-grants/components/grant/_components/ObligationHistory";
// import { useGetSingleSubGrant } from "@/features/c&g/subgrant/sub-grant";

export default function ProjectDetail() {
  const { id } = useParams();

  localStorage.setItem("projectDetailID", id as string);

  const { data: project, isLoading } = useGetSingleProject(
    id as string,
    !!id
  );

  //   const { data: grant, isLoadingGrant } = useGetSingleSubGrant(
  //     id ?? skipToken
  //   );

  // const { data } = useGetSingleGrant(2);
  // project?.data?.grant.grant_id ?? skipToken

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='space-y-6 relative min-h-screen'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={RouteEnum.PROJECTS}>Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon='iconoir:slash' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <GoBack />

      <Tabs defaultValue='summary' className='space-y-5'>
        <TabsList className='ml-10'>
          <TabsTrigger value='summary'>Project Summary</TabsTrigger>

          <TabsTrigger value='obligation'>Project Obligation</TabsTrigger>

          <TabsTrigger value='performance'>Project Performance</TabsTrigger>

          <TabsTrigger value='uploads'>Uploads</TabsTrigger>

          <TabsTrigger value='activity'>Activity/Report</TabsTrigger>
        </TabsList>

        {project && (
          <>
            <TabsContent value='summary'>
              <Card>
                <Summary {...project.data} />
              </Card>
            </TabsContent>

            <TabsContent value='obligation'>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <Card>
                  {project && <ObligationHistory {...project?.data} />}
                </Card>
              )}
            </TabsContent>

            <TabsContent value='performance'>
              <Card>
                <Performance {...project.data} />
              </Card>
            </TabsContent>

            <TabsContent value='uploads'>
              <Uploads />
            </TabsContent>

            <TabsContent value='activity'>
              <Activity />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
