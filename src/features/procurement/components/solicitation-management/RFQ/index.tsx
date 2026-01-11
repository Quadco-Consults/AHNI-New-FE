"use client";

import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import eoiPng from "assets/imgs/rfq.png";
import Card from "@/components/Card";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { RouteEnum } from "@/constants/RouterConstants";
import { Loading } from "@/components/Loading";
import { useGetAllSolicitations } from "@/features/procurement/controllers/solicitationController";
import Pagination from "@/components/Pagination";
import { useState } from "react";

const RFQ = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error } = useGetAllSolicitations({
    page,
    size: 10,
    request_type: "REQUEST FOR QUOTATION", // Filter for RFQ solicitations only
    job_category: "GOODS", // Always filter for goods only in procurement
  });



  if (isLoading) {
    return <Loading />;
  }

  // Show error state if there's an API error
  if (error) {
    return (
      <div className='space-y-10'>
        <div>
          <h4 className='text-lg font-bold'>Request For Quotations</h4>
          <h6>
            Procurement -{" "}
            <span className='font-medium text-black dark:text-grey-dark'>
              Request For Quotations (Goods)
            </span>
          </h6>
        </div>
        <div className='p-10 bg-red-50 rounded-2xl'>
          <h3 className='text-red-600 font-semibold'>Error Loading RFQs</h3>
          <p className='text-red-500'>{error?.message || 'Failed to load RFQ data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-10'>
      <div>
        <h4 className='text-lg font-bold'>Request For Quotations</h4>
        <h6>
          Procurement -{" "}
          <span className='font-medium text-black dark:text-grey-dark'>
            Request For Quotations (Goods)
          </span>
        </h6>

      </div>

      <div className='space-y-10 p-10 bg-white shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
        <div className='flex items-center justify-end'>
          <Link href={RouteEnum.RFQ_CREATE_QUOTATION}>
            <Button>
              <span>
                <Plus size={15} />
              </span>
              Create New RFQ
            </Button>
          </Link>
        </div>

        {isFetching ? (
          <div className='flex justify-center items-center py-20'>
            <Loading />
          </div>
        ) : (data?.data?.results && data.data.results.length > 0) ? (
          <div className='grid grid-cols-2 gap-5'>
            {data.data.results.map((item: any) => (
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
          <p className='p-5 text-center'>No RFQs Found</p>
        )}

        <Pagination
          total={data?.data?.pagination?.count ?? 0}
          itemsPerPage={data?.data?.pagination?.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
};

export default RFQ;
