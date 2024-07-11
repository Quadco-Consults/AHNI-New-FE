import { Form } from "components/ui/form";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Label } from "components/ui/label";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType, largeDailogScreen } from "constants/dailogs";

const Registration = () => {
  const form = useForm();

  const dispatch = useAppDispatch();

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
      <div className="px-3 ">
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
              <div className="flex flex-col w-[299px] mt-10 space-y-3">
                <Label>Category</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="text-[#DEA004]"
                  onClick={() => {
                    dispatch(
                      openDialog({
                        type: DialogType.Categories,
                        dialogProps: {
                          ...largeDailogScreen,
                        },
                      })
                    );
                  }}
                >
                  Click to select categories that applies
                </Button>
              </div>
              <div className="flex justify-between mt-16">
                <Button
                  type="button"
                  className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                >
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
    </VendorRegistationLayout>
  );
};

export default Registration;
