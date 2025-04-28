import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "atoms/BackNavigation";
import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import { LoadingSpinner } from "components/shared/Loading";
import { closeOutPlanTaskColumns } from "components/Table/columns/c&g/closeout-plan/closeout-plan-tasks";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { useParams } from "react-router-dom";
import { useGetSingleCloseOutPlanQuery } from "services/c&g/closeout-plan";

export default function CloseOutPlan() {
    const { id } = useParams();

    const { data, isLoading } = useGetSingleCloseOutPlanQuery(id ?? skipToken);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (data) {
        return (
            <main className="space-y-5">
                <BackNavigation />

                <Tabs defaultValue="summary">
                    <TabsList className="ml-10">
                        <TabsTrigger value="summary">MD OFFICE</TabsTrigger>

                        <TabsTrigger value="obligation">FINANCE</TabsTrigger>

                        <TabsTrigger value="performance">ICT</TabsTrigger>

                        <TabsTrigger value="uploads">C&G</TabsTrigger>

                        <TabsTrigger value="activity">PROCUREMENT</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Card className="space-y-10">
                    <div className="grid grid-cols-4 gap-5">
                        <DescriptionCard
                            label="Project"
                            description={data.data.project.title}
                        />

                        <DescriptionCard
                            label="Department"
                            description={data.data.department.name}
                        />

                        <DescriptionCard
                            label="Location"
                            description={data.data.location.name}
                        />

                        <DescriptionCard
                            label="Key Task"
                            description={data.data.key_task}
                        />
                    </div>

                    <TableFilters>
                        <DataTable
                            columns={closeOutPlanTaskColumns}
                            data={data.data.tasks || []}
                            isLoading={isLoading}
                        />
                    </TableFilters>
                </Card>
            </main>
        );
    }
}
