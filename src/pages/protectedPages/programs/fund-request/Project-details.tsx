import { useLocation, useNavigate } from "react-router-dom";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { ChevronRight } from "lucide-react";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import Card from "components/shared/Card";
import { Label } from "components/ui/label";
import FundRequstLayout from "./FundRequstLayout";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";

const ProjectDetails = () => {
  const dispatch = useAppDispatch();

  const form = useForm();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { handleSubmit } = form;

  const onSubmit = () => {
    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/fund-request-summary";
    navigate(path);
  };

  return (
    <FundRequstLayout>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="space-y-10 py-5">
            <FormSelect
              name="Project"
              label="Project Name"
              placeholder="Select Project"
              required
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="-mt-2">
                <Label>Financial Month</Label>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <FormInput name="month" placeholder="MM" />
                  <FormInput name="year" placeholder="YYY" />
                </div>
              </div>

              <FormSelect
                name="state"
                label="State"
                placeholder="Select State"
                required
              />
            </div>

            <hr />

            <div className="flex flex-col w-[299px] mt-10 space-y-3">
              <Label className="font-medium">State Offices Involved</Label>
              <Button
                type="button"
                variant="outline"
                className="text-[#DEA004]"
                onClick={() => {
                  dispatch(
                    openDialog({
                      type: DialogType.StateModal,
                      dialogProps: {
                        width: "max-w-5xl",
                      },
                    })
                  );
                }}
              >
                Click to select checklist criteria
              </Button>
            </div>
          </Card>

          <div className="flex justify-end gap-5 mt-16">
            <Button
              type="button"
              className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            >
              Cancel
            </Button>
            <FormButton suffix={<ChevronRight size={14} />}>Next</FormButton>
          </div>
        </form>
      </Form>
    </FundRequstLayout>
  );
};

export default ProjectDetails;
