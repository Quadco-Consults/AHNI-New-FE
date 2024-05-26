/* eslint-disable react/no-unknown-property */
import { Link, generatePath } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import DataTable from "components/Table/DataTable";

const RiskManagement = () => {
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Link to={RouteEnum.PROGRAM_RISK_MANAGEMENT_CREATE}>
          <Button className="flex gap-2 py-6">
            <AddSquareIcon />
            New Risk Analysis Plan
          </Button>
        </Link>
      </div>

      <Card className="space-y-5">
        <div className="flex items-center justify-start gap-2">
          <span className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
            <SearchIcon />
            <input
              placeholder="Search"
              type="text"
              className="ml-2 h-6 border-none bg-none focus:outline-none outline-none"
            />
          </span>
          <Button className="shadow-sm" variant="ghost">
            <FilterIcon />
          </Button>
        </div>

        <DataTable data={data} columns={columns} />
      </Card>
    </div>
  );
};

export default RiskManagement;

type WorkPlanData = {
  risk_number: string;
  riskCategory: string;
  riskDesc: string;
  riskOwner: string;
  impactDesc: string;
  level: string;
  probability: string;
  total_risk_response: string;
  risk_response: string;
  timeline: string;
  status: string;
};

const columns: ColumnDef<WorkPlanData>[] = [
  {
    header: "Risk Number",
    accessorKey: "risk_number",
    size: 150,
  },
  {
    header: "Risk Category	",
    accessorKey: "riskCategory",
    size: 150,
  },
  {
    header: "Risk Description",
    accessorKey: "riskDesc",
    size: 200,
  },
  {
    header: "Risk Owner",
    accessorKey: "riskOwner",
    size: 150,
  },
  {
    header: "Impact Description",
    accessorKey: "impactDesc",
    size: 200,
  },
  {
    header: "Impact Level",
    accessorKey: "level",
    size: 150,
    cell: ({ getValue }) => {
      return (
        <Badge
          variant="default"
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Very High" && "bg-[#8DF384] text-[#021A0D]",
            getValue() === "Very Low" && "bg-[#F97066] text-[#1A0000]",
            getValue() === "High" && "bg-[#E0FDD6] text-[#096735]",
            getValue() === "Low" && "bg-[#FECDCA] text-[#7A271A]",
            getValue() === "Medium" && "bg-[#F3CB65] text-[#473200]"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },
  {
    header: "Probability of Occurrence",
    accessorKey: "probability",
    size: 150,
    cell: ({ getValue }) => {
      return (
        <Badge
          variant="default"
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Very High" && "bg-[#8DF384] text-[#021A0D]",
            getValue() === "Very Low" && "bg-[#F97066] text-[#1A0000]",
            getValue() === "High" && "bg-[#E0FDD6] text-[#096735]",
            getValue() === "Low" && "bg-[#FECDCA] text-[#7A271A]",
            getValue() === "Medium" && "bg-[#F3CB65] text-[#473200]"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },
  {
    header: "Total Risk on Response",
    accessorKey: "total_risk_response",
    size: 150,
    cell: ({ getValue }) => {
      return (
        <Badge
          variant="default"
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Very High" && "bg-[#8DF384] text-[#021A0D]",
            getValue() === "Very Low" && "bg-[#F97066] text-[#1A0000]",
            getValue() === "High" && "bg-[#E0FDD6] text-[#096735]",
            getValue() === "Low" && "bg-[#FECDCA] text-[#7A271A]",
            getValue() === "Medium" && "bg-[#F3CB65] text-[#473200]"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },
  {
    header: "Risk Response",
    accessorKey: "risk_response",
    size: 200,
  },
  {
    header: "Implementation Timeline",
    accessorKey: "timeline",
    size: 200,
  },
  {
    header: "Risk Status",
    accessorKey: "status",
    size: 150,
    cell: ({ getValue }) => {
      return (
        <Badge
          variant="default"
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Open" && "bg-[#1A9B3E] text-white",
            getValue() === "Closed" && "bg-[#4D4545] text-white"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },
  {
    header: "",
    id: "actions",
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

const ActionListAction = ({ data }: any) => {
  console.log(data);
  return (
    <div className="flex items-center gap-2">
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex gap-2 py-6">
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=" w-fit">
            <div className="flex flex-col items-start justify-between gap-1">
              <Link
                className="w-full"
                to={generatePath(RouteEnum.PROGRAM_FUND_REQUEST_DETAILS, {
                  id: "1",
                })}
              >
                <Button
                  className="w-full flex items-center justify-start gap-2"
                  variant="ghost"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_6296_42527)">
                      <path
                        opacity="0.4"
                        d="M11.9863 0.892096C12.4252 0.702635 12.9228 0.702635 13.3617 0.892096C13.5381 0.968245 13.6863 1.07818 13.8297 1.20392C13.9671 1.3244 14.1238 1.48103 14.3099 1.66716L14.3325 1.68981L14.3325 1.68982C14.5187 1.87593 14.6753 2.03256 14.7958 2.16997C14.9215 2.31338 15.0314 2.4616 15.1076 2.638C15.297 3.0769 15.297 3.57452 15.1076 4.01342C15.0314 4.18983 14.9215 4.33805 14.7958 4.48146C14.6753 4.61886 14.5187 4.77548 14.3326 4.96158L14.3325 4.96162L10.9065 8.38767L10.9065 8.38767C10.1461 9.14833 9.67577 9.6188 9.08003 9.90064C8.48429 10.1825 7.72797 10.257 6.6576 10.3624L6.13211 10.4143C5.9831 10.429 5.83534 10.3761 5.72946 10.2702C5.62358 10.1643 5.57072 10.0166 5.58543 9.86757L5.63728 9.34208C5.74271 8.27171 5.81721 7.51539 6.09904 6.91965C6.38087 6.3239 6.85135 5.85359 7.61201 5.09319L11.038 1.66718L11.038 1.66717C11.2242 1.48103 11.3808 1.3244 11.5182 1.20392C11.6616 1.07818 11.8098 0.968245 11.9863 0.892096Z"
                        fill="#BE8800"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0.75 11.0833C0.75 10.0708 1.57081 9.25 2.58333 9.25H4.08333C4.45152 9.25 4.75 9.54848 4.75 9.91667C4.75 10.2849 4.45152 10.5833 4.08333 10.5833H2.58333C2.30719 10.5833 2.08333 10.8072 2.08333 11.0833C2.08333 11.3595 2.30719 11.5833 2.58333 11.5833H8.91667C9.92919 11.5833 10.75 12.4041 10.75 13.4167C10.75 14.4292 9.92919 15.25 8.91667 15.25H7.41667C7.04848 15.25 6.75 14.9515 6.75 14.5833C6.75 14.2151 7.04848 13.9167 7.41667 13.9167H8.91667C9.19281 13.9167 9.41667 13.6928 9.41667 13.4167C9.41667 13.1405 9.19281 12.9167 8.91667 12.9167H2.58333C1.57081 12.9167 0.75 12.0959 0.75 11.0833Z"
                        fill="#BE8800"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_6296_42527">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  Change Risk Status
                </Button>
              </Link>

              <Button
                className="w-full flex items-center justify-start gap-2"
                variant="ghost"
              >
                <DeleteIcon />
                delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>
    </div>
  );
};

const data: WorkPlanData[] = Array(10).fill({
  risk_number: "AR 001",
  riskCategory: "Regulatory Compliance",
  riskDesc:
    "There is possibility of delaying in remitting taxes at the stipulated time.",
  riskOwner: "Finance Department",
  impactDesc: "Government could impose penalty for non-compliance. ",
  level: "Low",
  probability: "Very High",
  total_risk_response: "Very Low",
  risk_response:
    "Finance team will ensure that adherence to the regulatory timeline.",
  timeline: "Immediate",
  status: "Closed",
});
