import FormInput from "atoms/FormInput";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Form } from "components/ui/form";
import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const ServiceDelivery = () => {
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
          Page 6/7
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
                Standards of service delivery
              </h4>
              <h6 className="font-light">Verify the following</h6>

              <Card className="space-y-3 border-yellow-600">
                <h4 className="text-semibold text-yellow-600">
                  Review standard of care. <br /> Review 2.5% TX_CURR weekly;
                  10% monthly; 25% quarterly; 50% by SAPR; 100% by APR
                </h4>
                <h6 className="font-light">
                  Review all service forms for last visit
                </h6>

                <div className="flex justify-between py-3 gap-5">
                  <div className="">
                    <h2>Pharmacy Order form</h2>
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>Care and Support checklist</h2>
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>Last VL</h2>
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>ICT/Genealogy forms</h2>
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>Cervical cancer form (if applicable)</h2>
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
                  Correctness and consistency of bio-data on care card
                </h4>

                <div className="flex justify-between py-3 gap-5">
                  <div className="">
                    <h2>Age</h2>
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>Gender</h2>
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>Contact details</h2>
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>ART start date</h2>
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>
                      Documentation of clinic visits inside care card (VL,
                      adherence, TPT etc)
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
                <h4 className="text-semibold text-yellow-600">PMTCT clients</h4>

                <div className="flex justify-between py-3 gap-5">
                  <div className="">
                    <h2>Review maternal cohort register</h2>
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>
                      Update mother-baby pair information in relevant sections
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>
                      VL at 32-36 weeks. Done? Scheduled? Not Done? If not done,
                      explore challenges
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
                <h4 className="text-semibold text-yellow-600">TPT</h4>

                <div className="flex justify-between py-3 gap-5">
                  <div className="">
                    <h2>TPT initiated?</h2>
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>Review POF</h2>
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>TPT completion?</h2>
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>Documented?</h2>
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
                  Clients who missed their appointment traced (Review 50 clients
                  who have missed appointment)
                </h4>

                <div className="flex justify-between py-3 gap-5">
                  <div className="">
                    <h2>Client tracking and termination form?</h2>
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>Is the client tracking register updated?</h2>
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>Look for client entries in register</h2>
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
                  HEI management
                </h4>
                <h6>Review for HEIs up to 12 months before visit</h6>

                <div className="flex justify-between py-3 gap-5">
                  <div className="">
                    <h2>
                      All HIV exposed new-born have access to appropriate
                      prophylaxis. Check <br /> documentation in child Follow up
                      register
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
                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>
                      All HEIs delivered in the hospital have DBS done at birth
                      (up to 72hrs after birth). <br /> Review documentation in
                      Child Follow up Register. Explore reasons for gaps if any.
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

                <hr />

                <div className="flex justify-between pb-3 gap-5">
                  <div className="">
                    <h2>
                      Provision of DBS sample collection service at 6 weeks.
                      (Review Child Follow Register)
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
        <Link to={RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_SERVICE_DELIVERY}>
          <Button className="px-8">Next</Button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceDelivery;
