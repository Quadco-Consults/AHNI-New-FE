"use client";

import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import eoiPng from "assets/imgs/rfq.png";
import Card from "components/Card";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import { Loading } from "components/Loading";
import { useGetAllSolicitations } from "@/features/procurement/controllers/solicitationController";
import Pagination from "components/Pagination";
import { useState } from "react";

const RFQ = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllSolicitations({
    page,
    size: 10,
    request_type: "REQUEST FOR QUOTATION", // Filter for RFQ solicitations only
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='space-y-10'>
      <div>
        <h4 className='text-lg font-bold'>Request For Quotations</h4>
        <h6>
          Procurement -{" "}
          <span className='font-medium text-black dark:text-grey-dark'>
            Request For Quotations
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
              Create New
            </Button>
          </Link>
        </div>

        {data ? (
          <div className='grid grid-cols-2 gap-5'>
            {data?.data?.results.map((item) => (
              <Card key={item?.id} className='space-y-4'>
                <img src={eoiPng} alt='eoi' />
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
          <p className='p-5 text-center'>No Data</p>
        )}

        <Pagination
          total={data?.data.pagination.count ?? 0}
          itemsPerPage={data?.data.pagination.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
};

export default RFQ;
