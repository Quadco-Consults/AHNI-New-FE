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
import SearchBar from "components/atoms/SearchBar";

const Advertisement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // Debounce the search term to avoid making too many API calls
  const debouncedSearchValue = useDebounce(searchTerm, 1000);
  const { data, isLoading } = useGetJobAdvertisements({
    search: debouncedSearchValue,
  });

  console.log("Advertisement", data);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Card className='space-y-10'>
      <div className='flex justify-between'>
        <SearchBar />

        <Link href={HrRoutes.ADVERTISEMENT_ADD}>
          <Button>
            <AddSquareIcon /> Create New
          </Button>
        </Link>
      </div>

      <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
        {/* @ts-ignore */}
        {data?.data?.results.map((job, idx) => (
          <Card key={idx} className='space-y-4'>
            <Badge variant='darkYellow'>
              Date Posted: {format(job?.created_datetime, "dd, MMM, yy")}
            </Badge>
            <h4 className='font-semibold text-lg'>{job?.title}</h4>

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
                <MapPin size={15} /> {
                  typeof job?.locations === 'object' && job?.locations?.name 
                    ? job.locations.name 
                    : Array.isArray(job?.locations) 
                      ? job.locations.map(loc => typeof loc === 'object' ? loc.name : loc).join(', ')
                      : String(job?.locations || 'N/A')
                }
                {/* <MapPin size={15} /> Various LGAs of {BADGES.lga} */}
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
    </Card>
  );
};

export default Advertisement;
