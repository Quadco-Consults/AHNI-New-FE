"use client";

import { Form } from "@/components/ui/form";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "@/components/atoms/FormInput";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, MinusCircle, PlusCircle } from "lucide-react";
import FormButton from "@/components/FormButton";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { VendorsReferenceSchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { vendorsActions } from "@/store/formData/procurement-vendors";
import { RootState } from "@/store/index";
import { useEffect } from "react";
import useQuery from "@/hooks/useQuery";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";

const Reference = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const query = useQuery();
  const vendorId = query.get("id");
  const eoiId = query.get("eoi_id"); // Preserve EOI ID through registration flow

  const { data: vendor, isLoading, error } = VendorsAPI.useGetVendor(vendorId);
  const { updateVendor: updateVendorMutation } = VendorsAPI.useUpdateVendor(vendorId || "");
  const currentVendor = useSelector((state: RootState) => state.vendors.currentVendor);

  const form = useForm<z.infer<typeof VendorsReferenceSchema>>({
    resolver: zodResolver(VendorsReferenceSchema),
    defaultValues: {
      key_clients: [{
        company_name: "",
        company_address: "",
        contact_person: "",
        contact_person_email: "",
        contact_person_phone: "",
        contact_person_position: ""
      }],
    },
  });

  const { control, handleSubmit } = form;

  useEffect(() => {
    // Priority: Redux currentVendor data > API vendor data > default values
    let keyClientsData = [{
      company_name: "",
      company_address: "",
      contact_person: "",
      contact_person_email: "",
      contact_person_phone: "",
      contact_person_position: ""
    }];

    if (currentVendor?.key_clients?.length > 0) {
      // Use Redux data if available (user has been entering data)
      keyClientsData = currentVendor.key_clients;
    } else if (vendorId && vendor?.data && !isLoading) {
      // Use API data if editing existing vendor
      keyClientsData = vendor.data.key_clients || keyClientsData;
      // Also set the vendor data in Redux for persistence
      dispatch(vendorsActions.setCurrentVendor(vendor.data));
    }

    form.reset({
      key_clients: keyClientsData,
    });
  }, [vendorId, vendor, isLoading, currentVendor, form, dispatch]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "key_clients",
  });

  const onSubmit = async (data: z.infer<typeof VendorsReferenceSchema>) => {
    console.log("Reference form submitted with data:", data);

    try {
      // Update current vendor data in Redux store for persistence
      dispatch(vendorsActions.updateCurrentVendor(data));

      // Also add to vendors array for backwards compatibility
      dispatch(vendorsActions.addVendors(data));

      // If we have a vendor ID, update the vendor via API
      if (vendorId) {
        console.log("Updating vendor with reference data:", {
          ...currentVendor,
          ...data
        });

        const updatedVendorData = {
          ...currentVendor,
          ...data
        };

        await updateVendorMutation(updatedVendorData);
        console.log("Vendor updated successfully with reference data");
      }

      let path = pathname;
      path = path.substring(0, path.lastIndexOf("/"));
      path += `/upload?id=${vendorId}${eoiId ? `&eoi_id=${eoiId}` : ''}`;
      router.push(path);
    } catch (error) {
      console.error("Error updating vendor with reference data:", error);
      // Continue with navigation even if update fails
      let path = pathname;
      path = path.substring(0, path.lastIndexOf("/"));
      path += `/upload?id=${vendorId}${eoiId ? `&eoi_id=${eoiId}` : ''}`;
      router.push(path);
    }
  };

  const onError = (errors: any) => {
    console.log("Reference form validation errors:", errors);
  };

  return (
    <VendorRegistationLayout>
      <div className='space-y-4'>
        <h2 className='text-lg font-bold'>Reference</h2>
        <div>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit, onError)} className='space-y-5'>
              <div>
                <Label className='text-red-500'>
                  Name and address of key client who we can contact for references (if any)
                </Label>
                <div>
                  {fields.map((field, index) => {
                    const label = String.fromCharCode(
                      "a".charCodeAt(0) + index
                    );
                    return (
                      <div
                        className='flex items-center justify-between gap-x-3 '
                        key={index}
                      >
                        <div className='relative w-[97%] grid grid-cols-3 pl-8 mt-4 gap-x-4 gap-y-4'>
                          <p className='absolute top-0 left-0 font-semibold '>
                            ({label})
                          </p>
                          <FormInput
                            label='Company Name'
                            name={`key_clients[${index}].company_name`}
                            defaultValue={field.company_name}
                            required
                          />
                          <FormInput
                            label='Company Address'
                            name={`key_clients[${index}].company_address`}
                            defaultValue={field.company_address}
                            required
                          />
                          <FormInput
                            label='Contact Person'
                            name={`key_clients[${index}].contact_person`}
                            defaultValue={field.contact_person}
                            required
                          />
                          <FormInput
                            label='Contact Person E-mail'
                            name={`key_clients[${index}].contact_person_email`}
                            defaultValue={field.contact_person_email}
                            type='email'
                            required
                          />
                          <FormInput
                            label='Contact Person Active Phone Number'
                            name={`key_clients[${index}].contact_person_phone`}
                            defaultValue={field.contact_person_phone}
                            type='tel'
                            required
                          />
                          <FormInput
                            label='Position of Contact Person'
                            name={`key_clients[${index}].contact_person_position`}
                            defaultValue={field.contact_person_position}
                            required
                          />
                        </div>
                        <div className='flex items-center h-full '>
                          <MinusCircle
                            onClick={() => remove(index)}
                            className='cursor-pointer text-primary'
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className='flex justify-end mt-2'>
                    <PlusCircle
                      onClick={() =>
                        append({
                          company_name: "",
                          company_address: "",
                          contact_person: "",
                          contact_person_email: "",
                          contact_person_phone: "",
                          contact_person_position: ""
                        })
                      }
                      className='cursor-pointer text-primary'
                    />
                  </div>
                </div>
              </div>
              <div className='flex justify-between pt-5'>
                <FormButton
                  onClick={() => router.back()}
                  preffix={<ArrowLeft size={14} />}
                  type='button'
                  className='bg-[#FFF2F2] text-primary dark:text-gray-500'
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

export default Reference;