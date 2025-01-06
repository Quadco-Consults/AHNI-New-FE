import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { fuelRequestVendorColumns } from "components/Table/columns/admin/fleet-management/fuel-request-vendor";
import VendorsAPI from "services/procurementApi/vendors";

export default function VendorFuelRequest() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = VendorsAPI.useGetVendorsQuery({
        page,
        size: 10,
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
                    onChange: (page: number) => setPage(page),
                }}
            />
        </TableFilters>
    );
}
