"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { ProgramRoutes } from "constants/RouterConstants";
import { Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "components/Loading";
import Pagination from "components/Pagination";
import { useGetAllAdhocAdvertisements } from "@/features/programs/controllers/adhocAdvertisementController";
import AdhocAdvertisementCard from "./AdhocAdvertisementCard";
import { IAdhocAdvertisement } from "@/features/programs/types/adhoc-management";

export default function AdhocAdvertisementsList() {
  const [page, setPage] = useState(1);

  // Using proper adhoc advertisements endpoint
  const { data, isFetching, error } = useGetAllAdhocAdvertisements({
    page,
    size: 10,
    enabled: true,
  });

  // Debug logging (can be removed in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Adhoc Advertisements Page:', {
      isFetching,
      error: error?.message,
      resultsCount: data?.data?.results?.length,
      totalCount: data?.data?.pagination?.count,
    });
  }

  return (
    <section className='space-y-5'>
      <div className='flex justify-end'>
        <Link href={ProgramRoutes.CREATE_ADHOC_DETAILS}>
          <Button>
            <Plus size={29} /> New Adhoc Advertisement
          </Button>
        </Link>
      </div>

      {isFetching ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Advertisements</h3>
          <p className="text-gray-600 mb-4">Unable to load adhoc advertisements.</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-red-800 font-mono">
              {error.message}
            </p>
          </div>
        </div>
      ) : data?.data?.results?.length > 0 ? (
        <div className='w-full flex flex-wrap justify-between items-start gap-y-[1rem]'>
          {data.data.results.map((advertisement: IAdhocAdvertisement) => (
            <AdhocAdvertisementCard key={advertisement.id} {...advertisement} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No adhoc advertisements found.</p>
          <p className="text-sm mt-2">
            Convert approved requisitions to advertisements or create new ones.
          </p>
        </div>
      )}

      {data?.data?.pagination && (
        <Pagination
          total={data.data.pagination.count}
          itemsPerPage={data.data.pagination.page_size}
          onChange={(page) => setPage(page)}
        />
      )}
    </section>
  );
}
