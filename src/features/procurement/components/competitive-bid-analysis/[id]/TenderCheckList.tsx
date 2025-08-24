"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Controller } from "react-hook-form";
import DataTable from "components/Table/DataTable";

const TenderChecklist = ({
  control,
  criteriaData,
  setValue,
  getValues,
}: {
  control: any;
  criteriaData: any;
  setValue: any;
  getValues: any;
}) => {
  //   const { handleSubmit, control } = useForm();

  //   const onSubmit = (data: any) => {
  //     console.log("Submitted Data:", data);
  //   };

  return (
    <DataTable
      columns={columns(control, setValue, getValues)}
      data={criteriaData || []}
    />
  );
};

export default TenderChecklist;

const columns = (
  control: any,
  setValue: any,
  getValues: any
): ColumnDef<any>[] => [
  {
    header: "Stages",
    accessorKey: "stage",
    size: 140,
    cell: ({ row }) => <span>{row.original.stage}</span>,
  },
  {
    header: "Criteria",
    accessorKey: "criteria",
    size: 670,
    cell: ({ row }) => (
      <div className='flex flex-col gap-2 ml-2'>
        <p className='font-semibold'>{row.original.criteria}</p>
        <ol className='flex flex-col gap-2 list-disc'>
          <li>
            <p>{row.original.description_1}</p>
          </li>
          <li>
            <p>{row.original.description_2}</p>
          </li>
        </ol>
      </div>
    ),
  },
  {
    header: "Tick as appropriate",
    accessorKey: "tick_as_appropriate",
    size: 210,
    id: "actions",
    cell: ({ row }) => (
      <ActionListAction
        control={control}
        data={row.original}
        setValue={setValue}
        getValues={getValues}
      />
    ),
  },
];

const ActionListAction = ({
  control,
  data,
  setValue,
  getValues,
}: {
  control: any;
  data: any;
  setValue: any;
  getValues: any;
}) => {
  const updateCriteriaDataStatus = (
    data: any,
    status: string,
    setValue: any,
    getValues: any
  ) => {
    const currentStatus = getValues("criteriaDataStatus") || [];
    const updatedStatus = currentStatus.filter(
      (item: any) => item.stage !== data.stage
    );
    console.log({ data });

    setValue("criteriaDataStatus", [
      ...updatedStatus,
      { stage: data.stage, status, criteria: data.criteria },
    ]);
  };

  return (
    <div className='flex gap-5'>
      <Controller
        name={`criteria_${data.stage}`}
        control={control}
        defaultValue=''
        render={({ field }) => (
          <>
            <div className='flex items-center space-x-2'>
              <input
                type='radio'
                {...field}
                value='PASS'
                checked={field.value === "PASS"}
                className='accent-purple-500'
                onChange={() => {
                  field.onChange("PASS");
                  updateCriteriaDataStatus(data, "PASS", setValue, getValues);
                }}
              />
              <label>PASS</label>
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='radio'
                {...field}
                value='FAIL'
                checked={field.value === "FAIL"}
                className='accent-purple-500'
                onChange={() => {
                  field.onChange("FAIL");
                  updateCriteriaDataStatus(data, "FAIL", setValue, getValues);
                }}
              />
              <label>FAIL</label>
            </div>
          </>
        )}
      />
    </div>
  );
};
