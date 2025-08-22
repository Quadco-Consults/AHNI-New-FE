import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import { fuelRequestConsumptionColumns } from "components/Table/columns/admin/fleet-management/fuel-request-consumption";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { useParams, useSearchParams } 
import { useGetAllFuelRequestsQuery } from "@/features/admin/controllers/fuelRequestController";
import VendorsAPI from "@/features/procurement/controllers/vendorController";

export default function ViewVehicleFuelConsumption() {
    const [page, setPage] = useState(1);

    const { id } = useParams();

    const [searchParams] = useSearchParams();

    const type = searchParams.get("type");

    const { data: vendor } = VendorsAPI.useGetVendorQuery(
        id && type === "vendor"  || "", !!? { path: { id } } : "", false
    );

    const filter = type === "vehicle" ? { asset: id } : { vendor: id };

    const { data, isFetching } = useGetAllFuelRequestsQuery(
        id
            ? {
                  page,
                  size: 10,
                  ...filter,
              }
            : "", false
    );

    return (
        <section>
            <div className="flex items-center justify-between">
                <BackNavigation
                    extraText={`Fuel Requests ${
                        type === "vendor" ? vendor?.data.company_name || "" : ""
                    }`}
                />

                {type === "vendor" && (
                    <Button>
                        <DownloadIcon /> Download History
                    </Button>
                )}
            </div>
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
        </section>
    );
}
