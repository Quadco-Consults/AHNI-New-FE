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
  },
  {
    header: "NAIJA SUPPLIES LTD.",
    accessorKey: "supplies",
    size: 200,
    cell: ({ row }) => <SuppliesAction data={row.original} />,
  },
  {
    header: "HEALTHEQUIP ENTERPRISES",
    accessorKey: "enterprises",
    size: 200,
    cell: ({ row }) => <EnterpriseAction data={row.original} />,
  },
  {
    header: "LIFESAVERS INC.",
    accessorKey: "lifesavers",
    size: 200,
    cell: ({ row }) => <LifeAction data={row.original} />,
  },
  {
    header: "MEDISUPPLY HUB",
    accessorKey: "hub",
    size: 200,
    cell: ({ row }) => <HubAction data={row.original} />,
  },
  {
    header: "GLOBAL HEALTH DISTRIBUTORS",
    accessorKey: "global",
    size: 200,
    cell: ({ row }) => <GlobalAction data={row.original} />,
  },
];

const data = [
  {
    vendor: "Total Items",
    supplies: ["3"],
    enterprises: ["3"],
    lifesavers: ["3"],
    hub: ["3"],
    global: ["3"],
  },
  {
    vendor: "Items",
    supplies: [
      "Malaria Test Kits - ₦1,000",
      "Mosquito Nets - ₦1,500",
      "Vaccines - ₦3,000",
    ],
    enterprises: [
      "Malaria Test Kits - ₦1,000",
      "Mosquito Nets - ₦1,500",
      "Vaccines - ₦3,000",
    ],
    lifesavers: [
      "Malaria Test Kits - ₦1,000",
      "Mosquito Nets - ₦1,500",
      "Vaccines - ₦3,000",
    ],
    hub: [
      "Malaria Test Kits - ₦1,000",
      "Mosquito Nets - ₦1,500",
      "Vaccines - ₦3,000",
    ],
    global: [
      "Malaria Test Kits - ₦1,000",
      "Mosquito Nets - ₦1,500",
      "Vaccines - ₦3,000",
    ],
  },
  {
    vendor: "Total",
    supplies: ["₦6,000"],
    enterprises: ["₦6,100"],
    lifesavers: ["₦4,000"],
    hub: ["₦5,000"],
    global: ["₦2,000"],
  },
];

const SuppliesAction = ({ data }) => {
  return (
    <div className=" text-end">
      {data.supplies.map((el, index) => (
        <h6 key={index}>{el}</h6>
      ))}
    </div>
  );
};
const EnterpriseAction = ({ data }) => {
  return (
    <div className=" text-end">
      {data.enterprises.map((el, index) => (
        <h6 key={index}>{el}</h6>
      ))}
    </div>
  );
};
const LifeAction = ({ data }) => {
  return (
    <div className=" text-end">
      {data.lifesavers.map((el, index) => (
        <h6 key={index}>{el}</h6>
      ))}
    </div>
  );
};
const HubAction = ({ data }) => {
  return (
    <div className=" text-end">
      {data.hub.map((el, index) => (
        <h6 key={index}>{el}</h6>
      ))}
    </div>
  );
};
const GlobalAction = ({ data }) => {
  return (
    <div className=" text-end">
      {data.global.map((el, index) => (
        <h6 key={index}>{el}</h6>
      ))}
    </div>
  );
};
