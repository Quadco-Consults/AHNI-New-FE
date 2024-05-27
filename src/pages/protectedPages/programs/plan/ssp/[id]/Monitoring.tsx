import FormInput from "atoms/FormInput";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Form } from "components/ui/form";
import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Monitoring = () => {
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
      <div className="flex justify-end">
        <div className="py-2 px-4 rounded-lg border text-green-500 border-green-500 bg-green-50">
          Page 3/7
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
                Monitoring and Evaluation
              </h4>
              <h6 className="font-light">Verify the following</h6>

              <Card className="space-y-3 border-yellow-600">
                <h4 className="text-semibold text-yellow-600">
                  Data management system
                </h4>

                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>
                      Forms, registers, and reports are filed and stored in
                      secured places. Assess data <br /> storage system
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
                      Efficient system for storage and retrieval of records
                      (Client folder retrieved within 3 <br /> minutes) Assess
                      time to retrieve folders. Are there dedicated medical
                      records staff?
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
                      Availability of duplicate MSFs onsite for reference.
                      Review MSF for completeness, <br /> second level
                      validation, signature.
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

              <Card className="space-y-3 border-yellow-600">
                <h4 className="text-semibold text-yellow-600">
                  Review registers and list register and period reviewed
                </h4>

                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>
                      Is the register filled completely? Check for headers?
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
                      Previous month’s RFI paid? If not, explore reasons and
                      bottlenecks? Refer to programs <br /> team.
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
        <Link to={RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_ASSESS}>
          <Button className="px-8">Next</Button>
        </Link>
      </div>
    </div>
  );
};

export default Monitoring;
