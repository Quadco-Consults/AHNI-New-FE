import { Link, generatePath } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import StakeholderManagementAPI from "services/programsApi/stakeholder-management";
import { StakeholderMgtProjectsData } from "definations/program-types/stakeholder-management";
import BreadcrumbCard from "components/shared/Breadcrumb";

const AnalysisMapping = () => {
  const { data, isLoading } =
    StakeholderManagementAPI.useGetStakeholderMgtProjectsQuery({});

  const columns: ColumnDef<StakeholderMgtProjectsData>[] = [
    {
      header: "Project Name",
      accessorKey: "title",
      size: 200,
    },
    {
      header: "Location",
      accessorKey: "locations",
      size: 200,
    },
    {
      header: "Start Date",
      accessorKey: "start_date",
      size: 200,
    },
    {
      header: "End Date",
      accessorKey: "end_date",
      size: 200,
    },
    {
      header: "",
      id: "actions",
      size: 80,
      cell: ({ row }) => <ActionListAction data={row.original} />,
    },
  ];

  const ActionListAction = ({ data }: any) => {
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
                  to={generatePath(
                    RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS_DETAILS,
                    {
                      id: data?.id,
                    }
                  )}
                >
                  <Button
                    className="w-full flex items-center justify-start gap-2"
                    variant="ghost"
                  >
                    <EyeIcon />
                    View
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

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Stakeholder Management", icon: true },
    { name: "Analysis & Mapping", icon: false },
  ];

  return (
    <div className="space-y-10">
      <BreadcrumbCard list={breadcrumbs} />
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

        <DataTable data={data || []} columns={columns} isLoading={isLoading} />
      </Card>
    </div>
  );
};

export default AnalysisMapping;
