"use client";

import { Label } from "components/ui/label";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { Checkbox } from "components/ui/checkbox";
import FormButton from "@/components/FormButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormInput from "components/atoms/FormInput";
import { z } from "zod";
import { VendorAttestationSchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";

const Attestation = () => {
  const [showSubmit, setShowSubmit] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  // const dispatch = useDispatch();

  const form = useForm<z.infer<typeof VendorAttestationSchema>>({
    resolver: zodResolver(VendorAttestationSchema),
    defaultValues: {
      name: "",
      organisation_name: "",
      title: "",
      date: "",
      signature: "",
    },
  });

  const { handleSubmit } = form;

  // const [createVendorMutation, { isLoading: createVendorMutationLoading }] =
  //   VendorsAPI.useCreateVendorMutation();

  // const vendorsData = useSelector((state: RootState) => state.vendors.vendors);
  // const mergedObject = vendorsData.reduce((acc: any, obj: any) => {
  //   return { ...acc, ...obj };
  // }, {});

  const onSubmit = (data: z.infer<typeof VendorAttestationSchema>) => {
    const values = {
      attestation_statement: "string",
      full_name: "string",
      company_name: "string",
      position_title: "string",
      signature: "string",
      date: "2019-08-24T14:15:22Z",
    };
    console.log(values, data);

    setShowSubmit(true);
  };

  const submitHandler = async () => {
    // const finalData = {};

    let path = pathname;

    setShowSubmit(true);
    path = path.substring(0, path.lastIndexOf("/"));
    path += "/upload";
    router.push(path);
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
                  <div className='flex items-center justify-between gap-x-3'>
                    <div className='relative w-full grid grid-cols-3 mt-4 gap-x-4'>
                      <FormInput
                        label='Full Name'
                        name={`name`}
                        // defaultValue={field.name}
                        required
                      />
                      <FormInput
                        label='Company/Organization Name'
                        name={`organisation_name`}
                        // defaultValue={field.organisation_name}
                        required
                      />
                      <FormInput
                        label='Position/Title'
                        name={`title`}
                        // defaultValue={field.title}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className='flex items-center justify-between gap-x-3 '>
                    <div className='relative w-full grid grid-cols-2 mt-4 gap-4 '>
                      <FormInput
                        label='Signature'
                        name={`signature`}
                        // defaultValue={field.signature}
                        required
                      />
                      <FormInput
                        label='Date'
                        name={`date`}
                        // defaultValue={field.date}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex items-center mt-4 gap-x-2'>
                <Checkbox />
                <Label> I Agree</Label>
              </div>
              <div className='flex justify-between pt-24'>
                <FormButton
                  onClick={() => router.back()}
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
