"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CG_ROUTES } from "@/constants/RouterConstants";
import { Plus } from "lucide-react";
import Link from "next/link";
import ConsultancyCard from "../contract-management/consultant-management/ConsultantCard";
import { useGetAllFacilitators } from "src/features/contracts-grants/controllers/facilitatorManagementController";
import { LoadingSpinner } from "@/components/Loading";
import Pagination from "@/components/Pagination";

export default function FacilitatorManagement() {
  const [page, setPage] = useState(1);

  // Use the dedicated facilitator API
  const { data, isFetching, error } = useGetAllFacilitators({
    page,
    size: 10,
    enabled: true,
  });

  console.log('Facilitator Management Data:', {
    data,
    isFetching,
    error,
    results: data?.data?.results,
    resultsLength: data?.data?.results?.length,
    paginator: data?.data?.paginator,
  });

  return (
    <section className='space-y-5'>
      <div className='flex justify-end'>
        <Link href={CG_ROUTES.CREATE_FACILITATOR_ADVERT_DETAILS}>
          <Button>
            <Plus size={29} /> New Facilitator Advert
          </Button>
        </Link>
      </div>

      {isFetching ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>Error loading data: {error.message}</p>
        </div>
      ) : data?.data?.results?.length > 0 ? (
        <div className='w-full flex flex-wrap justify-between items-start gap-y-[1rem]'>
          {data.data.results.map((facilitator) => (
            <ConsultancyCard key={facilitator.id} {...facilitator} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No facilitator adverts found.</p>
          <p className="text-sm mt-2">Try creating a new facilitator advert to get started.</p>
        </div>
      )}

      {data?.data?.paginator && (
        <Pagination
          total={data.data.paginator.count}
          itemsPerPage={data.data.paginator.page_size}
          onChange={(page) => setPage(page)}
        />
      )}
    </section>
  );
}