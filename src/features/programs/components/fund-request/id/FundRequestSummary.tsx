import DataTable from "components/Table/DataTable";
import Card from "components/Card";
import { useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";
import { useParams } from "next/navigation";
import { fundRequestSummaryColumns } from "@/features/programs/components/table-columns/fund-request/fund-request-summary";
import TableFilters from "components/Table/TableFilters";
import { useGetSingleProject, useGetAllProjects } from "@/features/projects/controllers/projectController";

export default function FundRequestSummary() {
    const params = useParams();
    const id = params?.id as string;

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

    const projectFromSearch = projectsBySearch?.results?.[0];
    const actualProject = project || (projectFromSearch ? { data: projectFromSearch } : null);
    const actualProjectId = actualProject?.data?.id;

    // Use the actualProjectId if we have it, otherwise fallback to search parameter with the project_id
    // The 'project' param requires UUID, so if we don't have one, use 'search' instead
    const fundRequestParams = actualProjectId
        ? { project: actualProjectId, size: 1000, enabled: true }
        : { search: decodedId, size: 1000, enabled: !!decodedId };

    const { data: fundRequest, isLoading } = useGetAllFundRequests(fundRequestParams);

    return (
        <Card>
            <TableFilters>
                <DataTable
                    data={fundRequest?.data?.results || []}
                    columns={fundRequestSummaryColumns}
                    isLoading={isLoading}
                    footer={true}
                />
            </TableFilters>
        </Card>
    );
}
