import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Button } from "components/ui/button";
import { generatePath, Link, useParams } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import { LoadingSpinner } from "components/shared/Loading";
// import { SolicitationResultsData } from "definations/procurement-types/solicitation";
import DetailsContent from "./tab-contents/Details-content";
import VendorSubmission from "./tab-contents/Vendor-submission";
import BreadcrumbCard from "components/shared/Breadcrumb";
import { useGetSingleSolicitationQuery } from "services/procurementApi/solicitation";
import { skipToken } from "@reduxjs/toolkit/query/react";

const RFQDetails = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetSingleSolicitationQuery(id ?? skipToken);

  console.log({ data, id });

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
        <h4 className='text-lg font-bold'>{data?.data.title}</h4>

        <Link
          //   to={generatePath(RouteEnum.RFQ_CREATE_CBA, {
          //     id: id as string,
          //   })}
          to={{ pathname: RouteEnum.RFQ_CREATE_CBA, search: `?id=${id}` }}
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
          {data && <DetailsContent {...data?.data} />}
        </TabsContent>
        <TabsContent value='vendor-submission'>
          {data && <VendorSubmission {...data?.data} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RFQDetails;
