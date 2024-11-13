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
import StakeholderManagementAPI from "services/programsApi/stakeholder-management";
import { toast } from "sonner";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { StakeholderManagementProps } from "definations/program-types/stakeholder-management";

const Register = () => {
    const { data, isLoading } =
        StakeholderManagementAPI.useGetStakeholderManagementsQuery({});

    const columns: ColumnDef<StakeholderManagementProps>[] = [
        {
            header: "Stakeholder Name",
            id: "stakeholder_name",
            accessorFn: (data) => `${data.stake_holder.stakeholder_name}`,
            size: 250,
        },
        {
            header: "Physical Office Address",
            id: "physical_office_address",
            accessorFn: (data) =>
                `${data.stake_holder.physical_office_address}`,
            size: 250,
        },
        {
            header: "Institution/Organization",
            id: "institution_organization",
            accessorFn: (data) =>
                `${data.stake_holder.institution_organization}`,
            size: 300,
        },
        {
            header: "Designation",
            id: "designation",
            accessorFn: (data) => `${data.stake_holder.designation}`,
        },
        {
            header: "State",
            id: "state",
            accessorFn: (data) => `${data.stake_holder.state}`,
            size: 150,
        },
        {
            header: "Phone Number",
            id: "phone_number",
            accessorFn: (data) => `${data.stake_holder.phone_number}`,
            size: 150,
        },
        {
            header: "E-Mail",
            id: "email",
            accessorFn: (data) => `${data.stake_holder.email}`,
            size: 200,
        },
        {
            header: "Project Role",
            id: "project_role",
            accessorFn: (data) => `${data.stake_holder.project_role}`,
            size: 200,
        },
        {
            header: "Importance",
            id: "importance",
            accessorFn: (data) => `${data.stake_holder.importance}`,
            size: 200,
        },
        {
            header: "Influence",
            id: "influence",
            accessorFn: (data) => `${data.stake_holder.influence}`,
            size: 200,
        },
        {
            header: "Score",
            id: "score",
            accessorFn: (data) => `${data.stake_holder.score}`,
            size: 200,
        },
        {
            header: "Major Concerns",
            id: "major_concerns",
            accessorFn: (data) => `${data.stake_holder.major_concerns}`,
            size: 200,
        },

        {
            header: "Relationship Owner",
            id: "relationship_owner",
            accessorFn: (data) => `${data.stake_holder.relationship_owner}`,
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
        const [stakeholderDeleteMutation] =
            StakeholderManagementAPI.useDeleteStakeholderManagementMutation();
        const deleteStakeholderHandler = async () => {
            try {
                await stakeholderDeleteMutation({
                    path: { id: data?.id },
                }).unwrap();
                toast.success("Stakeholder deleted.");
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong");
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
                                <Link
                                    className="w-full"
                                    to={generatePath(
                                        RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_DETAILS,
                                        {
                                            id: data?.id,
                                        }
                                    )}
                                >
                                    <Button
                                        className="w-full flex items-center justify-start gap-2"
                                        variant="ghost"
                                    >
                                        <EyeIcon />
                                        View
                                    </Button>
                                </Link>
                                <Link
                                    className="w-full"
                                    to={generatePath(
                                        RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_EDIT,
                                        {
                                            id: data?.id,
                                        }
                                    )}
                                >
                                    <Button
                                        className="w-full flex items-center justify-start gap-2"
                                        variant="ghost"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clip-path="url(#clip0_6296_42527)">
                                                <path
                                                    opacity="0.4"
                                                    d="M11.9863 0.892096C12.4252 0.702635 12.9228 0.702635 13.3617 0.892096C13.5381 0.968245 13.6863 1.07818 13.8297 1.20392C13.9671 1.3244 14.1238 1.48103 14.3099 1.66716L14.3325 1.68981L14.3325 1.68982C14.5187 1.87593 14.6753 2.03256 14.7958 2.16997C14.9215 2.31338 15.0314 2.4616 15.1076 2.638C15.297 3.0769 15.297 3.57452 15.1076 4.01342C15.0314 4.18983 14.9215 4.33805 14.7958 4.48146C14.6753 4.61886 14.5187 4.77548 14.3326 4.96158L14.3325 4.96162L10.9065 8.38767L10.9065 8.38767C10.1461 9.14833 9.67577 9.6188 9.08003 9.90064C8.48429 10.1825 7.72797 10.257 6.6576 10.3624L6.13211 10.4143C5.9831 10.429 5.83534 10.3761 5.72946 10.2702C5.62358 10.1643 5.57072 10.0166 5.58543 9.86757L5.63728 9.34208C5.74271 8.27171 5.81721 7.51539 6.09904 6.91965C6.38087 6.3239 6.85135 5.85359 7.61201 5.09319L11.038 1.66718L11.038 1.66717C11.2242 1.48103 11.3808 1.3244 11.5182 1.20392C11.6616 1.07818 11.8098 0.968245 11.9863 0.892096Z"
                                                    fill="#BE8800"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M0.75 11.0833C0.75 10.0708 1.57081 9.25 2.58333 9.25H4.08333C4.45152 9.25 4.75 9.54848 4.75 9.91667C4.75 10.2849 4.45152 10.5833 4.08333 10.5833H2.58333C2.30719 10.5833 2.08333 10.8072 2.08333 11.0833C2.08333 11.3595 2.30719 11.5833 2.58333 11.5833H8.91667C9.92919 11.5833 10.75 12.4041 10.75 13.4167C10.75 14.4292 9.92919 15.25 8.91667 15.25H7.41667C7.04848 15.25 6.75 14.9515 6.75 14.5833C6.75 14.2151 7.04848 13.9167 7.41667 13.9167H8.91667C9.19281 13.9167 9.41667 13.6928 9.41667 13.4167C9.41667 13.1405 9.19281 12.9167 8.91667 12.9167H2.58333C1.57081 12.9167 0.75 12.0959 0.75 11.0833Z"
                                                    fill="#BE8800"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_6296_42527">
                                                    <rect
                                                        width="16"
                                                        height="16"
                                                        fill="white"
                                                    />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        Edit
                                    </Button>
                                </Link>

                                <Button
                                    className="w-full flex items-center justify-start gap-2"
                                    variant="ghost"
                                    onClick={deleteStakeholderHandler}
                                >
                                    <DeleteIcon />
                                    delete
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </>
            </div>
        );
    };

    return (
        <div className="space-y-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Plans</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Icon icon="iconoir:slash" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Stakeholder</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Icon icon="iconoir:slash" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Stakeholder Register</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex justify-end">
                <Link
                    to={
                        RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_CREATE
                    }
                >
                    <Button className="flex gap-2 py-6">
                        <AddSquareIcon />
                        New Stakeholder
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
                    data={data?.results || []}
                    columns={columns}
                    isLoading={isLoading}
                />
            </Card>
        </div>
    );
};

export default Register;
