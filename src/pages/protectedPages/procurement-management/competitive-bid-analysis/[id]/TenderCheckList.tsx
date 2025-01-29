import { ColumnDef } from "@tanstack/react-table";
import { Controller, useForm } from "react-hook-form";
import DataTable from "components/Table/DataTable";

const criteriaData = [
  {
    stage: 1,
    criteria: "COMPLETENESS AND CONFORMITY TO TENDER REQUIREMENT",
    description_1:
      "If Tender submission CONFORMS to tender requirement, this includes submission of Technical Documentation, Financial Quotation as well as Tender Registration (Tick PASS)",
    description_2:
      "If Tender submission DO NOT CONFIRM to tender requirement, this includes submission of Technical Documentations, Financial Quotation as well as Tender Registration (Tick FAIL)",
  },
  {
    stage: 2,
    criteria: "ESSENTIAL AND LEGAL REGISTRATION DOCUMENT",
    description_1:
      "If provided with Company Profile, CAC or Business Name Registration, FORM C02, FORM C07,Office Address, Functional Telephone and Emails (Tick PASS)",
    description_2:
      "If this important legal registration information is not provided (Tick FAIL)",
  },
];

const TenderChecklist = () => {
  const { handleSubmit, control } = useForm();

  const onSubmit = (data: any) => {
    console.log("Submitted Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mx-auto p-5'>
      <h2 className='text-xl font-bold mb-4'>Tender Evaluation Checklist</h2>

      <DataTable columns={columns(control)} data={criteriaData || []} />

      <button type='submit' className='mt-4 p-2 bg-blue-500 text-white rounded'>
        Submit
      </button>
    </form>
  );
};

export default TenderChecklist;

const columns = (control: any): ColumnDef<any>[] => [
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
      <ActionListAction control={control} data={row.original} />
    ),
  },
];

const ActionListAction = ({ control, data }: { control: any; data: any }) => {
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
              />
              <label>FAIL</label>
            </div>
          </>
        )}
      />
    </div>
  );
};
