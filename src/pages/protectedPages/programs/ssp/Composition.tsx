import { useLocation, useNavigate } from "react-router-dom";
import SupportiveSupervisionPlanLayout from "./SupportiveSupervisionPlanLayout";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { ChevronRight } from "lucide-react";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";

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
              <div className="grid grid-cols-3 gap-6">
                <FormInput name="companyName" label="Company Name" required />
                <FormSelect name="test" label="Type of Business" required />
                <FormSelect
                  name="incoperationYear"
                  label="Year of incorporation"
                  required
                />
                <div className="grid grid-cols-2 col-span-3 gap-x-6 ">
                  <FormInput
                    name="companyregnumber"
                    label="Company Registration Number"
                    required
                  />
                  <FormInput
                    name="companywebsite"
                    label="Company Website Address"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 col-span-3 gap-x-6 ">
                  <FormInput
                    name="companyremail"
                    label="Company Email"
                    required
                  />
                  <FormInput
                    name="password"
                    label="Create Password"
                    required
                    type="password"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-16">
                <Button type="button" className="bg-[#FFF2F2] text-primary ">
                  Cancel
                </Button>
                {/* <Button className="bg-primary">
                  Proceed <ChevronRight size={14} />{" "}
                </Button> */}
                <FormButton suffix={<ChevronRight size={14} />}>
                  Proceed
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
