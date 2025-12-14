"use client";

import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/Card";
import { Loading } from "components/Loading";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { HrRoutes } from "constants/RouterConstants";
import { format } from "date-fns";
import { Briefcase, CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useGetJobAdvertisements } from "@/features/hr/controllers/jobAdvertisementController";
import useDebounce from "utils/useDebounce";
import SearchBar from "components/SearchBar";

const Advertisement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // Debounce the search term to avoid making too many API calls
  const debouncedSearchValue = useDebounce(searchTerm, 1000);
  const { data, isLoading } = useGetJobAdvertisements({
    search: debouncedSearchValue,
  });

  const advertisements = data?.data?.results || [];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Card className='space-y-10'>
      <div className='flex justify-between'>
        <SearchBar onchange={(e) => setSearchTerm(e.target.value)} />

        <Link href={HrRoutes.ADVERTISEMENT_ADD}>
          <Button>
            <AddSquareIcon /> Create New
          </Button>
        </Link>
      </div>

      {advertisements.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <Briefcase size={48} className='text-gray-400 mb-4' />
          <h3 className='text-lg font-semibold text-gray-700 mb-2'>
            No job advertisements found
          </h3>
          <p className='text-gray-500 mb-4'>
            {searchTerm
              ? `No results for "${searchTerm}"`
              : "Create your first job advertisement to get started"
            }
          </p>
          <Link href={HrRoutes.ADVERTISEMENT_ADD}>
            <Button>
              <AddSquareIcon /> Create Job Advertisement
            </Button>
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          {advertisements.map((job, idx) => (
            <Card key={job?.id || idx} className='space-y-4'>
            <Badge variant='darkYellow'>
              Date Posted: {format(job?.created_datetime, "dd, MMM, yy")}
            </Badge>
            <h4 className='font-semibold text-lg'>
              {job?.title || job?.position?.name || "Untitled Position"}
            </h4>

            <div className='flex flex-wrap gap-2'>
              <Badge variant='md'>
                <Users size={15} />({job?.number_of_positions} positions)
              </Badge>
              <Badge variant='md'>
                <Clock size={15} /> {job?.duration}
              </Badge>
              <Badge variant='md'>
                <CalendarDays size={15} />{" "}
                {format(job?.created_datetime, "dd-MMM-yyyy")}
              </Badge>
              <Badge variant='md'>
                <MapPin size={15} />{" "}
                {Array.isArray(job?.locations) && job.locations.length > 0
                  ? job.locations.map(loc => loc?.name).filter(Boolean).join(', ')
                  : 'Location not specified'}
              </Badge>
              <Badge variant='md'>
                <Briefcase size={15} /> {job?.job_type}
              </Badge>
              {/* <Badge variant='md'>
                <PersonStanding size={15} /> {BADGES.lead}
              </Badge> */}
            </div>

            <p className='text-sm line-clamp-4'>{job?.background}</p>

            <div className='flex justify-center'>
              <Link
                href={`/dashboard/hr/advertisement/${job?.id}`}
              >
                <Button variant='outline' className='text-red-600'>
                  Tap to View
                </Button>
              </Link>
            </div>
          </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

export default Advertisement;
