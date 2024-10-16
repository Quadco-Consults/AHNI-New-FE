import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft } from "lucide-react";
import { Link, generatePath, useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import SupportiveSupervisionAPI from "services/programsApi/suportive-supervision";
import {
  FacilityContacts,
  TeamMembers,
} from "definations/program-types/supportive-supervision";
import { Loading } from "components/shared/Loading";

const SspDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const { data, isLoading } =
    SupportiveSupervisionAPI.useGetSupportiveSupervisionQuery({
      path: { id: id as string },
    });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Programs</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Plans</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION}>
              Supportive Supervision Plan
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between">
        <Button
          onClick={goBack}
          variant="outline"
          className="flex gap-4 items-center text-primary border-primary hover:bg-red-50 hover:text-red-500"
        >
          <ArrowLeft size={15} /> Back
        </Button>
        <Link
          to={generatePath(
            RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_MANAGEMENT,
            {
              id: data?.id,
            }
          )}
        >
          <Button>Start Evaluation</Button>
        </Link>
      </div>

      <Card className="space-y-5">
        <h2 className="text-lg font-bold">Facility & Team Composition</h2>
        <hr />
        <Card className="border-yellow-600 space-y-3">
          <div className="flex items-center gap-5">
            <h4 className="w-1/6 font-medium">Facility :</h4>
            <h4>{data?.facility.name}</h4>
          </div>
          <div className="flex items-center gap-5">
            <h4 className="w-1/6 font-medium">State :</h4>
            <h4>{data?.facility.state}</h4>
          </div>
          <div className="flex items-center gap-5">
            <h4 className="w-1/6 font-medium">LGA :</h4>
            <h4>{data?.facility.local_govt}</h4>
          </div>
          <div className="flex items-center gap-5">
            <h4 className="w-1/6 font-medium">Month/Year :</h4>
            <h4>{data?.month_year}</h4>
          </div>
          <div className="flex items-center gap-5">
            <h4 className="w-1/6 font-medium">Date of visit :</h4>
            <h4>{data?.date_of_visit}</h4>
          </div>
        </Card>

        <div className="space-y-2">
          <Label className="font-semibold">Facility Contact Person</Label>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {data?.facility?.facility_contacts?.map(
              (contact: FacilityContacts) => (
                <Card key={contact?.id} className="border-yellow-600 space-y-3">
                  <div className="flex items-center gap-5">
                    <h4 className="w-1/3 font-medium">Contact Person :</h4>
                    <h4>{contact.name}</h4>
                  </div>
                  <div className="flex items-center gap-5">
                    <h4 className="w-1/3 font-medium">Position :</h4>
                    <h4>{contact.position}</h4>
                  </div>
                  <div className="flex items-center gap-5">
                    <h4 className="w-1/3 font-medium">tel :</h4>
                    <h4>{contact.phone_number}</h4>
                  </div>
                </Card>
              )
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold">Team Members</Label>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {data?.team_members?.map((member: TeamMembers) => (
              <Card key={member.id} className="border-yellow-600 space-y-3">
                <div className="flex items-center gap-5">
                  <h4 className="w-1/3 font-medium">Contact Person :</h4>
                  <h4>
                    {member.first_name} {member.last_name}
                  </h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/3 font-medium">Position :</h4>
                  <h4>{member.designation}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/3 font-medium">tel :</h4>
                  <h4>{member.phone_number}</h4>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SspDetails;
