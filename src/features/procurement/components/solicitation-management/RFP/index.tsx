"use client";

import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import eoiPng from "assets/imgs/eoi.png";
import Card from "components/Card";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import { Loading } from "components/Loading";
import { useGetAllSolicitations } from "@/features/procurement/controllers/solicitationController";
import Pagination from "components/Pagination";
import { useState } from "react";

const generatePath = (route: string, params?: Record<string, any>): string => {
  let path = route;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`[${key}]`, String(value));
    });
  }
  return path;
};

const RFP = () => {
  const [page, setPage] = useState(1);

  // First, get all solicitations to see what request_types exist
  const { data: allData } = useGetAllSolicitations({
    page: 1,
    size: 50,
    // No filter to see all
  });

  const { data, isLoading } = useGetAllSolicitations({
    page,
    size: 10,
    request_type: "REQUEST FOR PROPOSAL",
  });

  // Enhanced Debug logging
  console.log("🔍 RFP Listing Debug:", {
    isLoading,
    filteredData: data,
    filteredResults: data?.data?.results,
    filteredResultCount: data?.data?.results?.length,
    allData: allData,
    allResults: allData?.data?.results,
    allResultCount: allData?.data?.results?.length,
    uniqueRequestTypes: [...new Set(allData?.data?.results?.map(item => item.request_type) || [])],
    filterApplied: "REQUEST FOR PROPOSAL",
    hasResults: !!data?.data?.results?.length,
    sampleItems: allData?.data?.results?.slice(0, 3)?.map(item => ({
      id: item.id,
      title: item.title,
      request_type: item.request_type,
      tender_type: item.tender_type
    }))
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='space-y-10'>
      <div>
        <h4 className='text-lg font-bold'>Request For Proposal</h4>
        <h6>
          Procurement -{" "}
          <span className='font-medium text-black dark:text-grey-dark'>
            Request For Proposal
          </span>
        </h6>
      </div>

      <div className='space-y-10 p-10 bg-white shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
        <div className='flex items-center justify-end'>
          <Link href={RouteEnum.RFP_CREATE_PROPOSAL}>
            <Button>
              <span>
                <Plus size={15} />
              </span>
              Create New
            </Button>
          </Link>
        </div>

        {data?.data?.results && data.data.results.length > 0 ? (
          <div className='grid grid-cols-2 gap-5'>
            {data.data.results.map((item: any) => (
              <Card key={item?.id} className='space-y-4'>
                <img src={typeof eoiPng === 'string' ? eoiPng : eoiPng.src} alt='rfp' />
                <h2 className='text-lg font-bold'>{item?.title}</h2>

                <div className='flex items-center gap-3'>
                  <Icon icon='ooui:reference' fontSize={18} />{" "}
                  <h6>{item.rfp_id || item.rfq_id || "N/A"}</h6>
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
                  <Icon icon='mdi:document-text' fontSize={18} />
                  <h6 className='text-blue-600 font-medium'>{item?.request_type || "RFP"}</h6>
                </div>

                <h6 className='line-clamp-3'>{item?.background || item?.description || ""}</h6>

                <div className='flex justify-center'>
                  <Link href={generatePath(RouteEnum.RFP_DETAILS, { id: item?.id })}>
                    <Button variant='ghost' className='border text-primary'>
                      Tap to View
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className='p-8 text-center'>
            <Icon icon='mdi:document-text-outline' fontSize={48} className='mx-auto text-gray-400 mb-4' />
            <p className='text-gray-600 text-lg mb-2'>No RFP Solicitations Found</p>
            <p className='text-gray-500 text-sm'>
              No Request for Proposal (RFP) solicitations have been created yet.
              <br />
              Click "Create New" to create your first RFP.
            </p>

            {/* Debug info for troubleshooting */}
            {allData?.data?.results && allData.data.results.length > 0 && (
              <div className='mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left'>
                <p className='text-yellow-800 text-sm font-medium mb-2'>
                  🔧 Debug Info: Found {allData.data.results.length} total solicitations
                </p>
                <div className='text-xs text-yellow-700 space-y-1'>
                  <div><strong>Available request types:</strong></div>
                  {[...new Set(allData.data.results.map(item => item.request_type))].map((type, index) => (
                    <div key={index} className="ml-2">• {type || 'No request_type'}</div>
                  ))}
                </div>
                <div className='text-xs text-yellow-700 mt-3 space-y-1'>
                  <div><strong>Sample solicitations:</strong></div>
                  {allData.data.results.slice(0, 3).map((item, index) => (
                    <div key={index} className="ml-2">
                      <strong>{item.title || 'Untitled'}</strong>: {item.request_type || 'No request_type'}
                    </div>
                  ))}
                </div>
                <p className='text-xs text-yellow-600 mt-2'>
                  Looking for solicitations with request_type: "REQUEST FOR PROPOSAL"
                </p>
              </div>
            )}
          </div>
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

export default RFP;
