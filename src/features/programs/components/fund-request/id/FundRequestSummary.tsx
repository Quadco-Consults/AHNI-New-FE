import DataTable from "@/components/Table/DataTable";
import Card from "@/components/Card";
import { useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";
import { useParams, useSearchParams } from "next/navigation";
import { fundRequestSummaryColumns } from "@/features/programs/components/table-columns/fund-request/fund-request-summary";
import TableFilters from "@/components/Table/TableFilters";
import { useGetSingleProject, useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useMemo } from "react";

export default function FundRequestSummary() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params?.id as string;

    // Get year and month from query parameters
    const yearFilter = searchParams?.get('year') || '';
    const monthFilter = searchParams?.get('month') || '';

    // Decode the URL-encoded ID
    const decodedId = decodeURIComponent(id || "");

    // Helper function to check if string is a valid UUID
    const isValidUUID = (str: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
    };

    const isUUID = isValidUUID(decodedId);

    // Fetch project: if UUID, get by ID; if not, search by project_id
    const { data: project } = useGetSingleProject(
        isUUID ? decodedId : "",
        isUUID
    );

    const { data: projectsBySearch } = useGetAllProjects({
        search: !isUUID ? decodedId : "",
        enabled: !!decodedId && !isUUID,
        size: 1,
    });

    const projectFromSearch = projectsBySearch?.data?.results?.[0];
    const actualProject = project || (projectFromSearch ? { data: projectFromSearch } : null);
    const actualProjectId = actualProject?.data?.id;

    // Use the actualProjectId if we have it, otherwise fallback to search parameter with the project_id
    // The 'project' param requires UUID, so if we don't have one, use 'search' instead
    const fundRequestParams = actualProjectId
        ? {
            project: actualProjectId,
            size: 1000,
            enabled: true,
            ...(yearFilter ? { year: parseInt(yearFilter) } : {}),
            ...(monthFilter ? { month: monthFilter } : {}),
          }
        : { search: decodedId, size: 1000, enabled: !!decodedId };

    const { data: fundRequest, isLoading } = useGetAllFundRequests(fundRequestParams);

    // Filter fund requests by year and month on the client side as well
    const filteredResults = useMemo(() => {
        if (!fundRequest?.data?.results) return [];

        let results = fundRequest.data.results;

        // Filter by year if specified
        if (yearFilter) {
            results = results.filter(req => req.year === yearFilter);
        }

        // Filter by month if specified
        if (monthFilter) {
            results = results.filter(req => req.month === monthFilter);
        }

        return results;
    }, [fundRequest?.data?.results, yearFilter, monthFilter]);

    return (
        <Card>
            {(yearFilter || monthFilter) && (
                <div className="mb-4 p-2 bg-blue-50 rounded text-sm text-blue-700">
                    Showing fund requests for: {monthFilter} {yearFilter}
                </div>
            )}
            <TableFilters>
                <DataTable
                    data={filteredResults}
                    columns={fundRequestSummaryColumns}
                    isLoading={isLoading}
                    footer={true}
                />
            </TableFilters>
        </Card>
    );
}
