"use client";

import { Separator } from "components/ui/separator";
import PerformanceEvaluationForm from "../components/EvaluationForm";
import FormButton from "@/components/FormButton";
import { FileIcon } from "lucide-react";
import GoBack from "components/GoBack";
import { useState } from "react";

const PerformanceDetails = () => {
  const [isAppraisalStarted, setIsAppraisalStarted] = useState(false);

  const handleStartAppraisal = () => {
    setIsAppraisalStarted(true); // Show the evaluation form when clicked
  };
  return (
    <div>
      <div className='flex justify-between w-full'>
        <div className='flex gap-2 items-center'>
          <GoBack />
          <h2 className='text-xl font-bold'>
            {" "}
            Performance Assessment{" "}
            <span className='text-sm font-normal'>
              (To be completed within the first 90 days of employment)
            </span>
          </h2>
        </div>
        <FormButton onClick={handleStartAppraisal}>
          <FileIcon />
          <p>Start Appraisal</p>
        </FormButton>
      </div>
      <div className='mt-10'>
        <h3 className='text-yellow-darker font-semibold'>
          Appraisal Information
        </h3>
        <div className='grid grid-cols-3 mt-4'>
          <div className='flex flex-col mb-4'>
            <label className='text-md font-semibold mb-2 '>Description</label>
            <p>Technical Associate</p>
          </div>
          <div className='flex flex-col mb-4'>
            <label className='text-md font-semibold mb-2 '>Final Rating</label>
            <p>Internal</p>
          </div>{" "}
          <div className='flex flex-col mb-4'>
            <label className='text-md font-semibold mb-2 '>Cycle Name</label>
            <p>Technical Associate</p>
          </div>{" "}
          <div className='flex flex-col mb-4'>
            <label className='text-md font-semibold mb-2 '>Start Date</label>
            <p>2022-11-09</p>
          </div>{" "}
          <div className='flex flex-col mb-4'>
            <label className='text-md font-semibold mb-2 '>End Date</label>
            <p>2022-11-09</p>
          </div>{" "}
          <div className='flex flex-col mb-4'>
            <label className='text-md font-semibold mb-2 '>Timestamp</label>
            <p>2023-10-05 | 05:43:35</p>
          </div>
        </div>
      </div>
      <Separator className='my-6' />
      <div className=''>
        <h3 className='text-yellow-darker font-semibold'>
          Reviewed Employee Information
        </h3>
        <div className='grid grid-cols-3 mt-4'>
          <div className='flex flex-col mb-4'>
            <label className='text-md font-semibold mb-2 '>
              Reviewed Employee
            </label>
            <p>Tomiwa Emmanuel ABIDAKUN</p>
          </div>
          <div className='flex flex-col mb-4'>
            <label className='text-md font-semibold mb-2 '>Job Title</label>
            <p>Human Resources Officer</p>
          </div>{" "}
          <div className='flex flex-col mb-4'>
            <label className='text-md font-semibold mb-2 '>Sub Unit</label>
            <p>Human Resources</p>
          </div>{" "}
          <div className='flex flex-col mb-4'>
            <label className='text-md font-semibold mb-2 '>Location</label>
            <p>Abuja</p>
          </div>{" "}
          <div className='flex flex-col mb-4'>
            <label className='text-md font-semibold mb-2 '>Country</label>
            <p>NIGERIA</p>
          </div>{" "}
        </div>
      </div>
      <Separator className='my-6' />

      <div className='flex flex-col gap-4'>
        <h3 className='text-yellow-darker font-semibold'>Evaluators</h3>
        <div className='grid grid-cols-2'>
          <div className='flex flex-col mb-4 gap-5'>
            <label className='text-md font-semibold mb-2 '>Evaluator 1</label>
            <div className='flex text-sm '>
              <p className='w-[180px]'>Code:</p>
              <p className=''> M-EV-1</p>
            </div>

            <div className='flex text-sm '>
              <p className='w-[180px]'>Evaluator Name:</p>
              <p className=''>Temitope AJAYI</p>
            </div>
            <div className='flex text-sm '>
              <p className='w-[180px]'>Evaluator Type:</p>
              <p className=''>Main Evaluator</p>
            </div>
          </div>
          <div className='flex flex-col mb-4 gap-5'>
            <label className='text-md font-semibold mb-2 '>Evaluator 2</label>
            <div className='flex text-sm '>
              <p className='w-[180px]'>Code:</p>
              <p className=''> S-EV-1</p>
            </div>{" "}
            <div className='flex text-sm '>
              <p className='w-[180px]'>Evaluator Name:</p>
              <p className=''>Temitope AJAYI</p>
            </div>
            <div className='flex text-sm '>
              <p className='w-[180px]'>Evaluator Type:</p>
              <p className=''>Self</p>
            </div>
          </div>
        </div>
      </div>
      <Separator className='my-6' />

      {isAppraisalStarted && (
        <div className=''>
          <h2 className='text-xl text-primary font-bold'>Reviews</h2>
          <div className=''>
            <PerformanceEvaluationForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceDetails;
