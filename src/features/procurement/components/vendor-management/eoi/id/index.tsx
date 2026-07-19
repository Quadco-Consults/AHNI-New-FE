"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EoIDetails from "../eoi-tabs-contents/EoIDetails";
import EOIVendorSubmission from "../eoi-tabs-contents/EOIVendorSubmission";
import RoundBack from "assets/svgs/RoundBack";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import EoiAPI from "@/features/procurement/controllers/eoiController";
import { LoadingSpinner } from "@/components/Loading";
import { EOIResultsData } from "definitions/procurement-types/eoi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
import { useMemo } from "react";

const ViewEOI = () => {
  const router = useRouter();
  const { id } = useParams();

  const { data, isLoading } = EoiAPI.useGetEoi(id as string);

  // Fetch vendors to get submission count
  const { data: vendorsData } = VendorsAPI.useGetVendors({
    page: 1,
    size: 100,
    enabled: true,
  });

  // Calculate submission count for this EOI
  const submissionCount = useMemo(() => {
    if (!vendorsData?.data?.results) return 0;
    return vendorsData.data.results.filter((vendor: any) => vendor.eoi === id).length;
  }, [vendorsData, id]);

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
          <div onClick={() => router.back()} className='-mt-5 cursor-pointer'>
            <RoundBack />
          </div>
          <TabsList>
            <TabsTrigger value='eoi-details'>EOI Details</TabsTrigger>
            <TabsTrigger value='vendor-submission'>
              <span className="flex items-center gap-2">
                Vendor Submissions
                {submissionCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-2 py-0 text-xs">
                    {submissionCount}
                  </Badge>
                )}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <TabsContent value='eoi-details'>
              <EoIDetails {...(responseData as EOIResultsData)} submissionCount={submissionCount} />
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
