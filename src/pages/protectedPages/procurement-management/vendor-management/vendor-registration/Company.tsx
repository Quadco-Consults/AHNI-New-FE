import { Form } from "components/ui/form";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import { Separator } from "components/ui/separator";
import { Label } from "components/ui/label";
import { ArrowLeft, ArrowRight, MinusCircle, PlusCircle } from "lucide-react";
import FormButton from "atoms/FormButton";
import { useLocation, useNavigate } from "react-router-dom";

const Company = () => {
  const form = useForm({
    defaultValues: {
      officeaddress: [{ branch: "", contact: "", tel: "" }],
      stakeholder: [{ name: "", address: "", tel: "" }],
      keystaff: [{ name: "", qualification: "", tel: "" }],
      subsidiary: [{ name: "", address: "", tel: "" }],
    },
  });

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "officeaddress",
  });

  const {
    fields: keystaff,
    append: appendKeystaff,
    remove: removeKeystaff,
  } = useFieldArray({
    control,
    name: "keystaff",
  });
  const {
    fields: stakeholders,
    append: appendStakeholder,
    remove: removeStakeholder,
  } = useFieldArray({
    control,
    name: "stakeholder",
  });

  const {
    fields: subsidiaries,
    append: appendSubsidiary,
    remove: removeSubsidiary,
  } = useFieldArray({
    control,
    name: "stakeholder",
  });

  const onSubmit = () => {
    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/technical-capacity";
    navigate(path);
  };

  return (
    <VendorRegistationLayout>
      <div className="space-y-4">
        <h2 className="text-lg font-bold">The Company</h2>
        <div>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormInput label="Nature of Business" name="natureOfBusiness" />
              <FormTextArea label="Company Address" name="company addree" />
              <div className="grid grid-cols-2 gap-x-6">
                <FormInput
                  label="Company Chairman/Managing Director"
                  name="managinDirector"
                />
                <FormInput label="Contact Telephone" name="contactTel" />
              </div>
              <div className="grid grid-cols-3 gap-x-6 ">
                <FormInput label="Company's Bankers" name="cb" />
                <FormInput label="Company's Bankers Address" name="baadd" />
                <FormInput label="Number of permanent staff" name="permst" />
              </div>
              <FormInput
                label="Company's Tax Identification Number (TIN) (also include Certificate)"
                name="t"
              />
              <Separator className="mt-8" />
              <div>
                <Label className="text-red-500">Branch Office(s) Address</Label>
                <div>
                  {fields.map((field, index) => {
                    const label = String.fromCharCode(
                      "a".charCodeAt(0) + index
                    );
                    return (
                      <div
                        className="flex items-center justify-between gap-x-3 "
                        key={index}
                      >
                        <div className="relative w-[97%] grid grid-cols-3 pl-8 mt-4 gap-x-4 ">
                          <p className="absolute top-0 left-0 font-semibold ">
                            ({label})
                          </p>
                          <FormInput
                            label="Branch"
                            name={`officeaddress[${index}].branch`}
                            defaultValue={field.branch}
                            required
                          />
                          <FormInput
                            label="Contact"
                            name={`officeaddress[${index}].contact`}
                            defaultValue={field.contact}
                            required
                          />
                          <FormInput
                            label="Tel"
                            name={`officeaddress[${index}].tel`}
                            defaultValue={field.tel}
                            required
                          />
                        </div>
                        <div className="flex items-center h-full ">
                          <MinusCircle
                            onClick={() => remove(index)}
                            className="cursor-pointer text-primary"
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-end mt-2">
                    <PlusCircle
                      onClick={() =>
                        append({ branch: "", contact: "", tel: "" })
                      }
                      className="cursor-pointer text-primary"
                    />
                  </div>
                </div>
              </div>
              <Separator className="mt-8" />
              <div>
                <Label className="text-red-500">
                  Majority Shareholders & Directors{" "}
                </Label>
                <div>
                  {stakeholders.map((field, index) => {
                    const label = String.fromCharCode(
                      "a".charCodeAt(0) + index
                    );
                    return (
                      <div
                        className="flex items-center justify-between gap-x-3 "
                        key={index}
                      >
                        <div className="relative w-[97%] grid grid-cols-3 pl-8 mt-4 gap-x-4 ">
                          <p className="absolute top-0 left-0 font-semibold ">
                            ({label})
                          </p>
                          <FormInput
                            label="Name"
                            name={`stakeholder[${index}].name`}
                            defaultValue={field.name}
                            required
                          />
                          <FormInput
                            label="Address"
                            name={`stakeholder[${index}].address`}
                            defaultValue={field.address}
                            required
                          />
                          <FormInput
                            label="Tel"
                            name={`stakeholder[${index}].tel`}
                            defaultValue={field.tel}
                            required
                          />
                        </div>
                        <div className="flex items-center h-full ">
                          <MinusCircle
                            onClick={() => removeStakeholder(index)}
                            className="cursor-pointer text-primary"
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-end mt-2">
                    <PlusCircle
                      onClick={() =>
                        appendStakeholder({ name: "", address: "", tel: "" })
                      }
                      className="cursor-pointer text-primary"
                    />
                  </div>
                </div>
              </div>
              <Separator className="mt-8" />
              <div>
                <Label className="text-red-500">
                  Names & Qualifications of Key Staff
                </Label>
                <div>
                  {keystaff.map((field, index) => {
                    const label = String.fromCharCode(
                      "a".charCodeAt(0) + index
                    );
                    return (
                      <div
                        className="flex items-center justify-between gap-x-3 "
                        key={index}
                      >
                        <div className="relative w-[97%] grid grid-cols-3 pl-8 mt-4 gap-x-4 ">
                          <p className="absolute top-0 left-0 font-semibold ">
                            ({label})
                          </p>
                          <FormInput
                            label="Name"
                            name={`stakeholder[${index}].name`}
                            defaultValue={field.name}
                            required
                          />
                          <FormInput
                            label="Qualification"
                            name={`stakeholder[${index}].qualification`}
                            defaultValue={field.qualification}
                            required
                          />
                          <FormInput
                            label="Tel"
                            name={`stakeholder[${index}].tel`}
                            defaultValue={field.tel}
                            required
                          />
                        </div>
                        <div className="flex items-center h-full ">
                          <MinusCircle
                            onClick={() => removeKeystaff(index)}
                            className="cursor-pointer text-primary"
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-end mt-2">
                    <PlusCircle
                      onClick={() =>
                        appendKeystaff({ name: "", qualification: "", tel: "" })
                      }
                      className="cursor-pointer text-primary"
                    />
                  </div>
                </div>
              </div>
              <Separator className="mt-8" />
              <div>
                <Label className="text-red-500">
                  Subsidiaries, Associates, Affiliates or technical Partners
                </Label>
                <div>
                  {subsidiaries.map((field, index) => {
                    const label = String.fromCharCode(
                      "a".charCodeAt(0) + index
                    );
                    return (
                      <div
                        className="flex items-center justify-between gap-x-3 "
                        key={index}
                      >
                        <div className="relative w-[97%] grid grid-cols-3 pl-8 mt-4 gap-x-4 ">
                          <p className="absolute top-0 left-0 font-semibold ">
                            ({label})
                          </p>
                          <FormInput
                            label="Name"
                            name={`stakeholder[${index}].name`}
                            defaultValue={field.name}
                            required
                          />
                          <FormInput
                            label="Address"
                            name={`stakeholder[${index}].address`}
                            defaultValue={field.address}
                            required
                          />
                          <FormInput
                            label="Tel"
                            name={`stakeholder[${index}].tel`}
                            defaultValue={field.tel}
                            required
                          />
                        </div>
                        <div className="flex items-center h-full ">
                          <MinusCircle
                            onClick={() => removeSubsidiary(index)}
                            className="cursor-pointer text-primary"
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-end mt-2">
                    <PlusCircle
                      onClick={() =>
                        appendSubsidiary({ name: "", address: "", tel: "" })
                      }
                      className="cursor-pointer text-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-24">
                <FormButton
                  onClick={() => navigate(-1)}
                  preffix={<ArrowLeft size={14} />}
                  type="button"
                  className="bg-[#FFF2F2] text-primary "
                >
                  Back
                </FormButton>

                <FormButton suffix={<ArrowRight size={14} />}>
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

export default Company;
