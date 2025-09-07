"use client";

import { Form } from "components/ui/form";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "components/atoms/FormInput";
import { Separator } from "components/ui/separator";
import { Label } from "components/ui/label";
import { ArrowLeft, ArrowRight, MinusCircle, PlusCircle } from "lucide-react";
import FormButton from "@/components/FormButton";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import FormSelect from "components/atoms/FormSelectField";
import { VendorsCompanySchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SelectContent, SelectItem } from "components/ui/select";
import { useDispatch } from "react-redux";
import { vendorsActions } from "store/formData/procurement-vendors";
import { useEffect } from "react";
import useQuery from "hooks/useQuery";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";

const Company = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const query = useQuery();
  const vendorId = query.get("id");

  const { data: vendor, isLoading, error } = VendorsAPI.useGetVendor(vendorId);

  const form = useForm<z.infer<typeof VendorsCompanySchema>>({
    resolver: zodResolver(VendorsCompanySchema),
    defaultValues: {
      branches: [{ name: "", address: "", phone_number: "" }],
      share_holders: [{ name: "", address: "", phone_number: "" }],
      key_staff: [
        { name: "", address: "", qualification: "", phone_number: "" },
      ],
      associated_entities: [
        { name: "", address: "", phone_number: "", entity_type: "" },
      ],
    },
  });

  const { control, handleSubmit } = form;

  useEffect(() => {
    if (vendorId && vendor?.data && !isLoading) {
      form.reset({
        branches: vendor?.data?.branches || [
          { name: "", address: "", phone_number: "" },
        ],
        share_holders: vendor?.data?.share_holders || [
          { name: "", address: "", phone_number: "" },
        ],
        key_staff: vendor?.data?.key_staff || [
          { name: "", address: "", qualification: "", phone_number: "" },
        ],
        associated_entities: vendor?.data?.associated_entities || [
          { name: "", address: "", phone_number: "", entity_type: "" },
        ],
      });
    }
  }, [vendorId, vendor, isLoading, form]);
  console.log({ vendor, vendorId });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "branches",
  });

  const {
    fields: key_staff,
    append: appendKeystaff,
    remove: removeKeystaff,
  } = useFieldArray({
    control,
    name: "key_staff",
  });
  const {
    fields: share_holders,
    append: appendStakeholder,
    remove: removeStakeholder,
  } = useFieldArray({
    control,
    name: "share_holders",
  });

  const {
    fields: associated_entities,
    append: appendSubsidiary,
    remove: removeSubsidiary,
  } = useFieldArray({
    control,
    name: "associated_entities",
  });

  const onSubmit = (data: z.infer<typeof VendorsCompanySchema>) => {
    dispatch(vendorsActions.addVendors(data));
    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += `/technical-capacity?id=${vendorId}`;
    router.push(path);
  };

  return (
    <VendorRegistationLayout>
      <div className='space-y-4'>
        <h2 className='text-lg font-bold'>The Company</h2>
        <div>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
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
                        <div className='relative w-[97%] grid grid-cols-3 pl-8 mt-4 gap-x-4 '>
                          <p className='absolute top-0 left-0 font-semibold '>
                            ({label})
                          </p>
                          <FormInput
                            label='Name'
                            name={`branches[${index}].name`}
                            defaultValue={field.name}
                            required
                          />
                          <FormInput
                            label='Address'
                            name={`branches[${index}].address`}
                            defaultValue={field.address}
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
                        append({ name: "", address: "", phone_number: "" })
                      }
                      className='cursor-pointer text-primary'
                    />
                  </div>
                </div>
              </div>
              <Separator className='mt-8' />
              <div>
                <Label className='text-red-500'>
                  Majority Shareholders & Directors{" "}
                </Label>
                <div>
                  {share_holders.map((field, index) => {
                    const label = String.fromCharCode(
                      "a".charCodeAt(0) + index
                    );
                    return (
                      <div
                        className='flex items-center justify-between gap-x-3 '
                        key={index}
                      >
                        <div className='relative w-[97%] grid grid-cols-3 pl-8 mt-4 gap-x-4 '>
                          <p className='absolute top-0 left-0 font-semibold '>
                            ({label})
                          </p>
                          <FormInput
                            label='Name'
                            name={`share_holders[${index}].name`}
                            defaultValue={field.name}
                            required
                          />
                          <FormInput
                            label='Address'
                            name={`share_holders[${index}].address`}
                            defaultValue={field.address}
                            required
                          />
                          <FormInput
                            label='Phone Number'
                            name={`share_holders[${index}].phone_number`}
                            defaultValue={field.phone_number}
                            required
                          />
                        </div>
                        <div className='flex items-center h-full '>
                          <MinusCircle
                            onClick={() => removeStakeholder(index)}
                            className='cursor-pointer text-primary'
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className='flex justify-end mt-2'>
                    <PlusCircle
                      onClick={() =>
                        appendStakeholder({
                          name: "",
                          address: "",
                          phone_number: "",
                        })
                      }
                      className='cursor-pointer text-primary'
                    />
                  </div>
                </div>
              </div>
              <Separator className='mt-8' />
              <div>
                <Label className='text-red-500'>
                  Names & Qualifications of Key Staff
                </Label>
                <div>
                  {key_staff.map((field, index) => {
                    const label = String.fromCharCode(
                      "a".charCodeAt(0) + index
                    );
                    return (
                      <div
                        className='flex items-center justify-between gap-x-3 '
                        key={index}
                      >
                        <div className='relative w-[97%] grid grid-cols-2 pl-8 mt-4 gap-4 '>
                          <p className='absolute top-0 left-0 font-semibold '>
                            ({label})
                          </p>
                          <FormInput
                            label='Name'
                            name={`key_staff[${index}].name`}
                            defaultValue={field.name}
                            required
                          />
                          <FormInput
                            label='Qualification'
                            name={`key_staff[${index}].qualification`}
                            defaultValue={field.qualification}
                            required
                          />
                          <FormInput
                            label='Phone Number'
                            name={`key_staff[${index}].address`}
                            defaultValue={field.address}
                            required
                          />
                          <FormInput
                            label='Address'
                            name={`key_staff[${index}].phone_number`}
                            defaultValue={field.phone_number}
                            required
                          />
                        </div>
                        <div className='flex items-center h-full '>
                          <MinusCircle
                            onClick={() => removeKeystaff(index)}
                            className='cursor-pointer text-primary'
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className='flex justify-end mt-2'>
                    <PlusCircle
                      onClick={() =>
                        appendKeystaff({
                          name: "",
                          qualification: "",
                          phone_number: "",
                          address: "",
                        })
                      }
                      className='cursor-pointer text-primary'
                    />
                  </div>
                </div>
              </div>
              <Separator className='mt-8' />
              <div>
                <Label className='text-red-500'>
                  Subsidiaries, Associates, Affiliates or Technical Partners
                </Label>
                <div>
                  {associated_entities.map((field, index) => {
                    const label = String.fromCharCode(
                      "a".charCodeAt(0) + index
                    );
                    return (
                      <div
                        className='flex items-center justify-between gap-x-3 '
                        key={index}
                      >
                        <div className='relative w-[97%] grid grid-cols-2 pl-8 mt-4 gap-4 '>
                          <p className='absolute top-0 left-0 font-semibold '>
                            ({label})
                          </p>
                          <FormInput
                            label='Name'
                            name={`associated_entities[${index}].name`}
                            defaultValue={field.name}
                            required
                          />
                          <FormInput
                            label='Address'
                            name={`associated_entities[${index}].address`}
                            defaultValue={field.address}
                            required
                          />
                          <FormInput
                            label='Phone Number'
                            name={`associated_entities[${index}].phone_number`}
                            defaultValue={field.phone_number}
                            required
                          />
                          <FormSelect
                            label='Association Type'
                            name={`associated_entities[${index}].entity_type`}
                            defaultValue={field.entity_type}
                            required
                          >
                            <SelectContent>
                              {[
                                "Subsidiary",
                                "Associate",
                                "Affiliate",
                                "Technical Partner",
                              ].map((value: string, index: number) => (
                                <SelectItem key={index} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </FormSelect>
                        </div>
                        <div className='flex items-center h-full '>
                          <MinusCircle
                            onClick={() => removeSubsidiary(index)}
                            className='cursor-pointer text-primary'
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className='flex justify-end mt-2'>
                    <PlusCircle
                      onClick={() =>
                        appendSubsidiary({
                          name: "",
                          address: "",
                          phone_number: "",
                          entity_type: "",
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

export default Company;
