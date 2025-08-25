import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import Link from "next/link";
import { CG_ROUTES } from "constants/RouterConstants";
import { IConsultancyReportPaginatedData } from "definations/c&g/contract-management/consultancy-report";
import { useDeleteConsultancyReport } from "@/features/contracts-grants/controllers/consultancyReportController";
import EyeIcon from "components/icons/EyeIcon";

export const consultantDatabaseColumns: ColumnDef<IConsultancyReportPaginatedData>[] =
  [
    {
      header: "Surname",
      id: "sur_name",
      accessorKey: "sur_name",
      size: 200,
    },

    {
      header: "Other Names",
      id: "other_names",
      accessorKey: "other_names",
      size: 200,
    },

    {
      header: "Gender",
      id: "gender",
      accessorKey: "gender",
      size: 200,
    },

    {
      header: "State of Origin",
      id: "state_of_origin",
      accessorKey: "state_of_origin",
      size: 200,
    },

    {
      header: "Designation",
      id: "designation",
      accessorKey: "designation",
      size: 200,
    },

    {
      header: "Phone Number",
      id: "phone_number",
      accessorKey: "phone_number",
      size: 200,
    },

    {
      header: "Email Address",
      id: "email_address",
      accessorKey: "email_address",
      size: 200,
    },

    {
      header: "Qualifications",
      id: "qualifications",
      accessorKey: "qualifications",
      size: 200,
    },

    {
      header: "Health Facility/Assignment Location",
      id: "health_facility",
      accessorKey: "health_facility",
      size: 200,
    },

    {
      header: "Spoke Site Name",
      id: "spoke_site_name",
      accessorKey: "spoke_site_name",
      size: 200,
    },

    {
      header: "LGA",
      id: "lga",
      accessorKey: "lga",
      size: 200,
    },

    {
      header: "Status of Adhoc staff",
      id: "status_of_adhoc_staff",
      accessorKey: "status_of_adhoc_staff",
      size: 200,
    },

    {
      header: "QMAP BACKSTOP",
      id: "qmap_backstop",
      accessorKey: "qmap_backstop",
      size: 200,
    },

    {
      header: "Programs Officer",
      id: "programs_officer",
      accessorKey: "programs_officer",
      size: 200,
    },

    {
      header: "STL",
      id: "stl",
      accessorKey: "stl",
      size: 200,
    },

    {
      header: "SEO",
      id: "seo",
      accessorKey: "seo",
      size: 200,
    },

    {
      header: "LGA2",
      id: "lga2",
      accessorKey: "lga2",
      size: 200,
    },

    {
      header: "Cluster",
      id: "cluster",
      accessorKey: "cluster",
      size: 200,
    },

    {
      header: "Account Name",
      id: "account_name",
      accessorKey: "account_name",
      size: 200,
    },
    {
      header: "Bank Name",
      id: "bank_name",
      accessorKey: "bank_name",
      size: 200,
    },
    {
      header: "Account Number",
      id: "account_number",
      accessorKey: "account_number",
      size: 200,
    },

    {
      header: "SORT CODE",
      id: "sort_code",
      accessorKey: "sort_code",
      size: 200,
    },

    {
      header: "",
      id: "action",
      size: 80,
      cell: ({ row }) => <TableMenu {...row.original} />,
    },
  ];

const TableMenu = ({ id }: IConsultancyReportPaginatedData) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { deleteConsultancyReport, isLoading } =
    useDeleteConsultancyReport();

  const handleDelete = async () => {
    try {
      await deleteConsultancyReport(id)();
      toast.success("Consultancy Report Deleted");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='flex gap-2 py-6'>
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-fit'>
            <Link
              href={generatePath(CG_ROUTES.CONSULTANCY_REPORT_DETAILS, { id })}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EyeIcon />
                View
              </Button>
            </Link>
            <Link
              href={{
                pathname: CG_ROUTES.CREATE_CONSULTANCY_REPORT,
                search: `?id=${id}`,
              }}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <PencilIcon />
                Edit
              </Button>
            </Link>
            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={() => setDialogOpen(true)}
            >
              <DeleteIcon />
              Delete
            </Button>
          </PopoverContent>
        </Popover>
      </>

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this consultant?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};
