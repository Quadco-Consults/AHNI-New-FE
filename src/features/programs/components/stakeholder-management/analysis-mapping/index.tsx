"use client";
import Card from "components/Card";
import { Button } from "components/ui/button";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useGetAllStakeholderRegisterQuery } from "@/features/programs/controllers/stakeholderController";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import { useState } from "react";
import { TStakeholderRegisterData } from "features/programs/types/program-validator";
import { useDebounce } from "ahooks";
import TableFilters from "components/Table/TableFilters";

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Stakeholder Management", icon: true },
    { name: "Analysis & Mapping", icon: false },
];

export default function StakeholderAnalysisMappingPage() {
    const [page, setPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 1000,
    });

    const { data: stakeholderRegister, isFetching } =
        useGetAllStakeholderRegisterQuery({
            page,
            size: 10,
            search: debouncedSearchQuery,
        });

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            <Card>
                <TableFilters
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                >
                    <DataTable
                        data={stakeholderRegister?.results || []}
                        columns={columns}
                        isLoading={isFetching}
                        pagination={{
                            total:
                                stakeholderRegister?.pagination?.count ?? 0,
                            pageSize:
                                stakeholderRegister?.pagination?.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </div>
    );
}

const columns: ColumnDef<TStakeholderRegisterData>[] = [
    {
        header: "Stakeholder Name",
        id: "name",
        accessorFn: (data) => `${data.name}`,
        size: 250,
    },
    {
        header: "Physical Office Address",
        id: "office_address",
        accessorFn: (data) => `${data.office_address}`,
        size: 250,
    },
    {
        header: "Institution/Organization",
        id: "organization",
        accessorFn: (data) => `${data.organization}`,
        size: 300,
    },
    {
        header: "Designation",
        id: "designation",
        accessorFn: (data) => `${data.designation}`,
    },
    {
        header: "State",
        id: "state",
        accessorFn: (data) => `${data.state}`,
        size: 150,
    },
    {
        header: "Phone Number",
        id: "phone_number",
        accessorFn: (data) => `${data.phone_number}`,
        size: 150,
    },
    {
        header: "E-Mail",
        id: "email",
        accessorFn: (data) => `${data.email}`,
        size: 200,
    },
    {
        header: "Project Role",
        id: "project_role",
        accessorFn: (data) => `${data.project_role}`,
        size: 200,
    },
    {
        header: "Importance",
        id: "importance",
        accessorFn: (data) => `${data.importance}`,
        size: 200,
    },
    {
        header: "Influence",
        id: "influence",
        accessorFn: (data) => `${data.influence}`,
        size: 200,
    },
    {
        header: "Score",
        id: "score",
        accessorFn: (data) => `${data.score}`,
        size: 200,
    },
    {
        header: "Major Concerns",
        id: "major_concerns",
        accessorFn: (data) => `${data.major_concerns}`,
        size: 200,
    },

    {
        header: "Relationship Owner",
        id: "relationship_owner",
        accessorFn: (data) => `${data.relationship_owner}`,
        size: 200,
    },
];
