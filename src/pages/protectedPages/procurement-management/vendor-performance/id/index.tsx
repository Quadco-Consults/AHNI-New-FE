import Card from "components/shared/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { useEffect, useState } from "react";
import logoPng from "assets/svgs/logo-bg.svg";
import GoBack from "components/shared/GoBack";
import { useParams } from "react-router-dom";
import VendorsEvaluaionAndPerformanceAPI from "services/procurementApi/vendors-evaluation-performance";

interface Recommendation {
  recommendation: string;
  evaluator: {
    name: string;
    date: string;
    signature: string;
  };
  supervisor: {
    name: string;
    date: string;
    signature: string;
  };
}

const VendorPerformance = () => {
  const { id } = useParams();

  const { data: vendorEvaluationData } =
    VendorsEvaluaionAndPerformanceAPI.useGetVendorEvaluationQuery({
      path: { id: id as string },
    });

  const [data, setData] = useState<Recommendation[]>([]);

  // @ts-ignore
  const totals = vendorEvaluationData?.data?.criteria_scores.reduce(
    // @ts-ignore

    (sum, item) => sum + item.value,
    0
  );
  // Summing up the `value` field
  // const totalValue = criteria_scores.reduce((sum, item) => sum + item.value, 0);

  // Simulating fetching data
  useEffect(() => {
    const fetchData = async () => {
      const recommendations: Recommendation[] = [
        {
          recommendation: "On Probation",
          evaluator: {
            name: "Evaluator A",
            date: "01-Jan-2023",
            signature: "Signature A",
          },
          supervisor: {
            name: "Supervisor X",
            date: "02-Jan-2023",
            signature: "Signature X",
          },
        },
        {
          recommendation: "Barred",
          evaluator: {
            name: "Evaluator B",
            date: "01-Feb-2023",
            signature: "Signature B",
          },
          supervisor: {
            name: "Supervisor Y",
            date: "02-Feb-2023",
            signature: "Signature Y",
          },
        },
      ];

      setData(recommendations);
    };

    fetchData();
  }, []);

  const evaluators = vendorEvaluationData?.data?.evaluators.map(
    // @ts-ignore

    (item, index) => {
      return <TableCell key={index}>{item.name}</TableCell>;
    }
  );

  const supervisors = vendorEvaluationData?.data?.supervisors.map(
    // @ts-ignore

    (item, index) => {
      return <TableCell key={index}>{item.name}</TableCell>;
    }
  );

  return (
    <div className='bg-white p-8'>
      <GoBack />

      <div className='flex justify-center items-center flex-col'>
        <img src={logoPng} alt='logo' width={200} />
        <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
      </div>
      <div className='mt-8'>
        <Card className='border-primary flex flex-col gap-[17px]'>
          <div className='flex items-center gap-[30px]'>
            <h2 className='w-[240px] text-[18px] font-semibold text-gray-900'>
              Vendor Performance:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              {/* @ts-ignore */}

              {vendorEvaluationData?.data?.vendor?.name}
            </p>
          </div>
          <div className='flex items-center gap-[30px]'>
            <h2 className='w-[240px] text-[18px] font-semibold text-gray-900'>
              LOCATION OF SERVICE:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              {/* @ts-ignore */}

              {vendorEvaluationData?.data?.location_of_service}
            </p>
          </div>
          <div className='flex items-center gap-[30px]'>
            <h2 className='w-[240px] text-[18px] font-semibold text-gray-900'>
              REVIEWED START PERIOD:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              {/* @ts-ignore */}

              {vendorEvaluationData?.data?.reviewed_period_start}
            </p>
          </div>
          <div className='flex items-center gap-[30px]'>
            <h2 className='w-[240px] text-[18px] font-semibold text-gray-900'>
              REVIEWED END PERIOD:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              {/* @ts-ignore */}

              {vendorEvaluationData?.data?.reviewed_period_end}
            </p>
          </div>
        </Card>

        <Card className='border-primary flex flex-col gap-[17px] bg-[#FEF2F2] justify-center items-center mt-20'>
          <p className='font-semibold text-[24px]'>EVALUATION</p>
        </Card>

        <div className='mt-8'>
          <Table>
            <TableHeader>
              <TableRow className='text-center'>
                <TableCell className='max-w-[100px]'>
                  COMPETENCY AREAS
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
                <TableCell className='font-semibold text-start'>
                  Recommendations
                </TableCell>
                <TableCell className='text-start'>Retain</TableCell>
                {data.map((item, index) => (
                  <TableCell key={index} className='text-start'>
                    {item.recommendation}
                  </TableCell>
                ))}
              </TableRow>

              {/* Evaluator Child Rows */}
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell className='pl-6 font-semibold'>Name</TableCell>

                {vendorEvaluationData?.data?.evaluator_recommendation !==
                  "BARRED" && evaluators[0]}

                {vendorEvaluationData?.data?.evaluator_recommendation ===
                  "BARRED" && evaluators[0]}
              </TableRow>
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'>Evaluators</TableCell>
                <TableCell className='pl-6 font-semibold'>Date</TableCell>
                {vendorEvaluationData?.data?.evaluator_recommendation !==
                  "BARRED" && (
                  <TableCell className='pl-6'>
                    {vendorEvaluationData?.data?.evaluation_date}
                  </TableCell>
                )}

                {vendorEvaluationData?.data?.evaluator_recommendation ===
                  "BARRED" && (
                  <TableCell className='pl-6'>
                    {vendorEvaluationData?.data?.evaluation_date}
                  </TableCell>
                )}
              </TableRow>
              <TableRow className='border-b-gray-300 border-t-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell className='pl-6 font-semibold'>Signature</TableCell>
                {vendorEvaluationData?.data?.evaluator_recommendation !==
                  "BARRED" && evaluators[0]}

                {vendorEvaluationData?.data?.evaluator_recommendation ===
                  "BARRED" && evaluators[0]}
              </TableRow>

              {/* Supervisors Header */}
              {/* Supervisor Child Rows */}
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell className='pl-6 font-semibold'>Name</TableCell>
                {vendorEvaluationData?.data?.supervisor_recommendation !==
                  "BARRED" && supervisors[0]}

                {vendorEvaluationData?.data?.supervisor_recommendation ===
                  "BARRED" && supervisors[0]}
              </TableRow>
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'>
                  Supervisors
                </TableCell>
                <TableCell className='pl-6 font-semibold'>Date</TableCell>
                {vendorEvaluationData?.data?.supervisor_recommendation !==
                  "BARRED" && (
                  <TableCell className='pl-6'>
                    {vendorEvaluationData?.data?.supervision_date}
                  </TableCell>
                )}

                {vendorEvaluationData?.data?.supervisor_recommendation ===
                  "BARRED" && (
                  <TableCell className='pl-6'>
                    {vendorEvaluationData?.data?.supervision_date}
                  </TableCell>
                )}
              </TableRow>
              <TableRow className='border-t-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell className='pl-6 font-semibold'>Signature</TableCell>
                {vendorEvaluationData?.data?.supervisor_recommendation !==
                  "BARRED" && supervisors[0]}

                {vendorEvaluationData?.data?.supervisor_recommendation ===
                  "BARRED" && supervisors[0]}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default VendorPerformance;
