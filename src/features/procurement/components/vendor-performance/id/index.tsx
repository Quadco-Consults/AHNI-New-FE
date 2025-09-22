"use client";

"use client";

import Card from "components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";
import logoPng from "@/assets/svgs/logo-bg.svg";
import GoBack from "components/GoBack";
import { useParams } from "next/navigation";
import VendorsEvaluaionAndPerformanceAPI from "@/features/procurement/controllers/vendorPerformanceEvaluationController";
import { Button } from "components/ui/button";
import { BsFiletypePdf } from "react-icons/bs";

const VendorPerformance = () => {
  const { id } = useParams();

  const { data: vendorEvaluationData } =
    VendorsEvaluaionAndPerformanceAPI.useGetSingleVendorEvaluation(id as string);

  // @ts-ignore
  const totals = vendorEvaluationData?.data?.criteria_scores.reduce(
    // @ts-ignore

    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className='bg-white p-8'>
      <GoBack />

      <div className='flex justify-center items-center flex-col'>
        <img src={logoPng} alt='logo' width={200} />
        <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
      </div>
      <div className='mt-8'>
        <div className='flex justify-end'>
          <Button variant='custom' className='mb-4 ml-auto'>
            <span>
              <BsFiletypePdf size={25} />
            </span>
            Download
          </Button>
        </div>
        <Card className='border-primary flex flex-col gap-[17px]'>
          <div className='flex items-center gap-[30px] '>
            <h2 className='w-[240px] text-[18px] font-semibold text-gray-900'>
              Vendor Performance:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              {/* @ts-ignore */}

              {vendorEvaluationData?.data?.vendor?.name}
            </p>
          </div>
          <div className='flex items-center gap-[30px]'>
            <h2 className='w-[240px] text-[18px] font-semibold text-gray-900 capitalize'>
              Location of Service:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              {/* @ts-ignore */}

              {vendorEvaluationData?.data?.location_of_service}
            </p>
          </div>
          <div className='flex items-center gap-[30px]'>
            <h2 className='w-[240px] text-[18px] font-semibold text-gray-900'>
              Reviewed Start Period:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              {/* @ts-ignore */}

              {vendorEvaluationData?.data?.reviewed_period_start}
            </p>
          </div>
          <div className='flex items-center gap-[30px]'>
            <h2 className='w-[240px] text-[18px] font-semibold text-gray-900'>
              Reviewed End Period:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              {/* @ts-ignore */}

              {vendorEvaluationData?.data?.reviewed_period_end}
            </p>
          </div>
        </Card>
        <Card className='border-primary flex flex-col gap-[17px] bg-[#FEF2F2] justify-center items-center mt-20'>
          <p className='font-semibold text-[24px]'>Evaluation</p>
        </Card>
        <div className='mt-8'>
          <Table>
            <TableHeader>
              <TableRow className='text-center'>
                <TableCell className='max-w-[100px]'>
                  Competency Areas
                </TableCell>
                <TableCell>1 - Low</TableCell>
                <TableCell>2 - Fair</TableCell>
                <TableCell>3 - Satisfactorily</TableCell>
                <TableCell>4 - Good</TableCell>
                <TableCell>5 - Excellent</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* @ts-ignore */}
              {vendorEvaluationData?.data?.criteria_scores?.map(
                // @ts-ignore
                (row, index) => {
                  return (
                    <TableRow className='text-start' key={index}>
                      <TableCell className='max-w-[400px]'>
                        {row.criteria}
                      </TableCell>
                      <TableCell>
                        {row?.value == 1 ? row?.value : "-"}
                      </TableCell>
                      <TableCell>
                        {row?.value == 2 ? row?.value : "-"}
                      </TableCell>
                      <TableCell>
                        {row?.value == 3 ? row?.value : "-"}
                      </TableCell>
                      <TableCell>
                        {row?.value == 4 ? row?.value : "-"}
                      </TableCell>
                      <TableCell>
                        {row?.value == 5 ? row?.value : "-"}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
              <TableRow className='text-start'>
                <TableCell>
                  <strong>Totals</strong>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <strong>{totals}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className='mt-8'>
          <Table>
            <TableBody>
              {/* Recommendations Header */}
              <TableRow>
                <TableCell className='font-semibold text-start w-[100px]'>
                  Recommendations
                </TableCell>
                <TableCell
                  className={`font-semibold text-lg w-[400px] ${
                    // If status is PENDING and recommendation is BARRED, treat as PENDING
                    (vendorEvaluationData?.data?.status === "PENDING" && 
                     vendorEvaluationData?.data?.evaluator_recommendation === "BARRED") ||
                    !vendorEvaluationData?.data?.evaluator_recommendation
                      ? "bg-blue-500 text-white text-center"
                      : vendorEvaluationData?.data?.evaluator_recommendation ===
                        "BARRED"
                      ? "bg-red-500 text-white text-center"
                      : vendorEvaluationData?.data?.evaluator_recommendation ===
                        "ON_PROBATION"
                      ? "bg-yellow-500 text-white text-center"
                      : vendorEvaluationData?.data?.evaluator_recommendation ===
                        "RETAIN"
                      ? "bg-green-500 text-white text-center"
                      : "bg-blue-500 text-white text-center"
                  }`}
                >
                  {(vendorEvaluationData?.data?.status === "PENDING" && 
                    vendorEvaluationData?.data?.evaluator_recommendation === "BARRED") ||
                   !vendorEvaluationData?.data?.evaluator_recommendation
                    ? "Pending"
                    : vendorEvaluationData?.data?.evaluator_recommendation ===
                      "BARRED"
                    ? "Barred"
                    : vendorEvaluationData?.data?.evaluator_recommendation ===
                      "ON_PROBATION"
                    ? "On Probation"
                    : vendorEvaluationData?.data?.evaluator_recommendation ===
                      "RETAIN"
                    ? "Retain"
                    : "Pending"}
                </TableCell>
                {/* {data.map((item, index) => (
                  <TableCell key={index} className='text-start'>
                    {item.recommendation}
                  </TableCell>
                ))} */}
              </TableRow>

              {/* Evaluator Child Rows */}
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell>
                  {vendorEvaluationData?.data?.evaluators[0]?.name}
                </TableCell>
              </TableRow>
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'>Evaluators</TableCell>
                <TableCell className='pl-6'>
                  {vendorEvaluationData?.data?.evaluation_date}
                </TableCell>
              </TableRow>
              <TableRow className='border-b-gray-300 border-t-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell>
                  {vendorEvaluationData?.data?.evaluators[0]?.name}
                </TableCell>{" "}
              </TableRow>

              {/* Supervisors Header */}
              {/* Supervisor Child Rows */}
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell>
                  {vendorEvaluationData?.data?.supervisors[0]?.name}
                </TableCell>
              </TableRow>
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'>
                  Supervisors
                </TableCell>
                <TableCell className='pl-6'>
                  {vendorEvaluationData?.data?.evaluation_date}
                </TableCell>
              </TableRow>
              <TableRow className='border-t-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell>
                  {vendorEvaluationData?.data?.supervisors[0]?.name}
                </TableCell>{" "}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default VendorPerformance;
