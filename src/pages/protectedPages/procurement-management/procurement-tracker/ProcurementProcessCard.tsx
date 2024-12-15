import { ColumnDef } from "@tanstack/react-table";
// import FilterIcon from "components/icons/FilterIcon";
import Card from "components/shared/Card";
import DataTable from "components/Table/DataTable";
// import { Button } from "components/ui/button";
// import { SearchIcon } from "lucide-react";
// import React from "react";
import ProcurementTrackerAPI from "services/procurementApi/procurement-tracker";

const ProcurementProcessCard = () => {
  const { data } = ProcurementTrackerAPI.useGetProcurementTrackersQuery({});

  //   const columns: ColumnDef<ProcurementTrackerResults>[] = [
  const columns: ColumnDef<any>[] = [
    {
      header: "Donor Name",
      accessorKey: "donor_name",
      size: 150,
    },
    {
      header: "Procurement Process (drop down)",
      accessorKey: "programme_requesting",
      size: 120,
    },
    {
      header: "Esitmated PR value(NGN)",
      accessorKey: "office_requesting",
      size: 200,
    },

    {
      header: "Purchase Order No",
      accessorKey: "procurement_officer_responsible",
      size: 195,
    },
    {
      header: "Purchased Order value(NGN)",
      accessorKey: "pr_no. ",
      size: 150,
    },
    {
      header: "Actual Payment Request Valu(NGN)",
      accessorKey: "date_pr_received",
      size: 200,
    },
    {
      header: "Savings(+-)",
      accessorKey: "f-c-o",
      size: 150,
    },
    {
      header: "Currency",
      accessorKey: "description-of-goods-services",
      size: 150,
    },
    {
      header: "Supplier",
      accessorKey: "unit",
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

export default ProcurementProcessCard;
