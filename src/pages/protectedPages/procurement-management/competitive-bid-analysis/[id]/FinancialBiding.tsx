import { ColumnDef } from "@tanstack/react-table";
import logoPng from "assets/svgs/logo-bg.svg";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";

import { ChevronRight } from "lucide-react";
import TenderChecklist from "./TenderCheckList";
import { Controller, useForm } from "react-hook-form";

const criteriaData = [
  {
    stage: 1,
    criteria:
      "A)  FINANCIAL BID OPENING TO ASSESS CONFORMITY TO FINANCIAL QUOTATION LISTED 8",
    description_1:
      "If Tender submission CONFORMS to Financial Quotation (8) by providing for the following: i)   Quotation, ii)  Comprehensive Specification of Product of Interest including Brands, iii) Clear Delivery Leadtime,  iv) Clear Validity of Quotation, v)  Clear Post Delivery Warranty, vi) All relevant Installation Accessories, vii) Delivery Workplan (Schedule of Installation)",
    description_2: "If such is not clearly provided (Tick FAIL)",
  },
];
const FinancialBid = () => {
  const { handleSubmit, control } = useForm();

  const onSubmit = (data: any) => {
    console.log("Submitted Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mx-auto p-5'>
      <div className='bg-white p-8 h-full flex flex-col gap-8'>
        <div className=''>
          <div className='flex justify-center items-center flex-col'>
            <img src={logoPng} alt='logo' width={200} />
          </div>
          <div className='p-4 w-full h-[70px] flex justify-between items-center text-lg'>
            <h3 className='w-[200px] whitespace-nowrap text-primary'>
              STAGE 3
            </h3>
            <div className='flex w-full items-center justify-start'>
              <p className='font-semibold'>
                FINANCIAL BID OPENING & ASSESSMENT OF CONFORMITY TO FINANCIAL
                QUOTATION
              </p>
            </div>
          </div>

          <TenderChecklist control={control} criteriaData={criteriaData} />
        </div>

        <div className='  px-8 my-8'>
          <p className='mb-4'> STAGE 3 ASSESSMENT:</p>
          <div className='flex gap-5  w-full justify-between'>
            <Controller
              name={"stage_1_and_2"}
              control={control}
              defaultValue=''
              render={({ field }) => (
                <>
                  <div className=''>
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
                    (Met all the listed technical prequalification criteria)
                  </div>
                  <div>
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
                    (Did not meet some or all the listed technical
                    prequalification criteria)
                  </div>
                </>
              )}
            />
          </div>
        </div>
        <div className=' flex-col justify-center  items-center w-full p-2'>
          <h3 className='underline font-semibold'>
            Review Conducted, Scores Awarded as agreed by the Procurement
            Committee Members:
          </h3>
          <DataTable columns={columns} data={[]} />
        </div>
        <div className='w-full'>
          <Button
            type='submit'
            className='w-full bg-alternate text-primary my-4 mt-10'
          >
            <ChevronRight size={20} />
            Next
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FinancialBid;

const columns: ColumnDef<any>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Signature",
    accessorKey: "signature",
  },
  {
    header: "Date",
    accessorKey: "date",
  },
];
