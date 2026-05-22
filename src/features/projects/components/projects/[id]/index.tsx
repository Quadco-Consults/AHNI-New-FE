import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import GoBack from "@/components/GoBack";
import Card from "@/components/Card";
import Summary from "./Summary";
import Uploads from "./Upload";
import { Loading, LoadingSpinner } from "@/components/Loading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { RouteEnum } from "@/constants/RouterConstants";
import { useGetSingleProject } from "@/features/projects/controllers/projectController";
import Performance from "./Performance";
import ActivityReport from "./ActivityReport";
import ObligationHistory from "@/features/contracts-grants/components/grant/_components/ObligationHistory";
import DisbursementHistory from "@/features/contracts-grants/components/grant/_components/DisbursementHistory";
import { formatNumberCurrency } from "@/utils/utls";
import { Badge } from "@/components/ui/badge";
// import { useGetSingleSubGrant } from "@/features/c&g/subgrant/sub-grant";

export default function ProjectDetail() {
  const { id } = useParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      localStorage.setItem("projectDetailID", id as string);
    }
  }, [id]);

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

      {/* Project Overview Cards */}
      {project && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Project Title & ID Card */}
          <Card className='p-5 border-l-4 border-l-blue-600'>
            <h4 className='text-xs font-medium text-gray-500 mb-2'>PROJECT INFO</h4>
            <p className='text-lg font-bold text-gray-900 truncate mb-1' title={project.data.title}>
              {project.data.title}
            </p>
            <p className='text-xs text-gray-600 mb-2'>ID: {project.data.project_id}</p>
            <Badge variant='outline' className='bg-blue-50 text-blue-700 border-blue-200 text-xs'>
              {project.data.status || 'Active'}
            </Badge>
          </Card>

          {/* Budget Card */}
          <Card className='p-5 border-l-4 border-l-green-600'>
            <h4 className='text-xs font-medium text-gray-500 mb-2'>TOTAL BUDGET</h4>
            <p className='text-2xl font-bold text-gray-900 mb-1'>
              {formatNumberCurrency(project.data.budget, project.data.currency)}
            </p>
            {project.data.total_obligation_amount && (
              <div className='text-xs text-gray-600 space-y-1'>
                <p>Obligated: {formatNumberCurrency(parseFloat(project.data.total_obligation_amount), project.data.currency)}</p>
                <div className='w-full bg-gray-200 rounded-full h-1.5'>
                  <div
                    className='bg-green-600 h-1.5 rounded-full'
                    style={{
                      width: `${Math.min((parseFloat(project.data.total_obligation_amount) / project.data.budget) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            )}
          </Card>

          {/* Timeline Card */}
          <Card className='p-5 border-l-4 border-l-purple-600'>
            <h4 className='text-xs font-medium text-gray-500 mb-2'>PROJECT TIMELINE</h4>
            <div className='space-y-1.5 mb-2'>
              <div className='text-xs text-gray-700'>
                <span className='font-medium'>Start:</span> {project.data.start_date}
              </div>
              <div className='text-xs text-gray-700'>
                <span className='font-medium'>End:</span> {project.data.end_date}
              </div>
            </div>
            <p className='text-xs text-gray-600'>
              Duration: {(() => {
                const start = new Date(project.data.start_date);
                const end = new Date(project.data.end_date);
                const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
                return `${months} months`;
              })()}
            </p>
          </Card>

          {/* Stakeholders Card */}
          <Card className='p-5 border-l-4 border-l-amber-600'>
            <h4 className='text-xs font-medium text-gray-500 mb-2'>STAKEHOLDERS</h4>
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-600'>Partners:</span>
                <span className='font-bold text-gray-900'>
                  {project.data.partners?.length || 0}
                </span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-600'>Managers:</span>
                <span className='font-bold text-gray-900'>
                  {project.data.project_managers?.length || 0}
                </span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-600'>Funding Sources:</span>
                <span className='font-bold text-gray-900'>
                  {project.data.funding_sources?.length || 0}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Tabs defaultValue='summary' className='space-y-5'>
        <TabsList className='ml-10'>
          <TabsTrigger value='summary'>Project Summary</TabsTrigger>

          <TabsTrigger value='obligation'>Project Obligation</TabsTrigger>

          <TabsTrigger value='disbursement'>Disbursements</TabsTrigger>

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

            <TabsContent value='disbursement'>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <Card>
                  {project && <DisbursementHistory {...project?.data} />}
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
              <Card>
                <ActivityReport {...project.data} />
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
