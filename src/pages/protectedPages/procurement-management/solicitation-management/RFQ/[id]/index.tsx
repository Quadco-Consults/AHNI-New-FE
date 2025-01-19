import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Button } from "components/ui/button";
import { generatePath, Link, useParams } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import SolicitationAPI from "services/procurementApi/solicitation";
import { LoadingSpinner } from "components/shared/Loading";
import { SolicitationResultsData } from "definations/procurement-types/solicitation";
import DetailsContent from "./tab-contents/Details-content";
import VendorSubmission from "./tab-contents/Vendor-submission";
import BreadcrumbCard from "components/shared/Breadcrumb";

const RFQDetails = () => {
  const { id } = useParams();

  const { data, isLoading } = SolicitationAPI.useGetSolicitationQuery({
    path: { id: id as string },
  });

  if (isLoading) return <LoadingSpinner />;

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Solicitation Management", icon: true },
    { name: "RFQ", icon: true },
    { name: "Detail", icon: false },
  ];

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />
      <div className='flex justify-between'>
        <h4 className='text-lg font-bold'>{data?.name}</h4>

        <Link
          to={generatePath(RouteEnum.RFQ_CREATE_CBA, {
            id: id as string,
          })}
        >
          <Button>Create CBA</Button>
        </Link>
      </div>

      <Tabs defaultValue='rfq-details'>
        <TabsList>
          <TabsTrigger value='rfq-details'>RFQ Details</TabsTrigger>
          <TabsTrigger value='vendor-submission'>Vendor Submission</TabsTrigger>
        </TabsList>
        <TabsContent value='rfq-details'>
          <DetailsContent {...(data as SolicitationResultsData)} />
        </TabsContent>
        <TabsContent value='vendor-submission'>
          <VendorSubmission {...(data as SolicitationResultsData)} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RFQDetails;
