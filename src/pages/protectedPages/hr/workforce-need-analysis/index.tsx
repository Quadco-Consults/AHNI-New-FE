/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "atoms/FormButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import React from "react";

import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "components/ui/button";
import { generatePath, Link, useNavigate } from "react-router-dom";
import { HrRoutes, RouteEnum } from "constants/RouterConstants";
import SearchBar from "atoms/SearchBar";
import { Checkbox } from "components/ui/checkbox";
import IconButton from "components/shared/IconButton";
import { Icon } from "@iconify/react";
import { useGetWorkforceNeedAnalysisQuery } from "services/hrApi/hr-workforce-need-analysis";

const WFNA: React.FC = () => {
  const navigate = useNavigate();
  const {data, isLoading:loadingWorkforce} = useGetWorkforceNeedAnalysisQuery({}) 
  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      size: 50,
      header: ({ table }) => {
        return (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
            }}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
          />
        );
      },
    },
    {
      header: "Position",
      accessorKey: "position.name",
      size: 200, 
    },
    {
      header: "Location",
      accessorKey: "location.name",
      size: 200, 
    },
    {
      header: "Current Staff",
      accessorKey: "current_staff_count",
      size: 200, 
    },
    {
      header: "Required Staff Based on WISN",
      accessorKey: "wisn_required_staff_count",
      size: 250,
    },
    {
      header: "Shortage or excess",
      accessorKey: "shortage_excess_count",
      size: 200,
    },
    {
      header: "Workforce Problem",
      accessorKey: "workforce_problem",
      size: 200, 
    },
    {
      header: "WISN Ratio",
      accessorKey: "wisn_ratio",
      size: 200, 
    },

    {
      header: "Workload Pressure",
      accessorKey: "workload_problem",
      size: 200, 
    },
    /* {
      header: "Actions",
      id: "actions",
      size: 150,
      cell: ({ row }) => <ActionListAction data={row} />,
    }, */
  ];

  const ActionListAction = ({ data }: any) => {
     
    return (
      <div className='flex gap-2'>
        <Link
          to={generatePath(RouteEnum.VENDOR_MANAGEMENT_DETAILS, { id: "1" })}
        >
          <IconButton className='bg-[#F9F9F9] hover:text-primary'>
            <Icon icon='ph:eye-duotone' fontSize={15} />
          </IconButton>
        </Link>
        <IconButton className='bg-[#F9F9F9] hover:text-primary'>
          <Icon icon='ant-design:delete-twotone' fontSize={15} />
        </IconButton>
      </div>
    );
  };

  return (
    <div className='flex flex-col justify-center items-center gap-y-[1rem]'>
      <div className='w-full flex justify-between items-center'>
        <div className='flex items-center justify-center'>
          <SearchBar onchange={() => ""} />

          <Button variant='ghost' className=''>
            <FilterIcon2 />
          </Button>
        </div>
        <div className='flex items-center'>
          <FormButton
            onClick={() => {
              navigate(HrRoutes.WORKFORCE_NEED_ANALYSIS_CREATE);
            }}
          >
            <AddSquareIcon />
            <p>Create Workforce Need Analysis</p>
          </FormButton>
        </div>
      </div>
      <div className='w-full'>
        <DataTable
          columns={columns} 
          data={data?.data?.results ??[]}
          isLoading={loadingWorkforce}
          pagination={{
            total: 10,
            pageSize: 10,
            onChange: (page: number) => {},
          }}
        />
      </div>
    </div>
  );
};

export default WFNA;
