import { ColumnDef } from "@tanstack/react-table";
import logoPng from "assets/svgs/logo-bg.svg";
import Card from "components/shared/Card";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import { ChevronRight } from "lucide-react";
import TenderChecklist from "./TenderCheckList";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";

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
const TPS = () => {
  const { handleSubmit, control } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    console.log("Submitted Data:", data);
    navigate(RouteEnum.COMPETITIVE_BID_ANALYSIS_DETAILS_FINANCIAL_BID_OPENING);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mx-auto p-5'>
      <div className='bg-white p-8 h-full flex flex-col gap-8'>
        <div className=''>
          <div className='flex justify-center items-center flex-col'>
            <img src={logoPng} alt='logo' width={200} />
          </div>
          <div className='p-4 w-full h-[70px] flex justify-between items-center text-xl'>
            <h3 className='w-[250px] whitespace-nowrap text-primary'>
              STAGE 1 & 2
            </h3>
            <div className='flex w-full items-center justify-start ml-6'>
              <p className='font-semibold'>TECHNICAL PREQUALIFICATION SHEET</p>
            </div>
          </div>
          <Separator />
          <div className='p-4 w-full h-[70px] flex justify-between items-center'>
            <h3 className='w-[250px] whitespace-nowrap'>Project Title</h3>
            <div className='flex w-full items-center justify-start ml-6'>
              <p>
                SUPPLY AND INSTALLATION OF SOLAR AND INVERTER
                SYSTEMS-GF-RFQ-AHNi-09-2023
              </p>
            </div>
          </div>{" "}
          <Separator />
          <div className='p-4 w-full h-[70px] flex justify-between items-center'>
            <h3 className='w-[250px] whitespace-nowrap'>Company Accessed</h3>
            <div className='flex w-full items-center justify-start ml-6'>
              <p>Vendor 1</p>
            </div>
          </div>
          <TenderChecklist control={control} criteriaData={criteriaData} />
        </div>
        <div className=''>
          <Card className='border-yellow-darker space-y-3'>
            <p>
              <strong>Note:</strong>
            </p>
            <p>
              BIDDER MUST
              <span className='text-primary mx-1'>
                PASS Criteria 1-6(summarized as stages 1&2)
              </span>
              which formed the Technical Prequalification before consideration
              for stage 3. Once a bidder failed to
              <span className='text-primary mx-1'>Pass Stages 1&2</span>, such
              must not be graduated to
              <span className='text-primary mx-1'>Stage 3</span>
              of this exercise.
            </p>
          </Card>
        </div>
        <div className='  px-8 my-8'>
          <p className='mb-4'> STAGE 1 & 2 ASSESSMENT:</p>
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

export default TPS;

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
