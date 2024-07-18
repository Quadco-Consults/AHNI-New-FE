import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import Overview from "./Overview";
import Uploads from "./Uploads";
import Questionnaire from "./Questionnaire";
import TechnicalCapability from "./Technical-capability";
import { Button } from "components/ui/button";
import { Link, generatePath, useParams } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import VendorsAPI from "services/procurementApi/vendors";
import { LoadingSpinner } from "components/shared/Loading";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";

const PrequalificationDetails = () => {
  const { id } = useParams();

  const { data, isLoading } = VendorsAPI.useGetVendorQuery({
    path: { id: id as string },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Procurement</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbItem>Prequalification</BreadcrumbItem>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between">
        <h4 className="text-lg font-bold">Prequalification</h4>

        <Link
          to={generatePath(RouteEnum.VENDOR_MANAGEMENT_START_PREQUALIFICATION, {
            id: id,
          })}
        >
          <Button>Start Prequalification</Button>
        </Link>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="uploads">Uploads</TabsTrigger>
          <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
          <TabsTrigger value="technical-capability">
            Technical Capability
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Overview {...(data as VendorsResultsData)} />
        </TabsContent>
        <TabsContent value="uploads">
          <Uploads {...(data as VendorsResultsData)} />
        </TabsContent>
        <TabsContent value="questionnaire">
          <Questionnaire {...(data as VendorsResultsData)} />
        </TabsContent>
        <TabsContent value="technical-capability">
          <TechnicalCapability {...(data as VendorsResultsData)} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrequalificationDetails;
