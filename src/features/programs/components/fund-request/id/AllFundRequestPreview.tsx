"use client";

import { ColumnDef } from "@tanstack/react-table";
import logoPng from "assets/imgs/logo.png";
import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { FundRequestPaginatedData } from "@/features/programs/types/fund-request";
import { useParams } from "next/navigation";
import { useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";
import { useGetSingleProject } from "@/features/projects/controllers/projectController";

import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableRow,
} from "components/ui/table";

export default function AllFundRequestPreview() {
  const { id } = useParams();

  const { data: fundRequest, isLoading } = useGetAllFundRequests({
    project: id,
  });

  const { data: project } = useGetSingleProject(id);

  const fundRequestLength = fundRequest?.data?.results?.length;

  const totalFundRequest = fundRequest?.data?.results
    ?.map((fundReq: any) => fundReq.total_amount)
    ?.reduce(
      (accumulator, value) =>
        (Number(accumulator as any) + Number(value as any)) as any,
      0
    ) || 0;

  const availableBalance = fundRequest?.data?.results
    ?.map((fundReq: any) => fundReq.available_balance)
    ?.reduce(
      (accumulator, value) =>
        (Number(accumulator as any) + Number(value as any)) as any,
      0
    ) || 0;

  return (
    <>
      <BackNavigation />
      <Card className='py-16'>
        <div className='flex flex-col items-center'>
          <img src={logoPng} alt='logo' width={150} />
          <h4 className='mt-5 text-lg font-bold'>
            Achieving Health Nigeria Initiative (AHNI)
          </h4>

          <h4 className='text-red-500 font-bold mt-2'>FUND REQUEST SUMMARY</h4>
        </div>

        <div className='border-[#DEA004] border-solid border-[2px] rounded-lg p-5 grid grid-cols-2 gap-8 mt-10'>
          <div className='space-y-3'>
            <h3 className='font-semibold'>Award/Project Title:</h3>

            <p className='font-semibold text-[#DEA004] text-xl'>
              {project?.data.title}
            </p>
          </div>

          <div className='space-y-3'>
            <h3 className='font-semibold'>Project ID</h3>

            <p className='text-sm text-gray-500'>{project?.data.project_id}</p>
          </div>

          <div className='space-y-3'>
            <h3 className='font-semibold'>Project Start Date:</h3>

            <p className='text-sm text-gray-500'>{project?.data.start_date}</p>
          </div>

          <div className='space-y-3'>
            <h3 className='font-semibold'>Project End Date:</h3>

            <p className='text-sm text-gray-500'>{project?.data.end_date}</p>
          </div>
        </div>

        <div className='my-5'>
          <DataTable
            columns={columns}
            data={fundRequest?.data.results || []}
            isLoading={isLoading}
            pagination={false}
            footer={true}
          />

          <div className='my-5'>
            <ShadTable>
              <TableBody>
                <TableRow>
                  <TableCell
                    style={{
                      minWidth: 90,
                      maxWidth: 90,
                    }}
                  >
                    {/* @ts-ignore */}
                    {(fundRequestLength + 1).toFixed(2)}
                  </TableCell>
                  <TableCell className='font-medium'>
                    TOTAL FUND REQUEST
                  </TableCell>
                  <TableCell>${totalFundRequest ?? "N/A"}</TableCell>
                  <TableCell
                    rowSpan={3}
                    className='text-center text-red-400 font-medium'
                  >
                    General Comment and Recommendation
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    style={{
                      minWidth: 90,
                      maxWidth: 90,
                    }}
                  >
                    {/* @ts-ignore */}
                    {(fundRequestLength + 2).toFixed(2)}
                  </TableCell>
                  <TableCell className='font-medium'>BALANCE ON HAND</TableCell>
                  <TableCell>${availableBalance ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{
                      minWidth: 90,
                      maxWidth: 90,
                    }}
                  >
                    {/* @ts-ignore */}
                    {(fundRequestLength + 3).toFixed(2)}
                  </TableCell>
                  <TableCell className='font-medium'>
                    AMOUNT DUE TO ACE HEAD OFFICE
                  </TableCell>
                  <TableCell>
                    {/* @ts-ignore */}${totalFundRequest - availableBalance}
                  </TableCell>
                </TableRow>
              </TableBody>
            </ShadTable>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-5 mt-5'>
          <div className='p-5 border-solid border-gray-200 border-[1px] rounded-lg flex flex-col gap-3'>
            <div>
              <h3 className='font-bold'>Sign:</h3>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Prepared by:</h3>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Date:</h3>
            </div>
          </div>

          <div className='p-5 border-solid border-gray-200 border-[1px] rounded-lg flex flex-col gap-3'>
            <div>
              <h3 className='font-bold'>Sign:</h3>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Reviewed by:</h3>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Date:</h3>
            </div>
          </div>

          <div className='p-5 border-solid border-gray-200 border-[1px] rounded-lg flex flex-col gap-3'>
            <div>
              <h3 className='font-bold'>Sign:</h3>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Authorized by:</h3>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Date:</h3>
            </div>
          </div>

          <div className='p-5 border-solid border-gray-200 border-[1px] rounded-lg flex flex-col gap-3'>
            <div>
              <h3 className='font-bold'>Sign:</h3>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Approved by:</h3>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Date:</h3>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

const columns: ColumnDef<FundRequestPaginatedData>[] = [
  {
    header: "S/N",
    accessorFn: (_, index) => `${(index + 1).toFixed(2)}`,
    size: 80,
  },

  {
    header: "Location",
    id: "location",
    accessorKey: "location",
    size: 200,
    footer: () => <span>GRAND TOTAL</span>,
  },

  {
    header: "Fund Request For This Period",
    id: "amount",
    accessorFn: (data) => `$${data.total_amount}`,
    footer(props) {
      const data = props.table
        .getRowModel()
        .flatRows.map((row) => row.original);

      const sum = data
        .map((data: any) => data.total_amount)
        .reduce(
          (accumulator, value) =>
            (Number(accumulator as any) + Number(value as any)) as any,
          0
        );

      return <span>${sum}</span>;
    },
    size: 200,
  },

  {
    header: "Unique Identifier Code",
    id: "uuid_code",
    accessorKey: "uuid_code",
    size: 200,
  },
];
