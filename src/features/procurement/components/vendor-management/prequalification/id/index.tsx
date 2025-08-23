"use client";

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import Overview from "./Overview";
import Uploads from "./Uploads";
import Questionnaire from "./Questionnaire";
import TechnicalCapability from "./Technical-capability";
import { Button } from "components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation"; 
import { RouteEnum } from "constants/RouterConstants";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
import { LoadingSpinner } from "components/Loading";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import GoBack from "components/GoBack";

// Helper function to generate path with parameters
const generatePath = (route: string, params?: Record<string, any>): string => {
  if (!params) return route;
  return Object.entries(params).reduce((path, [key, value]) => {
    return path.replace(`:${key}`, value);
  }, route);
};

const PrequalificationDetails = () => {
  const { id } = useParams();

  const { data: vendorsData, isLoading } = VendorsAPI.useGetVendor(id as string);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  const data = vendorsData?.data;

  return (
    <div className='space-y-5'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Procurement</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon='iconoir:slash' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbItem>Prequalification</BreadcrumbItem>
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
      <div className='flex justify-between'>
        <h4 className='text-lg font-bold'>Prequalification</h4>

        {["Pending"].includes(data?.status!) && (
          <Link
            href={generatePath(
              RouteEnum.VENDOR_MANAGEMENT_START_PREQUALIFICATION,
              {
                id: id,
              }
            )}
          >
            <Button>Start Prequalification</Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue='overview'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='uploads'>Uploads</TabsTrigger>
          <TabsTrigger value='questionnaire'>Questionnaire</TabsTrigger>
          <TabsTrigger value='technical-capability'>
            Technical Capability
          </TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>
          <Overview {...(data as VendorsResultsData)} />
        </TabsContent>
        <TabsContent value='uploads'>
          <Uploads {...(data as VendorsResultsData)} />
        </TabsContent>
        <TabsContent value='questionnaire'>
          <Questionnaire {...(data as VendorsResultsData)} />
        </TabsContent>
        <TabsContent value='technical-capability'>
          <TechnicalCapability {...(data as VendorsResultsData)} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrequalificationDetails;
