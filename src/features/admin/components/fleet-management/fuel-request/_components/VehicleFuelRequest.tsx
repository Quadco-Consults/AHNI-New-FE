"use client";

import { useState } from "react";
import { fuelConsumptionColumns } from "@/features/admin/components/table-columns/fleet-management/fuel-consumption";
import DataTable from "@/components/Table/DataTable";
import { useGetAllFuelConsumptions } from "@/features/admin/controllers/fuelConsumptionController";
import FuelConsumptionFilters, {
  FuelConsumptionFilters as FilterType,
} from "./FuelConsumptionFilters";

const DEFAULT_FILTERS: FilterType = {
  search: "",
  status: "",
  date_from: "",
  date_to: "",
  vendor: "",
  location: "",
  driver: "",
  asset: "",
};

export default function VehicleFuelRequest() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterType>(DEFAULT_FILTERS);

  const { data: fuelConsumptions, isFetching } = useGetAllFuelConsumptions({
    page,
    size: 10,
    ...filters,
  });

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className='space-y-6'>
      <FuelConsumptionFilters
        currentFilters={filters}
        onFilterChange={handleFilterChange}
      />

      <DataTable
        columns={fuelConsumptionColumns}
        data={fuelConsumptions?.data?.results || []}
        isLoading={isFetching}
        pagination={{
          total: fuelConsumptions?.data?.paginator?.count ?? 0,
          pageSize: fuelConsumptions?.data?.paginator?.page_size ?? 0,
          onChange: (page: number) => setPage(page),
        }}
      />
    </div>
  );
}
