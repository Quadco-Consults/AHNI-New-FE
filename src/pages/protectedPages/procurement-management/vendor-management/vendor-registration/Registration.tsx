import { Form } from "components/ui/form";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { Button } from "components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Registration = () => {
  const form = useForm();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { handleSubmit } = form;

  const onSubmit = () => {
    let path = pathname;

    // Remove the last segment of the path
    path = path.substring(0, path.lastIndexOf("/"));

    // Append the new segment to the path
    path += "/the-company";
    navigate(path);
  };
  return (
    <VendorRegistationLayout>
      <div className="px-3 py-6">
        <h2 className="text-lg font-bold">Vendor Registration</h2>
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
                <FormInput name="companyemail" label="Company Email" required />
                <FormInput
                  name="companyAddrress"
                  label="Company Website Address"
                  required
                />
                <FormInput
                  name="companyAddrress"
                  label="Create Password"
                  required
                  type="password"
                />
              </div>
              <div className="flex justify-between mt-16">
                <Button className="bg-[#FFF2F2] text-primary ">Cancel</Button>
                <Button className="bg-primary">
                  Proceed <ChevronRight size={14} />{" "}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </VendorRegistationLayout>
  );
};

export default Registration;
