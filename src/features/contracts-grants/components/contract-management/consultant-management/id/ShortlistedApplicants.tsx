"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import Card from "components/Card";
import { consultancyStaffColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultant-management/consultant-applicant";
import { shortlistedApplicantColumn } from "@/features/contracts-grants/components/table-columns/contract-management/consultant-management/shortlisted-applicant";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetAllConsultancyStaffs } from "@/features/contracts-grants/controllers/consultancyApplicantsController";

export default function ShortlistedAppplicants() {
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(1);

  const { data, isFetching } = useGetAllConsultancyStaffs(
    id
      ? {
          page: currentPage,
          size: 10,
          consultant_id: id,
          status: "SHORTLISTED",
        }
      : skipToken
  );

  // Debug logging for shortlisted
  console.log("ShortlistedApplicants - Data:", data);
  console.log("ShortlistedApplicants - Applicants:", data?.data?.results?.map(a => ({ name: a.name, status: a.status })));

  return (
    <section className='space-y-5'>
      <h1 className='text-xl font-bold'>Shortlisted Applicants</h1>
      <Card>
        <TableFilters>
          <DataTable
            columns={shortlistedApplicantColumn}
            data={data?.data.results || []}
            isLoading={isFetching}
            pagination={{
              total: data?.data?.pagination?.count ?? 0,
              pageSize: data?.data?.pagination?.page_size ?? 0,
              onChange: (page: number) => setCurrentPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </section>
  );
}
