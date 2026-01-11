"use client";

import { Form } from "@/components/ui/form";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelectField";
import { Label } from "@/components/ui/label";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, MinusCircle, PlusCircle } from "lucide-react";
import FormButton from "@/components/FormButton";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { VendorsCompanySchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { vendorsActions } from "@/store/formData/procurement-vendors";
import { RootState } from "@/store/index";
import { useEffect } from "react";
import useQuery from "@/hooks/useQuery";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";

const Company = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const query = useQuery();
  const vendorId = query.get("id");
  const eoiId = query.get("eoi_id"); // Preserve EOI ID through registration flow

  const { data: vendor, isLoading, error } = VendorsAPI.useGetVendor(vendorId);
  const { updateVendor: updateVendorMutation } = VendorsAPI.useUpdateVendor(vendorId || "");
  const currentVendor = useSelector((state: RootState) => state.vendors.currentVendor);

  const form = useForm<z.infer<typeof VendorsCompanySchema>>({
    resolver: zodResolver(VendorsCompanySchema),
    defaultValues: {
      branches: [{ address: "", state: "", person_heading_branch: "", phone_number: "" }],
    },
  });

  const { control, handleSubmit } = form;

  useEffect(() => {
    // Priority: Redux currentVendor data > API vendor data > default values
    let branchData = [{ address: "", state: "", person_heading_branch: "", phone_number: "" }];

    if (currentVendor?.branches?.length > 0) {
      // Use Redux data if available (user has been entering data)
      branchData = currentVendor.branches;
    } else if (vendorId && vendor?.data && !isLoading) {
      // Use API data if editing existing vendor
      branchData = vendor.data.branches || branchData;
      // Also set the vendor data in Redux for persistence
      dispatch(vendorsActions.setCurrentVendor(vendor.data));
    }

    form.reset({
      branches: branchData,
    });
  }, [vendorId, vendor, isLoading, currentVendor, form, dispatch]);
  console.log({ vendor, vendorId });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "branches",
  });


  const onSubmit = async (data: z.infer<typeof VendorsCompanySchema>) => {
    console.log("Company form submitted with data:", data);

    try {
      // Update current vendor data in Redux store for persistence
      dispatch(vendorsActions.updateCurrentVendor(data));

      // Also add to vendors array for backwards compatibility
      dispatch(vendorsActions.addVendors(data));

      // If we have a vendor ID, update the vendor via API
      if (vendorId) {
        console.log("Updating vendor with company data:", {
          ...currentVendor,
          ...data
        });

        const updatedVendorData = {
          ...currentVendor,
          ...data
        };

        await updateVendorMutation(updatedVendorData);
        console.log("Vendor updated successfully with company data");
      }

      let path = pathname;
      path = path.substring(0, path.lastIndexOf("/"));
      path += `/reference?id=${vendorId}${eoiId ? `&eoi_id=${eoiId}` : ''}`;
      router.push(path);
    } catch (error) {
      console.error("Error updating vendor with company data:", error);
      // Continue with navigation even if update fails
      let path = pathname;
      path = path.substring(0, path.lastIndexOf("/"));
      path += `/reference?id=${vendorId}${eoiId ? `&eoi_id=${eoiId}` : ''}`;
      router.push(path);
    }
  };

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
  };

  return (
    <VendorRegistationLayout>
      <div className='space-y-4'>
        <h2 className='text-lg font-bold'>Branch Offices</h2>
        <div>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit, onError)} className='space-y-5'>
              {/* <Separator className="mt-8" /> */}
              <div>
                <Label className='text-red-500'>Branch Office(s) Address</Label>
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
                        <div className='relative w-[97%] grid grid-cols-2 pl-8 mt-4 gap-x-4 gap-y-4'>
                          <p className='absolute top-0 left-0 font-semibold '>
                            ({label})
                          </p>
                          <FormInput
                            label='Address'
                            name={`branches[${index}].address`}
                            defaultValue={field.address}
                            required
                          />
                          <FormSelect
                            label='State'
                            name={`branches[${index}].state`}
                            required
                          >
                            <SelectContent>
                              {statesOfNigeria.map(
                                (
                                  { label, value }: { label: string; value: string },
                                  stateIndex: number
                                ) => (
                                  <SelectItem key={stateIndex} value={value}>
                                    {label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </FormSelect>
                          <FormInput
                            label='Name Of Person Heading Branch'
                            name={`branches[${index}].person_heading_branch`}
                            defaultValue={field.person_heading_branch}
                            required
                          />
                          <FormInput
                            label='Phone Number'
                            name={`branches[${index}].phone_number`}
                            defaultValue={field.phone_number}
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
                        append({ address: "", state: "", person_heading_branch: "", phone_number: "" })
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

export default Company;

const statesOfNigeria = [
  { value: "Abia", label: "Abia" },
  { value: "Adamawa", label: "Adamawa" },
  { value: "Akwa Ibom", label: "Akwa Ibom" },
  { value: "Anambra", label: "Anambra" },
  { value: "Bauchi", label: "Bauchi" },
  { value: "Bayelsa", label: "Bayelsa" },
  { value: "Benue", label: "Benue" },
  { value: "Borno", label: "Borno" },
  { value: "Cross River", label: "Cross River" },
  { value: "Delta", label: "Delta" },
  { value: "Ebonyi", label: "Ebonyi" },
  { value: "Edo", label: "Edo" },
  { value: "Ekiti", label: "Ekiti" },
  { value: "Enugu", label: "Enugu" },
  { value: "Federal Capital Territory", label: "FCT (Abuja)" },
  { value: "Gombe", label: "Gombe" },
  { value: "Imo", label: "Imo" },
  { value: "Jigawa", label: "Jigawa" },
  { value: "Kaduna", label: "Kaduna" },
  { value: "Kano", label: "Kano" },
  { value: "Katsina", label: "Katsina" },
  { value: "Kebbi", label: "Kebbi" },
  { value: "Kogi", label: "Kogi" },
  { value: "Kwara", label: "Kwara" },
  { value: "Lagos", label: "Lagos" },
  { value: "Nasarawa", label: "Nasarawa" },
  { value: "Niger", label: "Niger" },
  { value: "Ogun", label: "Ogun" },
  { value: "Ondo", label: "Ondo" },
  { value: "Osun", label: "Osun" },
  { value: "Oyo", label: "Oyo" },
  { value: "Plateau", label: "Plateau" },
  { value: "Rivers", label: "Rivers" },
  { value: "Sokoto", label: "Sokoto" },
  { value: "Taraba", label: "Taraba" },
  { value: "Yobe", label: "Yobe" },
  { value: "Zamfara", label: "Zamfara" },
];
