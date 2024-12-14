import { Label } from "components/ui/label";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { Checkbox } from "components/ui/checkbox";
import FormButton from "atoms/FormButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { vendorsActions } from "store/formData/procurement-vendors";
import { RootState } from "store/index";
import VendorsAPI from "services/procurementApi/vendors";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import { z } from "zod";
import { VendorAttestationSchema } from "definations/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";

const Attestation = () => {
  const [showSubmit, setShowSubmit] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof VendorAttestationSchema>>({
    resolver: zodResolver(VendorAttestationSchema),
    defaultValues: {
      attest: [{ name: "", organisation_name: "", title: "" }],
      sign: [{ date: "", signature: "" }],
    },
  });

  const { control, handleSubmit } = form;

  const { fields: attest } = useFieldArray({
    control,
    name: "attest",
  });
  const { fields: sign } = useFieldArray({
    control,
    name: "sign",
  });

  const [createVendorMutation, { isLoading: createVendorMutationLoading }] =
    VendorsAPI.useCreateVendorMutation();

  const vendorsData = useSelector((state: RootState) => state.vendors.vendors);
  const mergedObject = vendorsData.reduce((acc: any, obj: any) => {
    return { ...acc, ...obj };
  }, {});

  const onSubmit = () => {
    // let path = pathname;
    // dispatch(vendorsActions.clearVendors());

    setShowSubmit(true);

    // path = path.substring(0, path.lastIndexOf("/"));

    // path += "/upload";
    // navigate(path);
  };

  const submitHandler = async () => {
    const finalData = {
      associated_entities: mergedObject?.associated_entities,
      bank_address: mergedObject?.bank_address,
      bank_name: mergedObject?.bank_name,
      branches: mergedObject?.branches,
      brief_of_quality_control: mergedObject?.brief_of_quality_control,
      brief_of_sampling: mergedObject?.brief_of_sampling,
      company_address: mergedObject?.company_address,
      company_chairman: mergedObject?.company_chairman,
      company_name: mergedObject?.company_name,
      company_registration_number: mergedObject?.company_registration_number,
      email: mergedObject?.email,
      installed_capacity: mergedObject?.installed_capacity,
      key_staff: mergedObject?.key_staff,
      lagest_capacity_and_utilization:
        mergedObject?.lagest_capacity_and_utilization,
      nature_of_business: mergedObject?.nature_of_business,
      number_of_operational_work_shift: Number(
        mergedObject?.number_of_operational_work_shift
      ),
      number_of_permanent_staff: Number(
        mergedObject?.number_of_permanent_staff
      ),
      phone_number: mergedObject?.phone_numbers,
      production_equipments: mergedObject?.production_equipments,
      key_clients: mergedObject?.key_clients,
      questionairs: mergedObject?.questionairs,
      share_holders: mergedObject?.share_holders,
      submitted_categories: mergedObject?.submitted_categories,
      tin: mergedObject?.tin,
      type_of_business: mergedObject?.type_of_business,
      website: mergedObject?.website,
      year_or_incorperation: mergedObject?.year_or_incorperation,
    };

    try {
      const res = await createVendorMutation(finalData).unwrap();
      localStorage.setItem("vendorID", res?.data?.id);
      toast.success("Successfully created.");
      // let path = pathname;
      // path = path.substring(0, path.lastIndexOf("/"));
      // path += "/attestation";
      // navigate(path);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  return (
    <VendorRegistationLayout>
      <div>
        <h2 className='text-lg font-bold'>Attestation</h2>
        <div className='mt-10'>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              <div className='space-y-3'>
                <Label>
                  Attestation Statement
                  <span className='text-red-500' title='required'>
                    *
                  </span>
                </Label>
                <div className='border text-sm text-[#B3B7C1] px-2 py-6 rounded-xl bg-[#F9F9F9]'>
                  I hereby attest that, to the best of my knowledge and belief,
                  all information provided in this form are true and correct. I
                  understand that AHNi may request additional information either
                  from me or those listed herein to substantiate all the
                  statement, attachment(s) and/or listings made in this form and
                  shall use such to determine the company’s eligibility. We
                  authorize AHNI to make any inquiries regarding the information
                  provided herein
                </div>
              </div>

              <div className=''>
                <div>
                  {attest.map((field, index) => {
                    return (
                      <div
                        className='flex items-center justify-between gap-x-3'
                        key={index}
                      >
                        <div className='relative w-full grid grid-cols-3 mt-4 gap-x-4'>
                          <FormInput
                            label='Full Name'
                            name={`attest[${index}].name`}
                            defaultValue={field.name}
                            required
                          />
                          <FormInput
                            label='Company/Organization Name'
                            name={`attest[${index}].organisation`}
                            defaultValue={field.organisation_name}
                            required
                          />
                          <FormInput
                            label='Position/Title'
                            name={`attest[${index}].title`}
                            defaultValue={field.title}
                            required
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div>
                  {sign.map((field, index) => {
                    return (
                      <div
                        className='flex items-center justify-between gap-x-3 '
                        key={index}
                      >
                        <div className='relative w-full grid grid-cols-2 mt-4 gap-4 '>
                          <FormInput
                            label='Signature'
                            name={`sign[${index}].signature`}
                            defaultValue={field.signature}
                            required
                          />
                          <FormInput
                            label='Date'
                            name={`sign[${index}].date`}
                            defaultValue={field.date}
                            required
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className='flex items-center mt-4 gap-x-2'>
                <Checkbox />
                <Label> I Agree</Label>
              </div>
              <div className='flex justify-between pt-24'>
                <FormButton
                  onClick={() => navigate(-1)}
                  preffix={<ArrowLeft size={14} />}
                  type='button'
                  className='bg-[#FFF2F2] text-primary dark:text-gray-500'
                >
                  Back
                </FormButton>
                <Button type='submit' disabled={showSubmit}>
                  Submit
                </Button>
                {showSubmit && (
                  <FormButton
                    type='button'
                    onClick={submitHandler}
                    loading={createVendorMutationLoading}
                    // onClick={() => onSubmit()}
                    suffix={<ArrowRight size={14} />}
                  >
                    Proceed
                  </FormButton>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </VendorRegistationLayout>
  );
};

export default Attestation;
