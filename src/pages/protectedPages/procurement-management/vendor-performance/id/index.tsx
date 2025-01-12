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

interface CompetencyData {
  competencyAreas: string;
  low: number;
  fair: number;
  satisfactorily: number;
  good: number;
  excellent: number;
}

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
  const [rows, setRows] = useState<CompetencyData[]>([]);
  const [data, setData] = useState<Recommendation[]>([]);

  // Simulating fetching data
  useEffect(() => {
    const fetchData = async () => {
      const competencyData: CompetencyData[] = [
        {
          competencyAreas: "Delivery leadtime",
          low: 0,
          fair: 0,
          satisfactorily: 0,
          good: 4,
          excellent: 0,
        },
        {
          competencyAreas: "Competitive Pricing",
          low: 0,
          fair: 0,
          satisfactorily: 0,
          good: 4,
          excellent: 0,
        },
        {
          competencyAreas: "Post-delivery after sales report",
          low: 0,
          fair: 0,
          satisfactorily: 3,
          good: 0,
          excellent: 0,
        },
        {
          competencyAreas: "Professionalism",
          low: 0,
          fair: 0,
          satisfactorily: 3,
          good: 0,
          excellent: 0,
        },
        {
          competencyAreas:
            "Responsiveness as well as satisfaction surveys among requesting departments and user department",
          low: 0,
          fair: 0,
          satisfactorily: 0,
          good: 4,
          excellent: 0,
        },
      ];

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
      setRows(competencyData);
    };

    fetchData();
  }, []);

  const calculateTotalCost = (row: CompetencyData) =>
    row.low * row.fair * row.satisfactorily * row.good * row.excellent;

  const totals = rows.reduce(
    (acc, row) => {
      const totalCost = calculateTotalCost(row);

      return {
        low: acc.low + row.low,
        fair: acc.fair + row.fair,
        satisfactorily: acc.satisfactorily + row.satisfactorily,
        good: acc.good + row.good,
        excellent: acc.excellent + row.excellent,
        totalCost: acc.totalCost + totalCost,
      };
    },
    {
      low: 0,
      fair: 0,
      satisfactorily: 0,
      good: 0,
      excellent: 0,
      totalCost: 0,
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
            <h2 className='min-w-[206px] text-[18px] font-semibold text-gray-900'>
              Vendor Performance:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              Car Hire Service
            </p>
          </div>
          <div className='flex items-center gap-[30px]'>
            <h2 className='min-w-[206px] text-[18px] font-semibold text-gray-900'>
              LOCATION OF SERVICE:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              Adamawa State
            </p>
          </div>
          <div className='flex items-center gap-[30px]'>
            <h2 className='min-w-[206px] text-[18px] font-semibold text-gray-900'>
              DATE:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>27-Jan-2023</p>
          </div>
          <div className='flex items-center gap-[30px]'>
            <h2 className='min-w-[206px] text-[18px] font-semibold text-gray-900'>
              REVIEWED PERIOD:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              Feb 1, 2022 - Jan 31, 2023
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
              {rows.map((row, index) => (
                <TableRow className='text-start' key={index}>
                  <TableCell className='max-w-[400px]'>
                    {row.competencyAreas}
                  </TableCell>
                  <TableCell>{row.low}</TableCell>
                  <TableCell>{row.fair}</TableCell>
                  <TableCell>{row.satisfactorily}</TableCell>
                  <TableCell>{row.good}</TableCell>
                  <TableCell>{row.excellent}</TableCell>
                </TableRow>
              ))}
              <TableRow className='text-start'>
                <TableCell>
                  <strong>Totals</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.low}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.fair}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.satisfactorily}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.good}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.excellent}</strong>
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
                {data.map((item, index) => (
                  <TableCell key={index}>{item.evaluator.name}</TableCell>
                ))}
              </TableRow>
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'>Evaluators</TableCell>
                <TableCell className='pl-6 font-semibold'>Date</TableCell>
                {data.map((item, index) => (
                  <TableCell key={index}>{item.evaluator.date}</TableCell>
                ))}
              </TableRow>
              <TableRow className='border-b-gray-300 border-t-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell className='pl-6 font-semibold'>Signature</TableCell>
                {data.map((item, index) => (
                  <TableCell key={index}>{item.evaluator.signature}</TableCell>
                ))}
              </TableRow>

              {/* Supervisors Header */}
              {/* Supervisor Child Rows */}
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell className='pl-6 font-semibold'>Name</TableCell>
                {data.map((item, index) => (
                  <TableCell key={index}>{item.supervisor.name}</TableCell>
                ))}
              </TableRow>
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'>
                  Supervisors
                </TableCell>
                <TableCell className='pl-6 font-semibold'>Date</TableCell>
                {data.map((item, index) => (
                  <TableCell key={index}>{item.supervisor.date}</TableCell>
                ))}
              </TableRow>
              <TableRow className='border-t-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell className='pl-6 font-semibold'>Signature</TableCell>
                {data.map((item, index) => (
                  <TableCell key={index}>{item.supervisor.signature}</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default VendorPerformance;
