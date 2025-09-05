"use client";

import { fuelConsumptionColumns } from "@/features/admin/components/table-columns/fleet-management/fuel-consumption";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useState } from "react";
import { useGetAllFuelConsumptions } from "@/features/admin/controllers/fuelConsumptionController";

export default function VehicleFuelRequest() {
  const [page, setPage] = useState(1);

  const { data: fuelConsumptions, isFetching } = useGetAllFuelConsumptions({
    page,
    size: 10,
  });

  return (
    <TableFilters>
      <DataTable
        columns={fuelConsumptionColumns}
        data={fuelConsumptions?.data.results || []}
        isLoading={isFetching}
        pagination={{
          total: fuelConsumptions?.data?.paginator?.count ?? 0,
          pageSize: fuelConsumptions?.data?.paginator?.page_size ?? 0,
          onChange: (page: number) => setPage(page),
        }}
      />
    </TableFilters>
  );
}
