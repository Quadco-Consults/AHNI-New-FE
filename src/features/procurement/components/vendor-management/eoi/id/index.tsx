"use client";

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import EoIDetails from "../eoi-tabs-contents/EoIDetails";
import EOIVendorSubmission from "../eoi-tabs-contents/EOIVendorSubmission";
import RoundBack from "assets/svgs/RoundBack";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; 
import EoiAPI from "@/features/procurement/controllers/eoiController";
import { LoadingSpinner } from "components/Loading";
import { EOIResultsData } from "definations/procurement-types/eoi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";

const ViewEOI = () => {
  const router = useRouter();
  const { id } = useParams();

  const { data, isLoading } = EoiAPI.useGetEoi(id as string);

  // @ts-ignore
  const responseData = data?.data;

  return (
    <div className='space-y-10'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Procurement</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon='iconoir:slash' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Vendor Management</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon='iconoir:slash' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>EOI</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon='iconoir:slash' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs defaultValue='eoi-details'>
        <div className='flex items-start gap-x-4 '>
          <div onClick={() => router.back()} className='-mt-5'>
            <RoundBack />
          </div>
          <TabsList>
            <TabsTrigger value='eoi-details'>EOI Details</TabsTrigger>
            <TabsTrigger value='vendor-submission'>
              Vendor submissions
            </TabsTrigger>
          </TabsList>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <TabsContent value='eoi-details'>
              <EoIDetails {...(responseData as EOIResultsData)} />
            </TabsContent>
            <TabsContent value='vendor-submission'>
              <EOIVendorSubmission eoiData={responseData} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default ViewEOI;
