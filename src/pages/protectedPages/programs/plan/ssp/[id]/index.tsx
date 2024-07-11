import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";

const SspDetails = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

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
      <Button
        onClick={goBack}
        variant="outline"
        className="flex gap-4 items-center text-primary border-primary hover:bg-red-50 hover:text-red-500"
      >
        <ArrowLeft size={15} /> Back
      </Button>

      <Card className="space-y-5">
        <h2 className="text-lg font-bold">Facility & Team Composition</h2>
        <hr />
        <Card className="border-yellow-600 space-y-3">
          <div className="flex items-center gap-5">
            <h4 className="w-1/6 font-medium">Facility :</h4>
            <h4>ACEBAY</h4>
          </div>
          <div className="flex items-center gap-5">
            <h4 className="w-1/6 font-medium">State :</h4>
            <h4>Lagos</h4>
          </div>
          <div className="flex items-center gap-5">
            <h4 className="w-1/6 font-medium">LGA :</h4>
            <h4>Surulere</h4>
          </div>
          <div className="flex items-center gap-5">
            <h4 className="w-1/6 font-medium">Month/Year :</h4>
            <h4>02/2024</h4>
          </div>
        </Card>

        <div className="space-y-2">
          <Label className="font-semibold">Facility Contact Person</Label>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Card className="border-yellow-600 space-y-3">
              <div className="flex items-center gap-5">
                <h4 className="w-1/3 font-medium">Contact Person :</h4>
                <h4>Dr. Umar Adamu</h4>
              </div>
              <div className="flex items-center gap-5">
                <h4 className="w-1/3 font-medium">Position :</h4>
                <h4>Managing Director, AHNi</h4>
              </div>
              <div className="flex items-center gap-5">
                <h4 className="w-1/3 font-medium">tel :</h4>
                <h4>+2348024013326</h4>
              </div>
            </Card>
            <Card className="border-yellow-600 space-y-3">
              <div className="flex items-center gap-5">
                <h4 className="w-1/3 font-medium">Contact Person :</h4>
                <h4>Dr. Umar Adamu</h4>
              </div>
              <div className="flex items-center gap-5">
                <h4 className="w-1/3 font-medium">Position :</h4>
                <h4>Managing Director, AHNi</h4>
              </div>
              <div className="flex items-center gap-5">
                <h4 className="w-1/3 font-medium">tel :</h4>
                <h4>+2348024013326</h4>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold">Team Members</Label>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Card className="border-yellow-600 space-y-3">
              <div className="flex items-center gap-5">
                <h4 className="w-1/3 font-medium">Contact Person :</h4>
                <h4>Dr. Umar Adamu</h4>
              </div>
              <div className="flex items-center gap-5">
                <h4 className="w-1/3 font-medium">Position :</h4>
                <h4>Managing Director, AHNi</h4>
              </div>
              <div className="flex items-center gap-5">
                <h4 className="w-1/3 font-medium">tel :</h4>
                <h4>+2348024013326</h4>
              </div>
            </Card>
            <Card className="border-yellow-600 space-y-3">
              <div className="flex items-center gap-5">
                <h4 className="w-1/3 font-medium">Contact Person :</h4>
                <h4>Dr. Umar Adamu</h4>
              </div>
              <div className="flex items-center gap-5">
                <h4 className="w-1/3 font-medium">Position :</h4>
                <h4>Managing Director, AHNi</h4>
              </div>
              <div className="flex items-center gap-5">
                <h4 className="w-1/3 font-medium">tel :</h4>
                <h4>+2348024013326</h4>
              </div>
            </Card>
          </div>
        </div>
      </Card>
      <div className="flex justify-end">
        <Link to={RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_MANAGEMENT}>
          <Button>Start Evaluation</Button>
        </Link>
      </div>
    </div>
  );
};

export default SspDetails;
