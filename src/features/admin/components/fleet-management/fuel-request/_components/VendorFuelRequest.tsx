"use client";

import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { fuelRequestVendorColumns } from "@/features/admin/components/table-columns/fleet-management/fuel-request-vendor";
import { useGetFuelVendors } from "@/features/admin/controllers/fuelConsumptionController";

export default function VendorFuelRequest() {
  const { data, isFetching } = useGetFuelVendors({
    enabled: true,
  });

  return (
    <TableFilters>
      <DataTable
        columns={fuelRequestVendorColumns}
        data={data?.data.results || []}
        isLoading={isFetching}
        pagination={{
          total: data?.data.pagination.count ?? 0,
          pageSize: data?.data.pagination.page_size ?? 0,
          onChange: () => {}, // No pagination needed for unique vendors list
        }}
      />
    </TableFilters>
  );
}
