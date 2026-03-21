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
          <Card className='p-5 space-y-2 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'>
            <div className='flex items-center gap-2'>
              <Icon icon='mdi:file-document-outline' className='text-blue-600' width={24} />
              <h4 className='font-semibold text-sm text-blue-900'>Project Info</h4>
            </div>
            <p className='text-xl font-bold text-blue-900 truncate' title={project.data.title}>
              {project.data.title}
            </p>
            <p className='text-xs text-blue-700'>ID: {project.data.project_id}</p>
            <Badge
              variant='outline'
              className='bg-blue-600 text-white border-blue-700 text-xs'
            >
              {project.data.status || 'Active'}
            </Badge>
          </Card>

          {/* Budget Card */}
          <Card className='p-5 space-y-2 bg-gradient-to-br from-green-50 to-green-100 border-green-200'>
            <div className='flex items-center gap-2'>
              <Icon icon='mdi:cash-multiple' className='text-green-600' width={24} />
              <h4 className='font-semibold text-sm text-green-900'>Total Budget</h4>
            </div>
            <p className='text-2xl font-bold text-green-900'>
              {formatNumberCurrency(project.data.budget, project.data.currency)}
            </p>
            {project.data.total_obligation_amount && (
              <div className='text-xs text-green-700 space-y-1'>
                <p>Obligated: {formatNumberCurrency(parseFloat(project.data.total_obligation_amount), project.data.currency)}</p>
                <div className='w-full bg-green-200 rounded-full h-1.5'>
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
          <Card className='p-5 space-y-2 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'>
            <div className='flex items-center gap-2'>
              <Icon icon='mdi:calendar-range' className='text-purple-600' width={24} />
              <h4 className='font-semibold text-sm text-purple-900'>Timeline</h4>
            </div>
            <div className='space-y-1'>
              <div className='flex items-center gap-2 text-xs text-purple-700'>
                <Icon icon='mdi:calendar-start' width={14} />
                <span>Start: {project.data.start_date}</span>
              </div>
              <div className='flex items-center gap-2 text-xs text-purple-700'>
                <Icon icon='mdi:calendar-end' width={14} />
                <span>End: {project.data.end_date}</span>
              </div>
            </div>
            <p className='text-xs text-purple-700 pt-2'>
              Duration: {(() => {
                const start = new Date(project.data.start_date);
                const end = new Date(project.data.end_date);
                const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
                return `${months} months`;
              })()}
            </p>
          </Card>

          {/* Stakeholders Card */}
          <Card className='p-5 space-y-2 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'>
            <div className='flex items-center gap-2'>
              <Icon icon='mdi:account-group' className='text-amber-600' width={24} />
              <h4 className='font-semibold text-sm text-amber-900'>Stakeholders</h4>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-amber-700'>Partners:</span>
                <span className='text-lg font-bold text-amber-900'>
                  {project.data.partners?.length || 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-amber-700'>Managers:</span>
                <span className='text-lg font-bold text-amber-900'>
                  {project.data.project_managers?.length || 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-amber-700'>Funding Sources:</span>
                <span className='text-lg font-bold text-amber-900'>
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
