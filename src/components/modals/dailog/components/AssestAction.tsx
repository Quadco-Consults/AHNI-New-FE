import RoundBack from "assets/svgs/RoundBack";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { Form } from "components/ui/form";
import { useAppDispatch } from "hooks/useStore";

import { useForm } from "react-hook-form";
import { closeDialog } from "store/ui";

const AssestAction = () => {
  const form = useForm();

  const dispatch = useAppDispatch();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-x-2">
        <div
          onClick={() => {
            dispatch(closeDialog());
          }}
        >
          <RoundBack />
        </div>

        <h4 className="font-bold">Asset Action</h4>
      </div>
      <div>
        <Form {...form}>
          <form className="flex flex-col gap-y-6">
            <FormInput
              label="Remark"
              required
              name="remark"
              placeholder="Asset is OBSOLETE in BAD condition"
            />
            <div className="w-7/12 ">
              <FormInput
                label="Justification for Disposal"
                required
                name="justification"
              />
            </div>
            <div className="w-7/12 ">
              <FormInput label="Life Span at Report" required name="lifspan" />
            </div>
            <div className="w-5/12 ">
              <FormSelect label="Recomendation" required name="recomendatiom" />
            </div>
            <div className="w-5/12 ">
              <FormSelect
                label="Asset Condition"
                required
                name="assetcondition"
              />
            </div>
            <div className="w-3/12">
              <FormButton>Raise Request</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AssestAction;
