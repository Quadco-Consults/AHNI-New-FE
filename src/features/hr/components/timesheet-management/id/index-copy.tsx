import { ColumnDef } from "@tanstack/react-table";
import AddSquareIcon from "components/icons/AddSquareIcon";
import ApproveIcon from "components/icons/ApproveIcon";
import Card from "components/Card";
import GoBack from "components/GoBack";
import DataTable from "components/Table/DataTable";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { DialogType } from "constants/dailogs";
import { HrRoutes } from "constants/RouterConstants";
import { useAppDispatch } from "hooks/useStore";
import { generatePath, Link, useParams } from "react-router-dom"; 
import { openDialog } from "store/ui";

const TimesheetManagementDetail = () => {
  const admin = false;
  const dispatch = useAppDispatch();
  const { id } = useParams();

  return (
    <div className='space-y-4'>
      <div className='flex gap-x-6 items-center'>
        <GoBack />
        <h4 className='text-xl font-bold'>Timesheet Detail</h4>
      </div>
      <Card className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h4 className='font-medium text-lg'>
            Week 32 (May 26 – Jun 1, 2024)
          </h4>
          {admin ? (
            <Button
              onClick={() =>
                dispatch(
                  openDialog({
                    type: DialogType.ApprovalModal,
                    dialogProps: {
                      label: "Approval for Timesheet submission",
                      width: "max-w-lg",
                    },
                  })
                )
              }
            >
              <ApproveIcon fillColor /> Approval
            </Button>
          ) : (
            <Link
              href={generatePath(HrRoutes.TIMESHEET_MANAGEMENT_DETAIL_CREATE, {
                id: id as string,
              })}
            >
              <Button>
                <AddSquareIcon /> Add
              </Button>
            </Link>
          )}
        </div>

        <Card>
          <DataTable data={data} columns={columns} footer />
        </Card>
        <Card className='space-y-4'>
          <h4 className='font-semibold'>Status</h4>
          <Badge variant='success'>Approved</Badge>
        </Card>
        {admin && (
          <Card className='space-y-4'>
            <h4 className='font-semibold'>
              Actions Performed on the Timesheet
            </h4>
            <Card className='space-y-4'>
              <div className='flex justify-between gap-5 items-center'>
                <h4 className='font-semibold'>Amos Jeniffer</h4>
                <p>2:00.pm, 20-10-2024 </p>
              </div>
              <p className='text-sm'>
                Reduce the time for the project, we cant approve with that large
                amount of time
              </p>
            </Card>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default TimesheetManagementDetail;

type TTimesheetDetail = {
  name: string;
  activity: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
  total: string;
};
const data = Array(5).fill({
  name: "ACEBAY",
  activity: "111.0004 ACE Shared",
  mon: "3:00",
  tue: "3:00",
  wed: "3:00",
  thu: "3:00",
  fri: "3:00",
  sat: "3:00",
  sun: "3:00",
  total: "12:00",
});

const columns: ColumnDef<TTimesheetDetail>[] = [
  {
    header: "Project Name",
    accessorKey: "name",
    footer: () => {
      return <p className='text-yellow-500'>Total</p>;
    },
    size: 200,
  },
  {
    header: "Activity Name",
    accessorKey: "activity",
    size: 200,
  },
  {
    header: "Mon",
    accessorKey: "mon",
    footer: () => {
      return <p className='text-yellow-500'>3:30</p>;
    },
  },
  {
    header: "Tue",
    accessorKey: "tue",
    footer: () => {
      return <p className='text-yellow-500'>3:30</p>;
    },
  },
  {
    header: "Wed",
    accessorKey: "wed",
    footer: () => {
      return <p className='text-yellow-500'>3:30</p>;
    },
  },
  {
    header: "Thu",
    accessorKey: "thu",
    footer: () => {
      return <p className='text-yellow-500'>3:30</p>;
    },
  },
  {
    header: "Fri",
    accessorKey: "fri",
    footer: () => {
      return <p className='text-yellow-500'>3:30</p>;
    },
  },
  {
    header: "Sat",
    accessorKey: "sat",
    footer: () => {
      return <p className='text-yellow-500'>3:30</p>;
    },
  },
  {
    header: "Sun",
    accessorKey: "sun",
    footer: () => {
      return <p className='text-yellow-500'>3:30</p>;
    },
  },
  {
    header: "Total",
    accessorKey: "total",
    footer: () => {
      return <p className='text-yellow-500'>40:30</p>;
    },
  },
];
