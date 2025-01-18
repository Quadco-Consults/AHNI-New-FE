import { ColumnDef } from "@tanstack/react-table";
import FilterIcon2 from "assets/svgs/FilterIcon2";
import FormButton from "atoms/FormButton";
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

const ConsultancyShortList = () => {
    const params = useParams();
    const navigate = useNavigate();
    const getConsultancyApplications =
        consultancyAPIs.useGetAllConsultancyApplicationsQuery({
            params: {
                job_detail: params.id,
                status: "short-listed",
            },
        });

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
        <main className="w-full flex flex-col items-center justify-center gap-y-[1rem] px-[4rem]">
            {" "}
            <div className="w-full flex justify-between items-center">
                <div className="flex items-center justify-center">
                    <SearchBar onchange={() => ""} />

                    <Button variant="ghost" className="">
                        <FilterIcon2 />
                    </Button>
                </div>
                <div className="flex items-center">
                    <FormButton
                        onClick={() => {
                            navigate(
                                generatePath(
                                    CG_GROUTES.CONSULTANCY_SHORTLIST_METRIC,
                                    { id: params.id }
                                )
                            );
                        }}
                    >
                        <ArrowIcon />
                        <p>Start Interview</p>
                    </FormButton>
                </div>
            </div>
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
            <div className="w-full flex flex-wrap justify-between items-start gap-y-[1rem]"></div>
        </main>
    );
};

export default ConsultancyShortList;

export const DetailsTag = ({
    icon,
    deet,
}: {
    icon: React.ReactNode;
    deet: string;
}) => {
    return (
        <div className="flex items-center border border-[#C7CBD5] text-sm p-1 px-[.625rem] gap-x-[.25rem] rounded-full">
            {icon}
            <p>{deet}</p>
        </div>
    );
};

const ArrowIcon = () => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                opacity="0.4"
                d="M19.6968 1.78314C20.397 1.85063 21.1299 2.03918 21.5973 2.54257C22.0509 3.03106 22.1999 3.76556 22.2388 4.46477C22.2798 5.20207 22.206 6.0823 22.0568 7.0301C21.7577 8.9306 21.1368 11.2173 20.3917 13.4096C19.6462 15.6028 18.7652 17.7347 17.9332 19.3247C17.5192 20.1159 17.1031 20.8005 16.7071 21.2953C16.51 21.5414 16.2975 21.7666 16.0715 21.9344C15.8571 22.0938 15.5444 22.2655 15.1683 22.2489C14.5642 22.2222 14.1052 21.8913 13.7678 21.4533C13.4445 21.0336 13.1892 20.4645 12.9623 19.8071C12.5073 18.4888 12.0798 16.5447 11.5288 14.0391C11.4104 13.5007 11.3108 13.318 11.2213 13.2216C11.1355 13.1291 10.9724 13.0226 10.4646 12.8802C10.1518 12.7924 9.6779 12.6958 9.08022 12.574L9.08018 12.574C8.89638 12.5365 8.70087 12.4967 8.49473 12.454C7.64346 12.2776 6.65324 12.06 5.71161 11.7792C4.77998 11.5014 3.84284 11.1467 3.12327 10.676C2.41829 10.2149 1.75629 9.5279 1.75002 8.55582C1.74764 8.18549 1.92123 7.87829 2.08623 7.66237C2.25922 7.436 2.48919 7.22331 2.74121 7.02586C3.24734 6.62932 3.94355 6.21648 4.74626 5.80847C6.35914 4.98865 8.51281 4.13295 10.7222 3.42176C12.9302 2.71102 15.2288 2.13337 17.1313 1.88382C18.08 1.75939 18.9611 1.71223 19.6968 1.78314Z"
                fill="white"
            />
            <path
                d="M11.5004 13.9134C11.3945 13.4713 11.3038 13.3101 11.2217 13.2216C11.1359 13.1291 10.9727 13.0226 10.465 12.8802C10.3023 12.8345 10.0961 12.7865 9.85156 12.7338L14.2928 8.29287C14.6834 7.90236 15.3165 7.90238 15.707 8.29292C16.0975 8.68346 16.0975 9.31662 15.707 9.70713L11.5004 13.9134Z"
                fill="white"
            />
        </svg>
    );
};
