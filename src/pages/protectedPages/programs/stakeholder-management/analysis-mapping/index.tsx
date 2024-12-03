/* eslint-disable react/no-unknown-property */
import { Link, generatePath } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import {
    useDeleteStakeholderRegisterMutation,
    useGetAllStakeholderRegisterQuery,
} from "services/programsApi/stakeholder";
import { TStakeholderRegisterResponse } from "definations/program-validator";
import { toast } from "sonner";

const StakeholderAnalysisMapping = () => {
    const { data, isLoading } = useGetAllStakeholderRegisterQuery({
        no_paginate: false,
    });
    const [deleteStakeholderRegister, { isLoading: isDeleteLoading }] =
        useDeleteStakeholderRegisterMutation();

    const columns: ColumnDef<TStakeholderRegisterResponse>[] = [
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

    return (
        <div className="space-y-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Programs</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Icon icon="iconoir:slash" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Stakeholder Management</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Icon icon="iconoir:slash" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Analysis & Mapping</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="space-y-5">
                <div className="flex items-center justify-start gap-2">
                    <span className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
                        <SearchIcon />
                        <input
                            placeholder="Search"
                            type="text"
                            className="ml-2 h-6 w-[350px] border-none bg-none focus:outline-none outline-none"
                        />
                    </span>
                    <Button className="shadow-sm" variant="ghost">
                        <FilterIcon />
                    </Button>
                </div>

                <DataTable
                    data={data?.data.results || []}
                    // @ts-ignore
                    columns={columns}
                    isLoading={isLoading || isDeleteLoading}
                />
            </Card>
        </div>
    );
};

export default StakeholderAnalysisMapping;
