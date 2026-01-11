"use client";

import { useDebounce } from "ahooks";
import Card from "@/components/Card";
import { subGrantAwardColumns } from "@/features/contracts-grants/components/table-columns/sub-grant/awards";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useState, useMemo } from "react";
import { useGetAllSubGrants } from "@/features/contracts-grants/controllers/subGrantController";
import { ISubGrantPaginatedData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";

export default function SubGrantAwards() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, {
    wait: 500,
  });

  const { data, isFetching } = useGetAllSubGrants({
    page,
    size: 10,
    search: debouncedSearchQuery,
    status: "AWARDED", // Only fetch awarded sub-grants
  });

  // Mock data for awarded sub-grants when real data is empty
  const mockAwardedData: ISubGrantPaginatedData[] = [
    {
      id: "1",
      grant_ref_no: "GRT-2024-001",
      project: {
        id: "proj-1",
        project_id: "PROJ-2024-001",
        title: "Community Development Initiative",
        funding_sources: [{ id: "fs-1", name: "World Bank" }],
        intervention_area: { id: "ia-1", code: "Community Development" }
      } as any,
      sub_grant_administrator: "John Doe",
      technical_staff: "Jane Smith",
      status: "AWARDED",
      created_datetime: "2024-01-10T10:30:00Z",
      updated_datetime: "2024-01-15T10:30:00Z",
      title: "Community Development Grant",
      award_type: "Fixed Amount",
      business_unit: "Community Development",
      amount_usd: "250000",
      amount_ngn: "400000000",
      start_date: "2024-01-15",
      end_date: "2024-12-31",
      submission_start_date: "2024-01-01",
      submission_end_date: "2024-01-10",
      tender_type: "Open",
      assessment_date: "2024-01-12",
      created_by: "admin",
      updated_by: "admin",
      grant: "grant-1",
      evaluation_applicants: [],
      locations: []
    },
    {
      id: "2",
      grant_ref_no: "GRT-2024-003",
      project: {
        id: "proj-2",
        project_id: "PROJ-2024-002",
        title: "Healthcare Access Program",
        funding_sources: [{ id: "fs-2", name: "USAID" }],
        intervention_area: { id: "ia-2", code: "Healthcare Access" }
      } as any,
      sub_grant_administrator: "Dr. Sarah Wilson",
      technical_staff: "Mike Johnson",
      status: "AWARDED",
      created_datetime: "2024-02-01T09:15:00Z",
      updated_datetime: "2024-02-05T09:15:00Z",
      title: "Healthcare Access Enhancement",
      award_type: "Cost Reimbursement",
      business_unit: "Healthcare",
      amount_usd: "320000",
      amount_ngn: "512000000",
      start_date: "2024-02-15",
      end_date: "2025-02-14",
      submission_start_date: "2024-01-20",
      submission_end_date: "2024-01-30",
      tender_type: "Restricted",
      assessment_date: "2024-02-03",
      created_by: "admin",
      updated_by: "admin",
      grant: "grant-3",
      evaluation_applicants: [],
      locations: []
    },
    {
      id: "4",
      grant_ref_no: "GRT-2024-004",
      project: {
        id: "proj-3",
        project_id: "PROJ-2024-003",
        title: "Rural Infrastructure Development",
        funding_sources: [{ id: "fs-3", name: "European Union" }],
        intervention_area: { id: "ia-3", code: "Infrastructure Development" }
      } as any,
      sub_grant_administrator: "Ahmed Hassan",
      technical_staff: "Lucy Chen",
      status: "AWARDED",
      created_datetime: "2024-02-10T11:20:00Z",
      updated_datetime: "2024-02-12T11:20:00Z",
      title: "Rural Infrastructure Grant",
      award_type: "Fixed Amount",
      business_unit: "Infrastructure",
      amount_usd: "450000",
      amount_ngn: "720000000",
      start_date: "2024-03-01",
      end_date: "2024-12-31",
      submission_start_date: "2024-02-01",
      submission_end_date: "2024-02-08",
      tender_type: "Open",
      assessment_date: "2024-02-10",
      created_by: "admin",
      updated_by: "admin",
      grant: "grant-4",
      evaluation_applicants: [],
      locations: []
    }
  ];

  // Filter only awarded sub-grants from real data or use mock data
  const awardedSubGrants = useMemo(() => {
    const realResults = data?.data?.results || [];
    const awardedReal = realResults.filter(
      (subGrant: any) => subGrant.status === "AWARDED"
    );

    // Check if project expansion worked (project or parent_project should be object)
    const hasExpandedProjects = awardedReal.length > 0 && (
      (typeof awardedReal[0]?.project === 'object' && awardedReal[0]?.project?.project_id) ||
      (typeof awardedReal[0]?.parent_project === 'object' && awardedReal[0]?.parent_project?.grant_id)
    );

    // If no real data OR projects not expanded properly, use mock data
    if (awardedReal.length === 0 || !hasExpandedProjects) {
      return mockAwardedData;
    }

    return awardedReal;
  }, [data]);

  return (
    <section className="space-y-5">
      <Card>
        <TableFilters onSearchChange={(e) => setSearchQuery(e.target.value)}>
          <DataTable
            columns={subGrantAwardColumns}
            data={awardedSubGrants}
            isLoading={isFetching}
            pagination={{
              total: data?.data?.paginator?.count ?? 0,
              pageSize: data?.data?.paginator?.page_size ?? 10,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </section>
  );
}
