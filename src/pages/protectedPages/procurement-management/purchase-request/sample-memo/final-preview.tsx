import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { RouteEnum } from "constants/RouterConstants";
import React, { useEffect, useState } from "react";
import { generatePath, Link } from "react-router-dom";
import logoPng from "assets/svgs/logo-bg.svg";

const Preview = () => {
  const [rows, setRows] = useState([]);

  // Simulating fetching data
  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          item: "Stationery",
          quantity: 10,
          days: 2,
          facility: 3,
          frequency: 1,
          unitCost: 5,
        },
        {
          item: "Transport",
          quantity: 5,
          days: 1,
          facility: 2,
          frequency: 2,
          unitCost: 15,
        },
        {
          item: "Meals",
          quantity: 20,
          days: 5,
          facility: 1,
          frequency: 3,
          unitCost: 10,
        },
      ];
      setRows(data);
    };

    fetchData();
  }, []);

  const calculateTotalCost = (row) =>
    row.quantity * row.days * row.facility * row.frequency * row.unitCost;

  const totals = rows.reduce(
    (acc, row) => {
      const totalCost = calculateTotalCost(row);
      return {
        quantity: acc.quantity + row.quantity,
        days: acc.days + row.days,
        facility: acc.facility + row.facility,
        frequency: acc.frequency + row.frequency,
        unitCost: acc.unitCost + row.unitCost,
        totalCost: acc.totalCost + totalCost,
      };
    },
    {
      quantity: 0,
      days: 0,
      facility: 0,
      frequency: 0,
      unitCost: 0,
      totalCost: 0,
    }
  );
  return (
    <div className='bg-white p-8'>
      <section className='min-h-screen space-y-8'>
        <div className='flex w-full items-center justify-end gap-4'>
          <Link
            className='w-fit'
            to={generatePath(RouteEnum.CREATE_PURCHASE_REQUEST)}
          >
            <Button className='flex gap-2 py-6'>
              <AddSquareIcon />
              New Purchase Request
            </Button>
          </Link>
        </div>

        <div className='flex justify-center items-center flex-col'>
          <img src={logoPng} alt='logo' width={200} />
          <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
        </div>
        <div className='bg-alternate text-primary px-6 py-3 my-2'>
          Activity: 9.2.2 Anambra State Office Admin Cost Q3 (July - September
          2024)
        </div>
        <div className=' my-3'>
          <div className='flex border-gray-200 border max-w-[800px] w-full'>
            <div className=' border-r border-gray-200 w-full max-w-[321px] p-3'>
              Request Date:
            </div>
            <div className='w-full max-w-[490px] p-3'>15/07/2024</div>
          </div>
          <div className='flex border-gray-200 border max-w-[800px] w-full'>
            <div className=' border-r border-gray-200 w-full max-w-[321px] p-3'>
              Location:
            </div>
            <div className='w-full max-w-[490px] p-3'>Anambra</div>
          </div>{" "}
          <div className='flex border-gray-200 border max-w-[800px] w-full'>
            <div className=' border-r border-gray-200 w-full max-w-[321px] p-3'>
              Duration:
            </div>
            <div className='w-full max-w-[490px] p-3'>
              Q3 (July - September 2024)
            </div>
          </div>{" "}
          <div className='flex border-gray-200 border max-w-[800px] w-full'>
            <div className=' border-r border-gray-200 w-full max-w-[321px] p-3'>
              FCO #:{" "}
            </div>
            <div className='w-full max-w-[490px] p-3'>N-THRIP</div>
          </div>
        </div>
        <div className=' my-3'>
          <div className='flex border-gray-200 border max-w-[800px] w-full'>
            <div className=' border-r border-gray-200 w-full max-w-[321px] p-3'>
              Module: Program Management{" "}
            </div>
            <div className='w-full max-w-[490px] p-3'>
              Inventory: Grant Management
            </div>
          </div>
          <div className='flex border-gray-200 border max-w-[800px] w-full'>
            <div className=' border-r border-gray-200 w-full max-w-[321px] p-3'>
              Budget Line #: 916
            </div>
            <div className='w-full max-w-[490px] p-3'>Cost Grouping #: 11</div>
          </div>{" "}
          <div className='flex border-gray-200 border max-w-[800px] w-full'>
            <div className=' border-r border-gray-200 w-full max-w-[321px] p-3'>
              Cost input #: 11.1
            </div>
            <div className='w-full max-w-[490px] p-3'>
              Funding Source #: Global Fund
            </div>
          </div>{" "}
        </div>
        <div className='mt-8'>
          <Table>
            <TableHeader>
              <TableRow className='text-center'>
                <TableCell>Expense Item</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell># of Days</TableCell>
                <TableCell># of Facility</TableCell>
                <TableCell># Frequency</TableCell>
                <TableCell>Unit Cost</TableCell>
                <TableCell>Total Cost</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.item}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.days}</TableCell>
                  <TableCell>{row.facility}</TableCell>
                  <TableCell>{row.frequency}</TableCell>
                  <TableCell>{row.unitCost.toFixed(2)}</TableCell>
                  <TableCell>{calculateTotalCost(row).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <strong>Totals</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.quantity}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.days}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.facility}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.frequency}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.unitCost.toFixed(2)}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.totalCost.toFixed(2)}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div>
          {" "}
          <Card className='border-primary space-y-3 mt-8 w-full mx-auto'>
            <div className='flex justify-between'>
              <div className='flex flex-col gap-3'>
                {" "}
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Signature
                  </h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Prepared By:
                  </h4>
                  <h4 className='text-[14px] whitespace-nowrap'>Onyeka Uwgu</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Date
                  </h4>
                  <h4>15/7/2024</h4>
                </div>
              </div>{" "}
              <div className='flex flex-col gap-3'>
                {" "}
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Signature
                  </h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Reviewed By:
                  </h4>
                  <h4 className='text-[14px] whitespace-nowrap'>Tine Woji</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Date
                  </h4>
                  <h4>15/7/2024</h4>
                </div>
              </div>
              <div className='flex flex-col gap-3'>
                {" "}
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Signature
                  </h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Approved By:
                  </h4>
                  <h4 className='text-[14px] whitespace-nowrap'>
                    Dr. Umar Adamu
                  </h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Date
                  </h4>
                  <h4>15/7/2024</h4>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Preview;
