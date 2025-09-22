import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
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
import Link from "next/link";
import logoPng from "@/assets/svgs/logo-bg.svg";

const PurchaseRequestForm = () => {
  const [rows, setRows] = useState([]);

  // Simulating fetching data
  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          item: "Stationery",
          quantity: 10,
          number: 2,
          facility: 3,
          frequency: 1,
          unitCost: 5,
        },
        {
          item: "Transport",
          quantity: 5,
          number: 1,
          facility: 2,
          frequency: 2,
          unitCost: 15,
        },
        {
          item: "Meals",
          quantity: 20,
          number: 5,
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
    row.quantity * row.number * row.facility * row.frequency * row.unitCost;

  const totals = rows.reduce(
    (acc, row) => {
      const totalCost = calculateTotalCost(row);
      return {
        quantity: acc.quantity + row.quantity,
        number: acc.number + row.number,
        facility: acc.facility + row.facility,
        frequency: acc.frequency + row.frequency,
        unitCost: acc.unitCost + row.unitCost,
        totalCost: acc.totalCost + totalCost,
      };
    },
    {
      quantity: 0,
      number: 0,
      facility: 0,
      frequency: 0,
      unitCost: 0,
      totalCost: 0,
    }
  );
  return (
    <section className='min-h-screen space-y-8'>
      <div className='flex justify-center items-center flex-col'>
        <img src={logoPng} alt='logo' width={200} />
        <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
      </div>
      <h2 className='text-center'>PURCHASE REQUEST FORM</h2>
      <div>
        {" "}
        <div className='flex items-center justify-end'>
          {/* <FormButton
              loading={isLoading}
              disabled={isLoading}
              type='submit'
              className='flex items-center justify-center gap-2'
            >
              Submit
              <LongArrowRight />
            </FormButton> */}

          <h3 className='flex gap-2 p-2 bg-alternate border border-primary rounded'>
            <strong>Ref:</strong>
            AKS/ODC/1.46
          </h3>
        </div>
        <Card className='border-primary space-y-3 mt-8 w-full mx-auto'>
          <div className='flex justify-between'>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col items-center gap-5'>
                <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                  Date of Request
                </h4>
                <h4>15/7/2024</h4>
              </div>
            </div>{" "}
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col items-center gap-5'>
                <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                  Date Required
                </h4>
                <h4>31/8/2024</h4>
              </div>
            </div>{" "}
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col items-center gap-5'>
                <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                  Requesting Dept.{" "}
                </h4>
                <h4>Finance & Admin</h4>
              </div>
            </div>{" "}
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col items-center gap-5'>
                <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                  Deliver
                </h4>
                <h4>ANHI</h4>
              </div>
            </div>{" "}
          </div>
        </Card>
      </div>
      <div className='mt-8'>
        <Table>
          <TableHeader>
            <TableRow className='text-center'>
              <TableCell>S/N</TableCell>
              <TableCell>Description of items/services</TableCell>
              <TableCell>FCO/Activity No</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Cost</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow className='text-center' key={index}>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.item}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.facility}</TableCell>
                <TableCell>{row.unitCost.toFixed(2)}</TableCell>
                <TableCell>{calculateTotalCost(row).toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow className='text-center'>
              <TableCell>
                <strong>Totals</strong>
              </TableCell>
              <TableCell>
                <strong>{totals.quantity}</strong>
              </TableCell>
              <TableCell>
                <strong>{totals.number}</strong>
              </TableCell>
              <TableCell>
                <strong>{totals.facility}</strong>
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

      <div className=' grid grid-cols-2 gap-y-12'>
        <div className=' space-y-3'>
          <p>Signed</p>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Requested By</h4>
            <h4>Godwin Alemaka</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Date:</h4>
            <h4>28/8/2024</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Signature:</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Signature:</h4>
            <Badge className='bg-green-500/30 text-green-500 p-2 rounded-md'>
              Approved
            </Badge>{" "}
            <Badge className='bg-alternate text-primary  p-2 rounded-md'>
              Not Approved
            </Badge>{" "}
          </div>
        </div>
        <div className=' space-y-3'>
          <p>Signed</p>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'> Reviewed By</h4>
            <h4>Finance</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Name</h4>
            <h4>Margaret Olawuyi (SFAO)</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Date:</h4>
            <h4>28/8/2024</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Signature:</h4>
          </div>
        </div>{" "}
        <div className=' space-y-3'>
          <p>Signed</p>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Authorized By</h4>
            <h4>Budget Monitor (SPA, PM)</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Name</h4>
            <h4>Kufre-Abasi Ukpong</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Date:</h4>
            <h4>28/8/2024</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Signature:</h4>
          </div>
        </div>{" "}
        <div className=' space-y-3'>
          <p>Signed</p>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Approved By</h4>
            <h4>Director of Operations</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Name</h4>
            <h4>Irene Osaigbovo</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Date:</h4>
            <h4>28/8/2024</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Signature:</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PurchaseRequestForm;
