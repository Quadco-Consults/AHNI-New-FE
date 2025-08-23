"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import CopyActivitiesModal from "./CopyAcitivitiesModal";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";

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

const initialRow: TTimesheetDetail = {
  name: "",
  activity: "",
  mon: "0",
  tue: "0",
  wed: "0",
  thu: "0",
  fri: "0",
  sat: "0",
  sun: "0",
  total: "0",
};

const TimesheetManagementFull = () => {
  const dispatch = useAppDispatch();

  const [timesheetData, setTimesheetData] = useState<TTimesheetDetail[]>([
    initialRow,
  ]);
  const [savedTimesheet, setSavedTimesheet] = useState<TTimesheetDetail[]>([
    initialRow,
  ]);

  const addRow = () => setTimesheetData((prev) => [...prev, { ...initialRow }]);

  const removeRow = (index: number) => {
    setTimesheetData((prev) => prev.filter((_, i) => i !== index));
  };

  const copyRow = (index: number) => {
    setTimesheetData((prev) => [...prev, { ...prev[index] }]);
  };

  const resetTimesheet = () => setTimesheetData([{ ...initialRow }]);

  const cancelChanges = () => setTimesheetData(savedTimesheet);

  const handleSubmit = () => {
    console.log("Submitted Timesheet:", timesheetData);
    setSavedTimesheet(timesheetData);
  };

  const updateCell = (
    index: number,
    key: keyof TTimesheetDetail,
    value: string
  ) => {
    const updated = [...timesheetData];
    updated[index][key] = value;

    // Update total automatically
    if (["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(key)) {
      const totalHours = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
        .map((day) =>
          parseFloat(updated[index][day as keyof TTimesheetDetail] || "0")
        )
        .reduce((acc, curr) => acc + curr, 0);
      updated[index].total = totalHours.toFixed(2);
    }

    setTimesheetData(updated);
  };
  const handleOpenDialog = () => {
    dispatch(
      openDialog({
        type: DialogType.COPY_ACTIVITIES,
        dialogProps: {
          header: "Copy Activities from Timesheet",
          data: "1", // the timesheet ID or whatever you need here
          onAddActivities: (activities) => {
            const newRows = activities.map((a) => ({
              ...a,
              mon: "",
              tue: "",
              wed: "",
              thu: "",
              fri: "",
              sat: "",
              sun: "",
              total: "0:00",
            }));
            setTimesheetData((prev) => [...prev, ...newRows]);
          },
        },
      })
    );
  };
  console.log({ timesheetData });

  const columns: ColumnDef<TTimesheetDetail>[] = [
    { header: "Project Name", accessorKey: "name" },
    { header: "Activity", accessorKey: "activity" },
    ...["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => ({
      header: day.charAt(0).toUpperCase() + day.slice(1),
      accessorKey: day,
      cell: ({ row }) => (
        <input
          type='number'
          value={row.original[day as keyof TTimesheetDetail]}
          className='w-16 px-1 border rounded text-sm'
          onChange={(e) =>
            updateCell(row.index, day as keyof TTimesheetDetail, e.target.value)
          }
        />
      ),
    })),
    { header: "Total", accessorKey: "total" },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => copyRow(row.index)}
          >
            Copy
          </Button>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => removeRow(row.index)}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>Timesheet Management</h2>

      <div className='flex gap-2'>
        <Button onClick={addRow}>Add Row</Button>
        <Button variant='outline' onClick={resetTimesheet}>
          Reset
        </Button>
        <Button variant='outline' onClick={cancelChanges}>
          Cancel
        </Button>
        <Button variant='default' onClick={handleSubmit}>
          Submit
        </Button>
        <Button onClick={handleOpenDialog}>Copy Activities</Button>
      </div>

      <Card>
        <DataTable columns={columns} data={timesheetData} />
      </Card>

      <Card className='space-y-2'>
        <h4 className='font-semibold'>Status</h4>
        <Badge variant='secondary'>Draft</Badge>
      </Card>
    </div>
  );
};

export default TimesheetManagementFull;
