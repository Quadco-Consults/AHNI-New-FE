import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/shared/Card";
import { Loading } from "components/shared/Loading";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { HrRoutes } from "constants/RouterConstants";
import { format } from "date-fns";
import {
  Briefcase,
  CalendarDays,
  Clock,
  MapPin,
  SearchIcon,
  Users,
} from "lucide-react";
import { useState } from "react";
import { generatePath, Link } from "react-router-dom";
import { useGetJobAdvertisementsQuery } from "services/hrApi/hr-job-advertisement";
import useDebounce from "utils/useDebounce";

const Advertisement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // Debounce the search term to avoid making too many API calls
  const debouncedSearchValue = useDebounce(searchTerm, 1000);
  const { data, isLoading } = useGetJobAdvertisementsQuery({
    search: debouncedSearchValue,
  });
  console.log(data);
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Card className="space-y-10">
      <div className="flex justify-between">
        <span className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
          <SearchIcon />
          <input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="ml-2 h-6 w-full border-none bg-none focus:outline-none outline-none"
          />
        </span>
        <Link to={HrRoutes.ADVERTISEMENT_ADD}>
          <Button>
            <AddSquareIcon /> Create New
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* @ts-ignore */}
        {data?.data?.results.map((job, idx) => (
          <Card key={idx} className="space-y-4">
            <Badge variant="darkYellow">
              Date Posted: {format(job?.created_datetime, "dd, MMM, yy")}
            </Badge>
            <h4 className="font-semibold text-lg">{job?.title}</h4>

            <div className="flex flex-wrap gap-2">
              <Badge variant="md">
                <Users size={15} />({job?.number_of_positions} positions)
              </Badge>
              <Badge variant="md">
                <Clock size={15} /> {job?.duration}
              </Badge>
              <Badge variant="md">
                <CalendarDays size={15} />{" "}
                {format(job?.created_datetime, "dd-MMM-yyyy")}
              </Badge>
              <Badge variant="md">
                <MapPin size={15} /> {job?.locations}
                {/* <MapPin size={15} /> Various LGAs of {BADGES.lga} */}
              </Badge>
              <Badge variant="md">
                <Briefcase size={15} /> {job?.job_type}
              </Badge>
              {/* <Badge variant='md'>
                <PersonStanding size={15} /> {BADGES.lead}
              </Badge> */}
            </div>
            <p className="text-sm line-clamp-4">{job?.background}</p>
            <div className="flex justify-center">
              <Link
                to={generatePath(HrRoutes.ADVERTISEMENT_DETAIL, {
                  id: job?.id,
                })}
              >
                <Button variant="outline" className="text-red-600">
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
