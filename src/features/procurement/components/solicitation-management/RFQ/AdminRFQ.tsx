"use client";

import { Button } from "components/ui/button";
import { Plus, Briefcase } from 'lucide-react';
import eoiPng from "assets/imgs/rfq.png";
import Card from "components/Card";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import { Loading } from "components/Loading";
import { useGetAllSolicitations } from "@/features/procurement/controllers/solicitationController";
import Pagination from "components/Pagination";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";

const AdminRFQ = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"SERVICES" | "GOODS">("SERVICES");

  const { data, isLoading, isFetching } = useGetAllSolicitations({
    page,
    size: 10,
    request_type: "REQUEST FOR QUOTATION", // Filter for RFQ solicitations only
    job_category: activeTab, // Dynamic filter based on active tab
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value as "SERVICES" | "GOODS");
    setPage(1); // Reset to page 1 when switching tabs
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='space-y-10'>
      <div>
        <h4 className='text-lg font-bold'>Request For Quotations</h4>
        <h6>
          Solicitation Management -{" "}
          <span className='font-medium text-black dark:text-grey-dark'>
            Request For Quotations (Goods & Services)
          </span>
        </h6>
      </div>

      <Tabs defaultValue="SERVICES" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="SERVICES">Services</TabsTrigger>
          <TabsTrigger value="GOODS">Goods</TabsTrigger>
        </TabsList>

        <TabsContent value="SERVICES" className='space-y-10 p-10 bg-white shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
          <div className='flex items-center justify-end'>
            <Link href={RouteEnum.RFQ_CREATE_QUOTATION}>
              <Button>
                <span>
                  <Plus size={15} />
                </span>
                Create New Service RFQ
              </Button>
            </Link>
          </div>

          {isFetching ? (
            <div className='flex justify-center items-center py-20'>
              <Loading />
            </div>
          ) : data?.data?.results && data.data.results.length > 0 ? (
            <div className='grid grid-cols-2 gap-5'>
              {data.data.results.map((item) => (
                <Card key={item?.id} className='space-y-4'>
                  <img src={eoiPng.src} alt='Request For Quotation' />
                  <h2 className='text-lg font-bold'>{item?.title}</h2>

                  <div className='flex items-center gap-3'>
                    <Icon icon='ooui:reference' fontSize={18} />{" "}
                    <h6>{item.rfq_id || "N/A"}</h6>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Icon icon='iconamoon:location-pin-duotone' fontSize={18} />
                    <h6>HEAD OFFICE ABUJA</h6>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Icon
                      icon='solar:case-minimalistic-bold-duotone'
                      fontSize={18}
                    />
                    <h6>{item?.tender_type}</h6>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Icon
                      icon='mdi:cog-outline'
                      fontSize={18}
                    />
                    <h6 className='text-blue-600 font-medium'>Services</h6>
                  </div>

                  <h6 className='line-clamp-3'>{/* {item?.description} */}</h6>

                  <div className='flex justify-center'>
                    <Link
                      href={RouteEnum.RFQ_DETAILS.replace(":id", item?.id as string)}
                    >
                      <Button variant='ghost' className='border text-primary'>
                        Tap to View
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className='p-5 text-center'>No Service RFQs Found</p>
          )}

          <Pagination
            total={data?.data.pagination.count ?? 0}
            itemsPerPage={data?.data.pagination.page_size ?? 0}
            onChange={(page: number) => setPage(page)}
          />
        </TabsContent>

        <TabsContent value="GOODS" className='space-y-10 p-10 bg-white shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
          <div className='flex items-center justify-end'>
            <Link href={RouteEnum.RFQ_CREATE_QUOTATION}>
              <Button>
                <span>
                  <Plus size={15} />
                </span>
                Create New Goods RFQ
              </Button>
            </Link>
          </div>

          {isFetching ? (
            <div className='flex justify-center items-center py-20'>
              <Loading />
            </div>
          ) : data?.data?.results && data.data.results.length > 0 ? (
            <div className='grid grid-cols-2 gap-5'>
              {data.data.results.map((item) => (
                <Card key={item?.id} className='space-y-4'>
                  <img src={eoiPng.src} alt='Request For Quotation' />
                  <h2 className='text-lg font-bold'>{item?.title}</h2>

                  <div className='flex items-center gap-3'>
                    <Icon icon='ooui:reference' fontSize={18} />{" "}
                    <h6>{item.rfq_id || "N/A"}</h6>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Icon icon='iconamoon:location-pin-duotone' fontSize={18} />
                    <h6>HEAD OFFICE ABUJA</h6>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Icon
                      icon='solar:case-minimalistic-bold-duotone'
                      fontSize={18}
                    />
                    <h6>{item?.tender_type}</h6>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Icon
                      icon='ph:package-duotone'
                      fontSize={18}
                    />
                    <h6 className='text-green-600 font-medium'>Goods</h6>
                  </div>

                  <h6 className='line-clamp-3'>{/* {item?.description} */}</h6>

                  <div className='flex justify-center'>
                    <Link
                      href={RouteEnum.RFQ_DETAILS.replace(":id", item?.id as string)}
                    >
                      <Button variant='ghost' className='border text-primary'>
                        Tap to View
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className='p-5 text-center'>No Goods RFQs Found</p>
          )}

          <Pagination
            total={data?.data.pagination.count ?? 0}
            itemsPerPage={data?.data.pagination.page_size ?? 0}
            onChange={(page: number) => setPage(page)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRFQ;