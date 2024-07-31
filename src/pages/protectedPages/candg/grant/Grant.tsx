/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "atoms/FormButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import React, { useMemo } from "react";

import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "components/ui/button";
import { generatePath, Link, useNavigate } from "react-router-dom";
import { CandGRoutes, RouteEnum } from "constants/RouterConstants";
import SearchBar from "atoms/SearchBar";
import { Checkbox } from "components/ui/checkbox";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import IconButton from "components/shared/IconButton";
import { Icon } from "@iconify/react";
import { grantsApi } from "services/cAndGApi/grants";

const Grant: React.FC = () => {
  const navigate = useNavigate();
  const getGrants = grantsApi.useGetGrantsQuery({});
  // console.log(getGrants);

  const grantsArray = useMemo(() => {
    return getGrants?.data?.results || [];
  }, [getGrants]);

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
    // {
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllRowsSelected()}
    //       onCheckedChange={table.getToggleAllRowsSelectedHandler()}
    //     />
    //   ),
    //   accessorKey: "isSelected",
    //   size: 50,
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={row.getToggleSelectedHandler()}
    //     />
    //   ),
    // },
    {
      header: "Project Name",
      accessorKey: "project",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.project?.title}</p>,
    },
    {
      header: "Location",
      accessorKey: "location",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.location?.name}</p>,
    },
    {
      header: "Funding source",
      accessorKey: "grantor",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.grantor?.name}</p>,
    },
    {
      header: "Award Amount",
      accessorKey: "award_amount",
      size: 200,
    },
    {
      header: "Monthly Spend",
      accessorKey: "monthly_spend",
      size: 200,
    },
    {
      header: "Intervention",
      accessorKey: "intervention_area",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.intervention_area?.name}</p>,
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.status || "-"}</p>,
    },
  ];

  const ActionListAction = ({ data }: any) => {
    console.log(data);
    return (
      <div className="flex gap-2">
        <Link to={generatePath(RouteEnum.VENDOR_MANAGEMENT_DETAILS, { id: "1" })}>
          <IconButton className="bg-[#F9F9F9] hover:text-primary">
            <Icon icon="ph:eye-duotone" fontSize={15} />
          </IconButton>
        </Link>
        <IconButton className="bg-[#F9F9F9] hover:text-primary">
          <Icon icon="ant-design:delete-twotone" fontSize={15} />
        </IconButton>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center gap-y-[1rem]">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center justify-center">
          <SearchBar onchange={() => ""} />

          <Button variant="ghost" className="">
            <FilterIcon2 />
          </Button>
        </div>
        <div className="flex items-center">
          <FormButton
            onClick={() => {
              navigate(CandGRoutes.NEW_GRANT);
            }}
          >
            <AddSquareIcon />
            <p>New Grant</p>
          </FormButton>
        </div>
      </div>
      <div className="w-full">
        <DataTable columns={columns} onRowClick={() => navigate(CandGRoutes.GRANT_DETAILS)} data={grantsArray} isLoading={getGrants.isLoading} />
      </div>
    </div>
  );
};

export default Grant;
