import { Button } from "components/ui/button";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "components/shared/Loading";
import BreadcrumbCard from "components/shared/Breadcrumb";
import CbaAPI from "services/procurementApi/cba";
import Card from "components/shared/Card";
import { Badge } from "components/ui/badge";
import { Icon } from "@iconify/react";
import { SolicitationItems } from "definations/procurement-types/solicitation";
import GoBack from "components/shared/GoBack";
import { CommitteeMemberData } from "definations/procurement-types/cba";

const CompetitiveBidAnalysisDetail = () => {
  const { id } = useParams();

  const { data, isLoading } = CbaAPI.useGetCbaQuery({
    path: { id: id as string },
  });

  if (isLoading) return <LoadingSpinner />;

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Competitive Bid Analysis", icon: true },
    { name: "Detail", icon: false },
  ];

  return (
    <div className="space-y-5">
      <BreadcrumbCard list={breadcrumbs} />

      <GoBack />

      <Card className="space-y-8 p-10">
        <h2 className="font-semibold text-lg">{data?.title}</h2>

        <h4 className="text-green-dark text-base font-semibold">
          Status <Badge>{data?.status.toLowerCase()}</Badge>
        </h4>

        <div className="flex items-center gap-10">
          <div className="flex gap-3 items-center">
            <Icon icon="ooui:reference" fontSize={18} />
            <h6>{data?.lot}</h6>
          </div>
          <div className="flex gap-3 items-center">
            <Icon icon="lets-icons:date-today-duotone" fontSize={18} />
            <h6>{data?.cba_date}</h6>
          </div>
          <div className="flex gap-3 items-center">
            <Icon icon="solar:case-minimalistic-bold-duotone" fontSize={18} />
            <h6>{data?.cba_type}</h6>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-base">Remarks:</h2>
          <h4 className=" text-gray-500">{data?.remarks}</h4>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-yellow-darker text-base">Items:</h2>

          <div className="grid grid-cols-2 gap-5">
            {data?.items?.map((item: SolicitationItems) => (
              <Card key={item?.id} className="border-yellow-darker space-y-3">
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-semibold">Item:</h4>
                  <h4>{item?.item?.name}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-semibold">Quantity:</h4>
                  <h4>{item?.quantity}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-semibold">Lot:</h4>
                  <h4>{item?.lot}</h4>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-yellow-darker text-base">
            Committee Members:
          </h2>

          <div className="grid grid-cols-2 gap-5">
            {data?.committee_members?.map((member: CommitteeMemberData) => (
              <Card key={member?.id} className="border-yellow-darker space-y-3">
                <div className="flex items-center gap-5">
                  <h4 className="w-1/3 font-semibold">First Name:</h4>
                  <h4>{member?.first_name}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/3 font-semibold">Last Name:</h4>
                  <h4>{member?.last_name}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/3 font-semibold">Designation:</h4>
                  <h4>{member?.designation}</h4>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-yellow-darker text-base">
            Assignee:
          </h2>

          <Card className="border-yellow-darker space-y-3 w-full md:w-1/2">
            <div className="flex items-center gap-5">
              <h4 className="w-1/3 font-semibold">First Name:</h4>
              <h4>{data?.assignee?.first_name}</h4>
            </div>
            <div className="flex items-center gap-5">
              <h4 className="w-1/3 font-semibold">Last Name:</h4>
              <h4>{data?.assignee?.last_name}</h4>
            </div>
            <div className="flex items-center gap-5">
              <h4 className="w-1/3 font-semibold">Designation:</h4>
              <h4>{data?.assignee?.designation}</h4>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default CompetitiveBidAnalysisDetail;
