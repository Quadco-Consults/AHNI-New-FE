import Card from "components/shared/Card";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Input } from "components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "components/ui/button";
import { Calendar } from "components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { cn } from "lib/utils";
import { format } from "date-fns";
import Table from "lib/react-table/Table";
import useTable from "hooks/useTable";

const CompetitiveAnalysis = () => {
  const [date, setDate] = useState();

  const tableInstance = useTable({
    columns,
    data,
    //  state: { pagination },
    //  pageCount: customersQueryResult?.data?.number_of_pages,
    //  manualPagination: true,
    //  onPaginationChange: setPagination,
  });

  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-lg font-bold">Competitive Bid Analysis</h4>
        <h6>
          Precurement -{" "}
          <span className="text-black font-medium">
            Competitive Bid Analysis
          </span>
        </h6>
      </div>

      <Card className="space-y-10">
        <Select>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select CBA" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* <SelectLabel>Fruits</SelectLabel> */}
              <SelectItem value="apple">
                Lifespring Immunization Movement
              </SelectItem>
              <SelectItem value="banana">
                PureFlow Water Sanitation Drive
              </SelectItem>
              <SelectItem value="blueberry">Pathway to Prevention</SelectItem>
              <SelectItem value="grapes">Empower Nutrition Network</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex items-center justify-between">
          <div>
            <Input
              type="search"
              placeholder="Search CBA"
              className="w-[250px]"
            />
          </div>

          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick date range</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button>Export CBA</Button>
          </div>
        </div>

        <Table
          instance={tableInstance}
          // loading={customersQueryResult.isFetching}
          // error={customersQueryResult.isError}
          // onReload={customersQueryResult.refetch}
        />
      </Card>
    </div>
  );
};

export default CompetitiveAnalysis;

const columns = [
  {
    header: "VENDOR",
    accessorKey: "vendor",
    // cell: ({ getValue }) => {
    //   return (
    //     <div className="flex items-center gap-3">
    //       <svg
    //         width="27"
    //         height="27"
    //         viewBox="0 0 27 27"
    //         fill="none"
    //         xmlns="http://www.w3.org/2000/svg"
    //       >
    //         <path
    //           d="M12.6887 5.60098L12.3096 4.68737C12.1049 4.16256 11.7655 3.73885 11.2912 3.41626C10.8194 3.09608 10.2946 2.92756 9.71679 2.91071H7.53568C6.84235 2.91071 6.19837 3.04552 5.60374 3.31515C4.99466 3.57034 4.46624 3.92182 4.01846 4.36959C3.57068 4.81737 3.2192 5.3458 2.96401 5.95487C2.69439 6.5495 2.55957 7.19348 2.55957 7.88682V18.8538C2.55957 18.8538 2.55957 18.8586 2.55957 18.8682C2.55957 18.8754 2.55957 18.879 2.55957 18.879C2.55957 19.659 2.71124 20.3957 3.01457 21.089C3.32031 21.7824 3.73077 22.3878 4.24596 22.9054C4.76355 23.4206 5.36901 23.8311 6.06235 24.1368C6.75568 24.4402 7.49235 24.5918 8.27235 24.5918C8.27235 24.5918 8.27596 24.5918 8.28318 24.5918C8.29281 24.5918 8.29763 24.5918 8.29763 24.5918H18.5026C18.5026 24.5918 18.5074 24.5918 18.5171 24.5918C18.5243 24.5918 18.5279 24.5918 18.5279 24.5918C19.3079 24.5918 20.0446 24.4402 20.7379 24.1368C21.4312 23.8311 22.0367 23.4206 22.5543 22.9054C23.0695 22.3878 23.4799 21.7824 23.7857 21.089C24.089 20.3957 24.2407 19.659 24.2407 18.879C24.2407 18.879 24.2407 18.8754 24.2407 18.8682C24.2407 18.8586 24.2407 18.8538 24.2407 18.8538V13.0904C24.2407 12.296 24.089 11.5509 23.7857 10.8551C23.4799 10.1618 23.0695 9.55756 22.5543 9.04237C22.0367 8.52478 21.4312 8.11432 20.7379 7.81098C20.0446 7.52209 19.2995 7.37765 18.5026 7.37765H15.2526C14.6773 7.3608 14.1609 7.19228 13.7035 6.87209C13.2485 6.5495 12.9186 6.13422 12.714 5.62626L12.6887 5.60098Z"
    //           fill="#FD4A36"
    //         />
    //         <g opacity="0.3">
    //           <path
    //             d="M12.3096 4.73798L12.6887 5.60103C12.9102 6.12585 13.2533 6.55316 13.7179 6.88298C14.1825 7.21279 14.711 7.3777 15.3032 7.3777H18.5532C19.6365 7.3777 20.6187 7.64853 21.4998 8.1902C22.381 8.73186 23.0671 9.43483 23.5582 10.2991L23.5835 10.3496C23.5305 9.55279 23.3355 8.81612 22.9985 8.13964C22.6759 7.46316 22.2486 6.87455 21.7165 6.37381C21.1821 5.87548 20.5598 5.48187 19.8496 5.19298C19.1562 4.90649 18.4111 4.75483 17.6143 4.73798H12.3096Z"
    //             fill="#FD4A36"
    //           />
    //         </g>
    //       </svg>
    //       <h6>{getValue()}</h6>
    //     </div>
    //   );
    // },
  },
  {
    header: "NAIJA SUPPLIES LTD.",
    accessorKey: "supplies",
  },
  {
    header: "HEALTHEQUIP ENTERPRISES",
    accessorKey: "enterprises",
  },
  {
    header: "LIFESAVERS INC.",
    accessorKey: "lifesavers",
  },
  {
    header: "MEDISUPPLY HUB",
    accessorKey: "hub",
  },
  {
    header: "GLOBAL HEALTH DISTRIBUTORS",
    accessorKey: "global",
  },
];

const data = [];
