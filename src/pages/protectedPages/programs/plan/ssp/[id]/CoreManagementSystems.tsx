import FormInput from "atoms/FormInput";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Form } from "components/ui/form";
import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
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

const CoreManagementSystems = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const form = useForm({
    defaultValues: {
      title: [
        {
          descriptionOfItems: "",
          numberOfPersons: "",
          numberOfDays: "",
          fco: "",
          unitCost: "",
          total: "",
        },
      ],
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: any) => {
    console.table(">>>>>>>>>>>>>>>>", data);
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
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Core Management Systems</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-end">
        <div className="py-2 px-4 rounded-lg border text-green-500 border-green-500 bg-green-50">
          Page 1/7
        </div>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <h4 className="font-semibold">
              Integrated Facility Visit Checklist for Comprehensive Sites
            </h4>
            <hr />
            <Card className="space-y-3">
              <h4 className="font-semibold text-red-600">
                Management System (Assess every 6 months; first visit at the
                beginning of the FY and first visit after SAPR)
              </h4>
              <h6 className="font-light">Verify the following</h6>

              <Card className="space-y-3 border-yellow-600">
                <h4 className="text-semibold text-yellow-600">
                  Core Management Systems
                </h4>

                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>
                      Facility staff, including Adhoc understand the ACEBAY
                      project. (Assess understanding <br /> of PEPFAR and USIAD
                      role in funding)
                    </h2>
                  </div>
                  <div className="flex gap-5 justify-between w-1/5">
                    <div className="flex gap-2 items-center text-green-500">
                      <Checkbox className="border-green-500 data-[state=checked]:bg-inherit data-[state=checked]:text-green-500" />
                      <h6>Yes</h6>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Checkbox />
                      <h6>No</h6>
                    </div>
                  </div>
                </div>

                <FormInput name="comment" label="Comment" />

                <hr className="" />

                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>
                      EOIAHNi03 Staff can describe their roles and
                      responsibilities (Also assess their weekly activity <br />{" "}
                      plan)
                    </h2>
                  </div>
                  <div className="flex gap-5 justify-between w-1/5">
                    <div className="flex gap-2 items-center text-green-500">
                      <Checkbox className="border-green-500 data-[state=checked]:bg-inherit data-[state=checked]:text-green-500" />
                      <h6>Yes</h6>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Checkbox />
                      <h6>No</h6>
                    </div>
                  </div>
                </div>

                <FormInput name="comment" label="Comment" />
              </Card>
            </Card>
          </form>
        </Form>
      </Card>

      <div className="flex justify-between">
        <Button
          onClick={goBack}
          variant="outline"
          className="flex gap-4 items-center text-primary border-primary hover:bg-red-50 hover:text-red-500"
        >
          <ArrowLeft size={15} /> Back
        </Button>
        <Link to={RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_GUIDELINE}>
          <Button className="px-8">Next</Button>
        </Link>
      </div>
    </div>
  );
};

export default CoreManagementSystems;
