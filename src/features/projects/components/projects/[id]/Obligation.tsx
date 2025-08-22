import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { useState } from "react";
import { IProjectSingleData } from "definations/project";

export default function ProjectObligation({}: IProjectSingleData) {
  return (
    <div>
      <h2 className='font-bold text-lg mb-4'>Project Obligation</h2>
      {/* <DataTable columns={columns} data={[]} /> */}
    </div>
  );
}

interface TColumn {
  description: string;
  amount: string;
  date_received: string;
  total_amount: string;
}

const columns: ColumnDef<TColumn>[] = [
  {
    header: "Description",
    id: "description",
    accessorKey: "description",
    size: 200,
  },

  {
    header: "Amount",
    id: "amount",
    accessorKey: "amount",
    size: 200,
  },

  {
    header: "Date Received",
    id: "date_received",
    accessorKey: "date_received",
    size: 200,
  },

  {
    header: "Total Obligated Amount",
    id: "total_amount",
    accessorKey: "total_amount",
    size: 200,
  },

  {
    header: "",
    id: "action",
    size: 100,
    cell: ({ row }) => <TableAction {...row.original} />,
  },
];

const TableAction = ({}: TColumn) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteOblogation = async () => {};

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='flex gap-2 py-6'>
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit'>
          <div className='flex flex-col items-start justify-between gap-1'>
            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={() => setDialogOpen(true)}
            >
              <DeleteIcon />
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        open={dialogOpen}
        title='Are you sure you want to delete this project?'
        onCancel={() => setDialogOpen(false)}
        onOk={handleDeleteOblogation}
      />
    </>
  );
};
