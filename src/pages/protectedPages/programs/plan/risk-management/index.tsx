/* eslint-disable react/no-unknown-property */
import { Link } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import DataTable from "components/Table/DataTable";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
    useDeleteRiskManagementPlanMutation,
    useGetAllRiskManagementPlansQuery,
    usePatchRiskManagementPlanMutation,
} from "services/programsApi/risk-plans";
import { TRiskPlanPlanManagementResponse } from "definations/program-validator";
import EditIcon from "components/icons/EditIcon";
import PencilIcon from "components/icons/PencilIcon";
import { FormEvent, useState } from "react";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType, mediumDailogScreen } from "constants/dailogs";

const RiskManagement = () => {
    const { data, isLoading } = useGetAllRiskManagementPlansQuery({
        no_paginate: false,
    });

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
                        <BreadcrumbPage>Plans</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Icon icon="iconoir:slash" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Risk Management Plan</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-end">
                <Link to={RouteEnum.PROGRAM_RISK_MANAGEMENT_CREATE}>
                    <Button className="flex gap-2 py-6">
                        <AddSquareIcon />
                        New Risk Management
                    </Button>
                </Link>
            </div>

            <Card className="space-y-5">
                <div className="flex items-center justify-start gap-2">
                    <span className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
                        <SearchIcon />
                        <input
                            placeholder="Search"
                            type="text"
                            className="ml-2 h-6 border-none bg-none focus:outline-none outline-none"
                        />
                    </span>
                    <Button className="shadow-sm" variant="ghost">
                        <FilterIcon />
                    </Button>
                </div>

                <DataTable
                    data={data?.data.results || []}
                    columns={columns}
                    isLoading={isLoading}
                />
            </Card>
        </div>
    );
};

export default RiskManagement;

const columns: ColumnDef<TRiskPlanPlanManagementResponse>[] = [
    {
        header: "Risk Number",
        accessorKey: "risk_number",
        size: 150,
    },

    {
        header: "Risk Description",
        accessorKey: "risk_description",
        size: 300,
    },

    {
        header: "Impact Description",
        accessorKey: "impact_description",
        size: 200,
    },

    {
        header: "Impact Level",
        accessorKey: "impact_level",
        size: 150,
        cell: ({ getValue }) => {
            return (
                <Badge
                    variant="default"
                    className={cn(
                        "p-1 rounded-lg",
                        getValue() === "VERY_HIGH" &&
                            "bg-[#8DF384] text-[#021A0D]",
                        getValue() === "VERY_LOW" &&
                            "bg-[#F97066] text-[#1A0000]",
                        getValue() === "HIGH" && "bg-[#E0FDD6] text-[#096735]",
                        getValue() === "LOW" && "bg-[#FECDCA] text-[#7A271A]",
                        getValue() === "MEDIUM" && "bg-[#F3CB65] text-[#473200]"
                    )}
                >
                    {getValue() as string}
                </Badge>
            );
        },
    },

    {
        header: "Occurence Probability",
        accessorKey: "occurence_probability",
        size: 150,
        cell: ({ getValue }) => {
            return (
                <Badge
                    variant="default"
                    className={cn(
                        "p-1 rounded-lg",
                        getValue() === "VERY_HIGH" &&
                            "bg-[#8DF384] text-[#021A0D]",
                        getValue() === "VERY_LOW" &&
                            "bg-[#F97066] text-[#1A0000]",
                        getValue() === "HIGH" && "bg-[#E0FDD6] text-[#096735]",
                        getValue() === "LOW" && "bg-[#FECDCA] text-[#7A271A]",
                        getValue() === "MEDIUM" && "bg-[#F3CB65] text-[#473200]"
                    )}
                >
                    {getValue() as string}
                </Badge>
            );
        },
    },

    {
        header: "Total Risk on Response",
        accessorKey: "total_risk_on_response",
        size: 150,
        cell: ({ getValue }) => {
            return (
                <Badge
                    variant="default"
                    className={cn(
                        "p-1 rounded-lg",
                        getValue() === "VERY_HIGH" &&
                            "bg-[#8DF384] text-[#021A0D]",
                        getValue() === "VERY_LOW" &&
                            "bg-[#F97066] text-[#1A0000]",
                        getValue() === "HIGH" && "bg-[#E0FDD6] text-[#096735]",
                        getValue() === "LOW" && "bg-[#FECDCA] text-[#7A271A]",
                        getValue() === "MEDIUM" && "bg-[#F3CB65] text-[#473200]"
                    )}
                >
                    {getValue() as string}
                </Badge>
            );
        },
    },

    {
        header: "Risk Response",
        accessorKey: "risk_response",
        size: 350,
    },

    {
        header: "Implementation Timeline",
        accessorKey: "implementation_timeline",
        size: 200,
        cell: ({ getValue }) => (
            <Badge className="bg-gray-500">{getValue() as string}</Badge>
        ),
    },
    {
        header: "Risk Status",
        accessorKey: "risk_status",
        size: 200,
        cell: ({ getValue }) => {
            return (
                <Badge
                    variant="default"
                    className={cn(
                        "p-1 rounded-lg",
                        getValue() === "OPEN" && "bg-[#1A9B3E] text-white",
                        getValue() === "CLOSED" && "bg-[#4D4545] text-white",
                        getValue() === "MITIGATED" &&
                            "bg-[#F97066] text-white"
                    )}
                >
                    {getValue() as string}
                </Badge>
            );
        },
    },

    {
        header: "Risk Category",
        accessorKey: "risk_category",
        size: 180,
    },

    {
        header: "Risk Owner",
        accessorKey: "risk_owner",
        size: 200,
    },

    {
        header: "",
        id: "actions",
        size: 80,
        cell: ({ row }) => <ActionListAction data={row.original} />,
    },
];

const ActionListAction = ({ data }: any) => {
    const [deleteRiskManagementPlan] = useDeleteRiskManagementPlanMutation();

    const dispatch = useAppDispatch();

    const handleDelete = async () => {
        try {
            await deleteRiskManagementPlan(data.id).unwrap();
            toast.success("Risk Management Plan Deleted");
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    return (
        <div className="flex items-center gap-2">
            <>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="flex gap-2 py-6">
                            <MoreOptionsHorizontalIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className=" w-fit">
                        <div className="flex flex-col items-start justify-between gap-1">
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={() => {
                                    dispatch(
                                        openDialog({
                                            type: DialogType.ChangeRiskStatusModal,
                                            dialogProps: {
                                                ...mediumDailogScreen,
                                                id: data.id,
                                            },
                                        })
                                    );
                                }}
                            >
                                <PencilIcon />
                                Change Risk Status
                            </Button>
                            <Link
                                to={{
                                    pathname:
                                        RouteEnum.PROGRAM_RISK_MANAGEMENT_CREATE,
                                    search: `?id=${data.id}`,
                                }}
                                className="w-full"
                            >
                                <Button
                                    variant="ghost"
                                    className="w-full flex items-center justify-start gap-2"
                                >
                                    <EditIcon />
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                                onClick={handleDelete}
                            >
                                <DeleteIcon />
                                Delete
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </>
        </div>
    );
};
