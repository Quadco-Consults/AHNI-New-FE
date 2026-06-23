"use client";

import { Label } from "@/components/ui/label";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { Checkbox } from "@/components/ui/checkbox";
import FormButton from "@/components/FormButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/index";
import useUrlQuery from "@/hooks/useQuery";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";
import { z } from "zod";
import { VendorAttestationSchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
import { toast } from "sonner";

const Attestation = () => {
  const [showSubmit, setShowSubmit] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const query = useUrlQuery();
  const vendorId = query.get("id");
  const eoiId = query.get("eoi_id"); // Capture EOI ID to redirect back after completion
  // const dispatch = useDispatch();

  const currentVendor = useSelector((state: RootState) => state.vendors.currentVendor);
  const { updateVendor: updateVendorMutation } = VendorsAPI.useUpdateVendor(vendorId || "");

  // Get current date formatted for display
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const form = useForm<z.infer<typeof VendorAttestationSchema>>({
    resolver: zodResolver(VendorAttestationSchema),
    defaultValues: {
      name: "",
      organisation_name: currentVendor?.company_name || "",
      title: "",
      date: getCurrentDate(),
    },
  });

  useEffect(() => {
    // Auto-populate company name from current vendor data
    if (currentVendor?.company_name) {
      form.setValue("organisation_name", currentVendor.company_name);
    }
  }, [currentVendor, form]);

  const { handleSubmit } = form;

  // const [createVendorMutation, { isLoading: createVendorMutationLoading }] =
  //   VendorsAPI.useCreateVendorMutation();

  // const vendorsData = useSelector((state: RootState) => state.vendors.vendors);
  // const mergedObject = vendorsData.reduce((acc: any, obj: any) => {
  //   return { ...acc, ...obj };
  // }, {});

  const onSubmit = async (data: z.infer<typeof VendorAttestationSchema>) => {
    try {
      const attestationData = {
        attestation_statement: "I hereby attest that, to the best of my knowledge and belief, all information provided in this form are true and correct.",
        full_name: data.name,
        company_name: data.organisation_name || currentVendor?.company_name,
        position_title: data.title,
        date: data.date,
      };
      console.log("Attestation data:", attestationData);

      // If we have a vendor ID, update the vendor via API
      if (vendorId) {
        console.log("Updating vendor with attestation data:", {
          ...currentVendor,
          ...attestationData
        });

        const updatedVendorData = {
          ...currentVendor,
          ...attestationData
        };

        await updateVendorMutation(updatedVendorData);
        console.log("Vendor updated successfully with attestation data");
      }

      setShowSubmit(true);
    } catch (error) {
      console.error("Error updating vendor with attestation data:", error);
      setShowSubmit(true); // Allow user to proceed even if update fails
    }
  };

  const submitHandler = async () => {
    // Final step - complete vendor registration and navigate appropriately
    setShowSubmit(true);

    // Show success message
    toast.success("Vendor registration completed successfully! Your application is now pending approval.");

    // Navigate back to the EOI vendor submission tab if registering from an EOI,
    // otherwise go to the general vendor management/prequalification page
    setTimeout(() => {
      if (eoiId) {
        router.push(`/dashboard/procurement/vendor-management/eoi/${eoiId}`);
      } else {
        router.push("/dashboard/procurement/vendor-management");
      }
    }, 1500);
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
                <div className='border text-sm text-[#B3B7C1] px-2 py-6 rounded-xl bg-alternate-light'>
                  I hereby attest that, to the best of my knowledge and belief,
                  all information provided in this form are true and correct. I
                  understand that AHNI may request additional information either
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
                        label='Company/Organization Name (Auto-populated from Registration)'
                        name={`organisation_name`}
                        disabled
                        className="bg-gray-100"
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
                    <div className='relative w-full grid grid-cols-1 mt-4 gap-4 '>
                      <FormInput
                        label='Date (Auto-populated from Registration)'
                        name={`date`}
                        disabled
                        className="bg-gray-100"
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
                  className='bg-brand-light text-primary dark:text-gray-500'
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
