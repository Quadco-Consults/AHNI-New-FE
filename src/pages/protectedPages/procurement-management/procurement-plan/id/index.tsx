import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useParams } from "react-router-dom";
import ProcurementPlan from "./ProcurementPlan";
import ProcurementMilestones from "./ProcurementMilestones";
import BreadcrumbCard from "components/shared/Breadcrumb";
import GoBack from "components/shared/GoBack";
import Card from "components/shared/Card";
import ProcurementPlanAPI from "services/procurementApi/procurement-plan";
import { LoadingSpinner } from "components/shared/Loading";
import { ProcurementPlanResultsData } from "definations/procurement-types/procurementPlan";

const ProcurementDetails = () => {
  const { id } = useParams();

  const { data, isLoading } = ProcurementPlanAPI.useGetProcurementPlanQuery({
    path: { id: id as string },
  });

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Procurement Plan", icon: true },
    { name: "Detail", icon: false },
  ];

  return (
    <div className="space-y-5 relative min-h-screen">
      <BreadcrumbCard list={breadcrumbs} />

      <GoBack />

      <Tabs defaultValue="procurement_plan">
        <div className="relative pb-2">
          <TabsList>
            <TabsTrigger value="procurement_plan">Procurement Plan</TabsTrigger>
            <TabsTrigger value="procurement_milestones">
              Procurement Milestones
            </TabsTrigger>
          </TabsList>
        </div>
        {isLoading && <LoadingSpinner />}
        <TabsContent value="procurement_plan">
          <Card>
            <ProcurementPlan {...(data as ProcurementPlanResultsData)} />
          </Card>
        </TabsContent>
        <TabsContent value="procurement_milestones">
          <Card>
            <ProcurementMilestones {...(data as ProcurementPlanResultsData)} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcurementDetails;
