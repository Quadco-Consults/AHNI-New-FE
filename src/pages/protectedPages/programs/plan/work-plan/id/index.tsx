import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useNavigate } from "react-router-dom";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import Summary from "./Summary";
import Activity from "./activity";
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

const WorkPlanDetail = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="space-y-6 relative min-h-screen">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Programs</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Plans</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={RouteEnum.PROGRAM_WORK_PLAN}>
              Work Plan
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

      <Tabs defaultValue="summary" className="space-y-10">
        <div className="relative ml-10">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="activity/report">Activity/Report</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="summary">
          <Card>
            <Summary />
          </Card>
        </TabsContent>
        <TabsContent value="activity/report">
          <Activity />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkPlanDetail;
