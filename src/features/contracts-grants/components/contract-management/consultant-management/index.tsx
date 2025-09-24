"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConsultancyCard from "./ConsultantCard";
import { useGetAllConsultantManagements } from "src/features/contracts-grants/controllers/consultantManagementController";
import { LoadingSpinner } from "components/Loading";
import Pagination from "components/Pagination";
import UserAdvertType from "hooks/useJobAdvertType";

export default function Consultancy() {
  const [page, setPage] = useState(1);

  const advertType = UserAdvertType();

  const { data, isFetching, error } = useGetAllConsultantManagements({
    page,
    size: 10,
    type: advertType.toUpperCase(),
    enabled: true,
  });

  console.log('Consultant Management Data:', {
    advertType,
    typeParam: advertType.toUpperCase(),
    data,
    isFetching,
    error,
    results: data?.data?.results,
    resultsLength: data?.data?.results?.length,
    paginator: data?.data?.paginator,
    apiStatus: data ? 'SUCCESS' : error ? 'ERROR' : isFetching ? 'LOADING' : 'UNKNOWN'
  });

  // Log additional debugging info
  if (error) {
    console.error('API Error Details:', error.message || error);
  }

  if (data) {
    console.log('API Response Structure:', {
      hasData: !!data,
      hasDataProp: !!data?.data,
      hasResults: !!data?.data?.results,
      resultsType: typeof data?.data?.results,
      resultsLength: data?.data?.results?.length,
      totalData: data
    });
  }

  const path =
    advertType === "adhoc"
      ? ProgramRoutes.CREATE_ADHOC_DETAILS
      : advertType === "facilitator"
      ? CG_ROUTES.CREATE_FACILITATOR_ADVERT_DETAILS
      : CG_ROUTES.CREATE_CONSULTANCY_DETAILS;

  const btnLabel =
    advertType === "adhoc"
      ? "Adhoc"
      : advertType === "consultant"
      ? "Consultant"
      : "Facilitator";

  return (
    <section className='space-y-5'>
      <div className='flex justify-end'>
        <Link href={path}>
          <Button>
            <Plus size={29} /> New {btnLabel}
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
          {data.data.results.map((consultant) => (
            <ConsultancyCard key={consultant.id} {...consultant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No {advertType} consultants found.</p>
          <p className="text-sm mt-2">Try creating a new {advertType} to get started.</p>
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
