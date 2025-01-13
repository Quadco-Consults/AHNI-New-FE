import { ColumnDef } from "@tanstack/react-table";
// import FilterIcon from "components/icons/FilterIcon";
import Card from "components/shared/Card";
import DataTable from "components/Table/DataTable";
// import { Button } from "components/ui/button";
// import { SearchIcon } from "lucide-react";
// import React from "react";
import ProcurementTrackerAPI from "services/procurementApi/procurement-tracker";

const SummaryCard = () => {
  const { data } = ProcurementTrackerAPI.useGetProcurementTrackersQuery({});

  //   const columns: ColumnDef<ProcurementTrackerResults>[] = [
  const columns: ColumnDef<any>[] = [
    {
      header: "Donor Name",
      accessorKey: "donor_name",
      size: 150,
    },
    {
      header: "Programme Requesting",
      accessorKey: "programme_requesting",
      size: 150,
    },
    {
      header: "Office Requesting",
      accessorKey: "office_requesting",
      size: 200,
    },

    {
      header: "Procurement Officer Responsible",
      accessorKey: "procurement_officer_responsible",
      size: 195,
    },
    {
      header: "PR No.",
      accessorKey: "pr_no. ",
      size: 150,
    },
    {
      header: "Date PR Received",
      accessorKey: "date_pr_received",
      size: 200,
    },
    {
      header: "Item Category (drop down)",
      accessorKey: "item_category_drop_down",
      size: 150,
    },
    {
      header: "Date Goods are Required",
      accessorKey: "date-goods-are-required",
      size: 150,
    },
    {
      header: "Date Procurement Process Initiated",
      accessorKey: "date-procurement-process-initiated",
      size: 160,
    },
    {
      header: "FCO",
      accessorKey: "f-c-o",
      size: 150,
    },
    {
      header: "Description of goods/ services",
      accessorKey: "description-of-goods-services",
      size: 350,
    },
    {
      header: "Unit",
      accessorKey: "unit",
      size: 150,
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      size: 150,
    },
  ];
  return (
    <Card className='space-y-5'>
      {/* <div className='flex items-center justify-start gap-2'>
        <span className='flex w-1/3 items-center rounded-lg border px-2 py-2'>
          <SearchIcon />
          <input
            placeholder='Search'
            type='text'
            className='ml-2 h-6 border-none bg-none outline-none focus:outline-none'
          />
        </span>
        <Button className='shadow-sm' variant='ghost'>
          <FilterIcon />
        </Button>
      </div> */}

      <DataTable
        //   @ts-ignore
        data={data?.results || []}
        columns={columns}
        // isLoading={isLoading}
      />
    </Card>
  );
};

export default SummaryCard;
