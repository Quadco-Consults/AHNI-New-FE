import { skipToken } from "@reduxjs/toolkit/query/react";
import BackNavigation from "atoms/BackNavigation";
import Card from "components/shared/Card";
import { fuelRequestConsumptionColumns } from "components/Table/columns/admin/fleet-management/fuel-request-consumption";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetAllFuelRequestsQuery } from "services/admin/fleet-management/fuel-request";

export default function ViewVehicleFuelConsumption() {
    const [page, setPage] = useState(1);

    const { id } = useParams();

    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");

    const filter = type === "vehicle" ? { asset: id } : { vendor: id };

    const { data, isFetching } = useGetAllFuelRequestsQuery(
        id
            ? {
                  page,
                  size: 10,
                  ...filter,
              }
            : skipToken
    );

    return (
        <>
            <BackNavigation extraText="Fuel Requests" />
            <Card className="space-y-6">
                <TableFilters>
                    <DataTable
                        columns={fuelRequestConsumptionColumns}
                        data={data?.data.results || []}
                        isLoading={isFetching}
                        pagination={{
                            total: data?.data.pagination.count ?? 0,
                            pageSize: data?.data.pagination.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </>
    );
}
