import { ColumnDef } from "@tanstack/react-table";
import { DropDownIcon } from "assets/svgs/CAndGSvgs";
import SearchBar from "atoms/SearchBar";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { CG_GROUTES } from "constants/RouterConstants";
import React, { useMemo } from "react";
import { generatePath, Link, useNavigate, useParams } from "react-router-dom";
import { consultancyAPIs } from "services/cAndGApi/consultancy";
import { toast } from "sonner";

const ConsultancySubmittedApplications: React.FC = () => {
    const params = useParams();
    const navigate = useNavigate();
    const getConsultancyApplications =
        consultancyAPIs.useGetAllConsultancyApplicationsQuery({
            params: {
                job_detail: params.id,
            },
        });

    // console.log(getConsultancyApplications);

    const closeOutArray = useMemo(() => {
        return getConsultancyApplications?.data?.results || [];
    }, [getConsultancyApplications]);

    const columns: ColumnDef<any>[] = [
        {
            id: "select",
            size: 50,
            header: ({ table }) => {
                return (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => {
                            table.toggleAllPageRowsSelected(!!value);
                        }}
                    />
                );
            },
            cell: ({ row }) => {
                return (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => {
                            row.toggleSelected(!!value);
                        }}
                    />
                );
            },
        },
        // {
        //   header: ({ table }) => (
        //     <Checkbox
        //       checked={table.getIsAllRowsSelected()}
        //       onCheckedChange={table.getToggleAllRowsSelectedHandler()}
        //     />
        //   ),
        //   accessorKey: "isSelected",
        //   size: 50,
        //   cell: ({ row }) => (
        //     <Checkbox
        //       checked={row.getIsSelected()}
        //       onCheckedChange={row.getToggleSelectedHandler()}
        //     />
        //   ),
        // },
        {
            header: "Applicant Name",
            accessorKey: "applicant_name",
            size: 250,
            // cell: ({ row }) => <p>{row?.original?.project_id}</p>,
        },
        {
            header: "Employment type",
            accessorKey: "employment_type",
            size: 250,
            // cell: ({ row }) => <p>{row?.original?.closeout_task_count}</p>,
        },
        {
            header: "Applicant Email",
            accessorKey: "applicant_email",
            size: 250,
            // cell: ({ row }) => <p>{row?.original?.closeout_duration}</p>,
        },

        {
            header: "",
            id: "actions",
            size: 50,
            cell: ({ row }) => <ActionListAction data={row.original} />,
        },
    ];

    const ActionListAction = ({ data }: any) => {
        // const [subgrantDeleteMutation] = closeoutPlanAPis.useAddCloseOutPlanMutation();
        const deleteSubgrantHandler = async () => {
            try {
                // await subgrantDeleteMutation({ path: { id: data?.id } }).unwrap();
                toast.success("Project deleted.");
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
                                        CG_GROUTES.CONSULTANCY_APPLICATION_DETAILS,
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
                                {/* <Link
                  className="w-full"
                  to={generatePath(RouteEnum.PROJECTS_EDIT_SUMMARY, {
                    id: data?.id,
                  })}
                >
                  <Button className="w-full flex items-center justify-start gap-2" variant="ghost">
                    <EditIcon />
                    Edit
                  </Button>
                </Link> */}
                                <Button
                                    className="w-full flex items-center justify-start gap-2"
                                    variant="ghost"
                                    onClick={deleteSubgrantHandler}
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
        <main className="w-full flex flex-col justify-center items-center gap-y-[1.5rem]">
            <section className="flex items-center w-full justify-between">
                <SearchBar onchange={() => ""} />
                <Button
                    onClick={() => {
                        navigate(CG_GROUTES.NEW_CLOSE_OUT_PLAN);
                    }}
                    variant={"custom"}
                    className="bg-[#FFF2F2] text-primary"
                >
                    <p>Actions</p>
                    <DropDownIcon />
                </Button>
            </section>
            <div className="w-full">
                <DataTable
                    columns={columns}
                    // onRowClick={(row) => {
                    //   navigate("/c-and-g/close-out-plan/details/" + row?.original?.id);
                    // }}
                    data={closeOutArray}
                    isLoading={getConsultancyApplications.isLoading}
                />
            </div>
        </main>
    );
};

export default ConsultancySubmittedApplications;
