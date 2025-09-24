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
import { useGetSingleUser } from "@/features/auth/controllers";
import { useMemo } from "react";
import { skipToken } from "@tanstack/react-query";

import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableRow,
} from "components/ui/table";

export default function AllFundRequestPreview() {
  const { id } = useParams();

  // Ensure id is a string
  const projectId = Array.isArray(id) ? id[0] : String(id || '');

  console.log('Project ID:', projectId, 'Type:', typeof projectId);

  const { data: fundRequest, isLoading } = useGetAllFundRequests({
    project: projectId,
  });

  const { data: project } = useGetSingleProject(projectId || skipToken);

  const fundRequestLength = fundRequest?.data?.results?.length || 0;

  const totalFundRequest = fundRequest?.data?.results
    ?.map((fundReq: any) => fundReq?.total_amount || 0)
    ?.reduce(
      (accumulator, value) =>
        Number(accumulator || 0) + Number(value || 0),
      0
    ) || 0;

  const availableBalance = fundRequest?.data?.results
    ?.map((fundReq: any) => fundReq?.available_balance || 0)
    ?.reduce(
      (accumulator, value) =>
        Number(accumulator || 0) + Number(value || 0),
      0
    ) || 0;

  // Get the first fund request to extract approval user IDs
  const firstFundRequest = fundRequest?.data?.results?.[0];

  // Only fetch user data if we have valid IDs
  const creatorId = firstFundRequest?.created_by;
  const locationReviewerId = firstFundRequest?.location_reviewer;
  const locationAuthorizerId = firstFundRequest?.location_authorizer;
  const hqApproverId = firstFundRequest?.hq_approver;

  const { data: creatorData } = useGetSingleUser(
    creatorId && typeof creatorId === 'string' ? creatorId : skipToken
  );
  const { data: locationReviewerData } = useGetSingleUser(
    locationReviewerId && typeof locationReviewerId === 'string' ? locationReviewerId : skipToken
  );
  const { data: locationAuthorizerData } = useGetSingleUser(
    locationAuthorizerId && typeof locationAuthorizerId === 'string' ? locationAuthorizerId : skipToken
  );
  const { data: hqApproverData } = useGetSingleUser(
    hqApproverId && typeof hqApproverId === 'string' ? hqApproverId : skipToken
  );

  // Generate signature information
  const signatureInfo = useMemo(() => {
    if (!firstFundRequest) return null;

    const formatDate = (dateString?: string) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch {
        return String(dateString);
      }
    };

    const getFullName = (userData: any) => {
      if (!userData?.data) return 'N/A';
      const { first_name, last_name } = userData.data;
      return first_name && last_name ? `${String(first_name)} ${String(last_name)}` : 'N/A';
    };

    return {
      preparedBy: {
        name: getFullName(creatorData),
        position: String(creatorData?.data?.position || 'N/A'),
        date: formatDate(firstFundRequest.created_datetime)
      },
      reviewedBy: {
        name: getFullName(locationReviewerData),
        position: String(locationReviewerData?.data?.position || 'N/A'),
        date: formatDate(firstFundRequest.updated_datetime)
      },
      authorizedBy: {
        name: getFullName(locationAuthorizerData),
        position: String(locationAuthorizerData?.data?.position || 'N/A'),
        date: formatDate(firstFundRequest.updated_datetime)
      },
      approvedBy: {
        name: getFullName(hqApproverData),
        position: String(hqApproverData?.data?.position || 'N/A'),
        date: formatDate(firstFundRequest.updated_datetime)
      }
    };
  }, [firstFundRequest, creatorData, locationReviewerData, locationAuthorizerData, hqApproverData]);

  return (
    <>
      <BackNavigation />
      <Card className='py-16'>
        <div className='flex flex-col items-center'>
          <img src={(logoPng as any).src || logoPng} alt='logo' width={150} />
          <h4 className='mt-5 text-lg font-bold'>
            Achieving Health Nigeria Initiative (AHNI)
          </h4>

          <h4 className='text-red-500 font-bold mt-2'>FUND REQUEST SUMMARY</h4>
        </div>

        <div className='border-[#DEA004] border-solid border-[2px] rounded-lg p-5 grid grid-cols-2 gap-8 mt-10'>
          <div className='space-y-3'>
            <h3 className='font-semibold'>Award/Project Title:</h3>

            <p className='font-semibold text-[#DEA004] text-xl'>
              {project?.data?.title || 'Project Title'}
            </p>
          </div>

          <div className='space-y-3'>
            <h3 className='font-semibold'>Project ID</h3>

            <p className='text-sm text-gray-500'>{project?.data?.project_id || 'N/A'}</p>
          </div>

          <div className='space-y-3'>
            <h3 className='font-semibold'>Project Start Date:</h3>

            <p className='text-sm text-gray-500'>{project?.data?.start_date || 'N/A'}</p>
          </div>

          <div className='space-y-3'>
            <h3 className='font-semibold'>Project End Date:</h3>

            <p className='text-sm text-gray-500'>{project?.data?.end_date || 'N/A'}</p>
          </div>
        </div>

        <div className='my-5'>
          <DataTable
            columns={columns}
            data={fundRequest?.data?.results || []}
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
              <div className='h-8 border-b border-gray-300 mt-2'></div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Prepared by:</h3>
              <div className='text-right'>
                <p className='font-semibold text-sm'>{signatureInfo?.preparedBy?.name || 'N/A'}</p>
                <p className='text-xs text-gray-600'>{signatureInfo?.preparedBy?.position || 'N/A'}</p>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Date:</h3>
              <p className='font-semibold text-sm'>{signatureInfo?.preparedBy?.date || 'N/A'}</p>
            </div>
          </div>

          <div className='p-5 border-solid border-gray-200 border-[1px] rounded-lg flex flex-col gap-3'>
            <div>
              <h3 className='font-bold'>Sign:</h3>
              <div className='h-8 border-b border-gray-300 mt-2'></div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Reviewed by:</h3>
              <div className='text-right'>
                <p className='font-semibold text-sm'>{signatureInfo?.reviewedBy?.name || 'N/A'}</p>
                <p className='text-xs text-gray-600'>{signatureInfo?.reviewedBy?.position || 'N/A'}</p>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Date:</h3>
              <p className='font-semibold text-sm'>{signatureInfo?.reviewedBy?.date || 'N/A'}</p>
            </div>
          </div>

          <div className='p-5 border-solid border-gray-200 border-[1px] rounded-lg flex flex-col gap-3'>
            <div>
              <h3 className='font-bold'>Sign:</h3>
              <div className='h-8 border-b border-gray-300 mt-2'></div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Authorized by:</h3>
              <div className='text-right'>
                <p className='font-semibold text-sm'>{signatureInfo?.authorizedBy?.name || 'N/A'}</p>
                <p className='text-xs text-gray-600'>{signatureInfo?.authorizedBy?.position || 'N/A'}</p>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Date:</h3>
              <p className='font-semibold text-sm'>{signatureInfo?.authorizedBy?.date || 'N/A'}</p>
            </div>
          </div>

          <div className='p-5 border-solid border-gray-200 border-[1px] rounded-lg flex flex-col gap-3'>
            <div>
              <h3 className='font-bold'>Sign:</h3>
              <div className='h-8 border-b border-gray-300 mt-2'></div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Approved by:</h3>
              <div className='text-right'>
                <p className='font-semibold text-sm'>{signatureInfo?.approvedBy?.name || 'N/A'}</p>
                <p className='text-xs text-gray-600'>{signatureInfo?.approvedBy?.position || 'N/A'}</p>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Date:</h3>
              <p className='font-semibold text-sm'>{signatureInfo?.approvedBy?.date || 'N/A'}</p>
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
    accessorFn: (row) => {
      const location = row.location;
      if (typeof location === 'string') return location;
      if (location && typeof location === 'object' && 'name' in location) {
        return String(location.name) || 'N/A';
      }
      return 'N/A';
    },
    size: 200,
    footer: () => <span>GRAND TOTAL</span>,
  },

  {
    header: "Fund Request For This Period",
    id: "amount",
    accessorFn: (data) => `$${data?.total_amount || 0}`,
    footer(props) {
      const data = props.table
        .getRowModel()
        .flatRows.map((row) => row.original);

      const sum = data
        .map((data: any) => data?.total_amount || 0)
        .reduce(
          (accumulator, value) =>
            (Number(accumulator || 0) + Number(value || 0)),
          0
        );

      return <span>${sum || 0}</span>;
    },
    size: 200,
  },

  {
    header: "Unique Identifier Code",
    id: "uuid_code",
    accessorFn: (data) => data?.uuid_code || 'N/A',
    size: 200,
  },
];
