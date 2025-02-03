import Card from "components/shared/Card";
import { subGrantSubmissionColumns } from "components/Table/columns/c&g/sub-grant/submission";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { ISubGrantSingleData } from "definations/c&g/sub-grant";

export default function SubGrantSubmissionDetails({}: ISubGrantSingleData) {
    return (
        <Card>
            <TableFilters>
                <DataTable
                    columns={subGrantSubmissionColumns}
                    data={[]}
                    isLoading={false}
                />
            </TableFilters>
        </Card>
    );
}
