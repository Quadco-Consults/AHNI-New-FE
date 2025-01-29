import { ColumnDef } from "@tanstack/react-table";
import logoPng from "assets/svgs/logo-bg.svg";
import Card from "components/shared/Card";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import { ChevronRight } from "lucide-react";
import TenderChecklist from "./TenderCheckList";

const TPS = () => {
  return (
    <div className='bg-white p-8 h-full'>
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
        <TenderChecklist />
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
            which formed the Technical Prequalification before consideration for
            stage 3. Once a bidder failed to
            <span className='text-primary mx-1'>Pass Stages 1&2</span>, such
            must not be graduated to
            <span className='text-primary mx-1'>Stage 3</span>
            of this exercise.
          </p>
        </Card>
      </div>
      <div className=' bg-green-400 px-8 my-8'>
        <p>STAGE 1 & 2 ASSESSMENT:</p>
        <div className='flex w-full gap-5 justify-between'>
          <div className=''>
            <div className='flex items-center space-x-2'>
              <input
                type='radio'
                // id={criteria.id}
                value='true'
                className='accent-purple-500 top-auto'
                // name={criteria.name}
                // onChange={handleInputChange}
              />
              <label htmlFor='yes'>Pass</label>
            </div>
            (Met all the listed technical prequalification criteria)
          </div>
          <div className=''>
            <div className='flex items-center space-x-2'>
              <input
                type='radio'
                // id={criteria.id}
                value='false'
                // name={criteria.name}
                className='accent-primary top-auto'
                // onChange={handleInputChange}
              />
              <label htmlFor='no'>Fail</label>
            </div>
            (Did not meet some or all the listed technical prequalification
            criteria)
          </div>
        </div>
      </div>
      <div className='bg-blue-300 flex-col justify-center  items-center w-full p-2'>
        <h3 className='underline font-semibold'>
          Review Conducted, Scores Awarded as agreed by the Procurement
          Committee Members:
        </h3>
        <DataTable columns={columns} data={[]} />
      </div>
      <div className='w-full bg-red-200'>
        <Button
          type='button'
          onClick={() => {}}
          className='w-full bg-alternate text-primary my-4 mt-10'
        >
          <ChevronRight size={20} />
          Next
        </Button>
      </div>
    </div>
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
