import { useLocation, useNavigate } from "react-router-dom";
import SupportiveSupervisionPlanLayout from "./SupportiveSupervisionPlanLayout";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { ChevronRight } from "lucide-react";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import Card from "components/shared/Card";
import { Label } from "components/ui/label";

const Composition = () => {
  const form = useForm();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { handleSubmit } = form;

  const onSubmit = () => {
    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/evolution-checklist";
    navigate(path);
  };

  return (
    <SupportiveSupervisionPlanLayout>
      <div className="px-3 ">
        <h2 className="text-lg font-bold">Facility & Team Composition</h2>
        <div className="mt-10">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                <FormSelect
                  name="facility"
                  label="Facility"
                  placeholder="Select facility"
                  required
                />

                <Card className="border-yellow-600 space-y-3">
                  <div className="flex items-center gap-5">
                    <h4 className="w-1/6 font-medium">State :</h4>
                    <h4>Lagos</h4>
                  </div>
                  <div className="flex items-center gap-5">
                    <h4 className="w-1/6 font-medium">LGA :</h4>
                    <h4>Surulere</h4>
                  </div>
                </Card>

                <div className="space-y-1">
                  <Label>Facility Contact Person</Label>

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

                <div className="space-y-1">
                  <Label>Month/Year</Label>
                  <div className="grid grid-cols-2 w-1/3 col-span-3 gap-x-6 ">
                    <FormInput name="month" placeholder="MM" />
                    <FormInput name="year" placeholder="YYYY" />
                  </div>
                </div>

                <hr />

                <h2 className="text-yellow-600">Team Members</h2>

                <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                  <FormInput name="name" label="Name" />
                  <FormInput name="position" label="Position" />
                  <FormInput name="number" label="Phone Number" />
                  <FormInput name="email" label="Email" />
                </div>
                <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                  <FormInput name="name" label="Name" />
                  <FormInput name="position" label="Position" />
                  <FormInput name="number" label="Phone Number" />
                  <FormInput name="email" label="Email" />
                </div>
                <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                  <FormInput name="name" label="Name" />
                  <FormInput name="position" label="Position" />
                  <FormInput name="number" label="Phone Number" />
                  <FormInput name="email" label="Email" />
                </div>

                <hr />

                <div className="space-y-1">
                  <Label>Date of Visit</Label>
                  <div className="grid grid-cols-3 w-1/3 col-span-3 gap-x-6 ">
                    <FormInput name="day" placeholder="DD" />
                    <FormInput name="month" placeholder="MM" />
                    <FormInput name="year" placeholder="YYYY" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-5 mt-16">
                <Button type="button" className="bg-[#FFF2F2] text-primary ">
                  Cancel
                </Button>
                <FormButton suffix={<ChevronRight size={14} />}>
                  Next
                </FormButton>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </SupportiveSupervisionPlanLayout>
  );
};

export default Composition;
