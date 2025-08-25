"use client";

import { useDebounce } from "ahooks";
import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/Card";
import { awardedBeneficiariesColumn } from "@/features/contracts-grants/components/table-columns/sub-grant/awarded-beneficiaries";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import { useState } from "react";
import Link from "next/link";
import { useGetAllSubGrants } from "@/features/contracts-grants/controllers/subGrantController";

export default function AwardedBeneficiaries() {
    const [page, setPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");

    return (
        <section className="space-y-5">
            <Card>
                <TableFilters
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                >
                    <DataTable
                        columns={awardedBeneficiariesColumn}
                        data={[]}
                        isLoading={false}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
