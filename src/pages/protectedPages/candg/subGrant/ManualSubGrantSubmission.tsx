import { SubmitHandler, useForm } from "react-hook-form";
import ManualSubGrantStepWrapper from "./ManualSubGrantStepWrapper";
import { z } from "zod";
import { Form } from "components/ui/form";
import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import FormSelect from "atoms/FormSelect";
import FadedButton from "atoms/FadedButton";
import FormButton from "atoms/FormButton";
import { ManualSubGrantSchemaOrgDetails } from "definations/candg-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubGrantApplicationsApi } from "services/cAndGApi/subGrant";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const ManualSubGrantSubmission = () => {
  const params = useParams();
  const form = useForm<z.infer<typeof ManualSubGrantSchemaOrgDetails>>({
    resolver: zodResolver(ManualSubGrantSchemaOrgDetails),
  });
  const [manualSubmissionMutation, manualSubmissionMutationResults] = SubGrantApplicationsApi.useAddSubGrantApplicationMutation();
  const onSubmit: SubmitHandler<z.infer<typeof ManualSubGrantSchemaOrgDetails>> = async (data) => {
    console.log({ ...data, sub_grant_id: params.id });
    // try {
    //   const result = await manualSubmissionMutation({ ...data, sub_grant_id: params.id }).unwrap();
    //   toast.success(result?.message);
    //   console.log(result);
    // } catch (error: any) {
    //   toast.error(error?.data?.message);
    // }
  };
  return (
    <ManualSubGrantStepWrapper>
      <div className="w-full flex flex-col text-[#1A0000] px-5 gap-y-[3rem]">
        <p className="text-xl font-bold">Manual Submission Form</p>
        <Form {...form}>
          <form action="" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap w-full justify-between items-center gap-y-[1.25rem]">
            <div className="w-full">
              <FormInput label="Legal Name of the Organization" name="organisation_name" type="text" placeholder="N-THRIP" required />
            </div>
            <div className="w-full flex flex-wrap justify-between gap-y-[1.25rem]">
              <p className="font-semibold w-full">1st Principal’s Name & Title</p>
              <div className="w-[49%]">
                <FormInput label="Name" name="principal_one_name" placeholder="" required />
              </div>
              <div className="w-[49%]">
                <FormInput label="Designation" name="principal_one_designation" placeholder="" required />
              </div>
            </div>
            <div className="w-full flex flex-wrap justify-between gap-y-[1.25rem]">
              <p className="font-semibold w-full">2nd Principal’s Name & Title</p>
              <div className="w-[49%]">
                <FormInput label="Name" name="principal_two_name" placeholder="" required />
              </div>
              <div className="w-[49%]">
                <FormInput label="Designation" name="principal_two_designation" placeholder="" required />
              </div>
            </div>
            <div className="w-full">
              <FormTextArea name="address" label="Address" className="w-full" required />
            </div>
            <div className="w-full flex flex-wrap justify-between">
              <div className="w-[32.5%]">
                <FormInput className="w-full" label="Telephone" name="telephone" type="text" required />
              </div>
              <div className="w-[32.5%]">
                <FormInput className="w-full" label="Fax" name="fax" type="text" required />
              </div>
              <div className="w-[32.5%]">
                <FormInput className="w-full" label="Email Address" name="email" type="text" required />
              </div>
            </div>
            <div className="flex flex-wrap w-full justify-between">
              <div className="w-[49%]">
                <FormInput label="Web Address" name="website" type="text" required />
              </div>
              <div className="w-[49%]">
                <FormInput label="DUNS Number (for USG awards only)" name="duns_number" type="text" required />
              </div>
            </div>
            <div className="w-full flex flex-col">
              <label htmlFor="">Has Financial Conflict of Interest Policy as applicable to U.S. PHS agencies’ funding.</label>
              <select name="conflicts" required>
                <option value="">Select</option>
                {[
                  { label: "Yes", value: "true" },
                  { label: "No", value: "false" },
                ].map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.label}
                    </option>
                  );
                })}
                .
              </select>
              {/* <FormSelect
                label="Has Financial Conflict of Interest Policy as applicable to U.S. PHS agencies’ funding."
                name="has_conflict_of_interest"
                options={[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ]}
                placeholder="Yes"
                required
              /> */}
            </div>
            <div className="w-full">
              <FormSelect
                label="Organization Type "
                name="organisation_type"
                options={[
                  { label: "NGO", value: "NGO" },
                  { label: "Profit", value: "Profit Organization" },
                ]}
                placeholder="Not for Profit or Nongovernmental"
                required
              />
            </div>
            <div className="flex w-full justify-end items-center gap-x-[1rem]">
              <div>
                <FadedButton type="button">
                  <p className="text-primary">Cancel</p>
                </FadedButton>
              </div>
              <div>
                <FormButton loading={manualSubmissionMutationResults.isLoading}>
                  <p>Submit</p>
                </FormButton>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </ManualSubGrantStepWrapper>
  );
};

export default ManualSubGrantSubmission;
