"use client";

import { useRouter, usePathname } from "next/navigation";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "components/atoms/FormInput";
import { ArrowLeft, ArrowRight, MinusCircle, PlusCircle } from "lucide-react";
import { Label } from "components/ui/label";
import { Form } from "components/ui/form";
import { Separator } from "components/ui/separator";
import FormButton from "@/components/FormButton";
import { z } from "zod";
import { VendorsTechnicalSchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { vendorsActions } from "store/formData/procurement-vendors";
import { useEffect } from "react";
import useQuery from "hooks/useQuery";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";

const Technical = () => {
  const dispatch = useDispatch();
  const query = useQuery();
  const vendorId = query.get("id");

  const {
    data: vendor,
    isLoading,
  } = VendorsAPI.useGetVendor(vendorId);

  const form = useForm<z.infer<typeof VendorsTechnicalSchema>>({
    resolver: zodResolver(VendorsTechnicalSchema),
    defaultValues: {
      production_equipments: [{ name: "", manufacturer: "", year: "" }],
      number_of_operational_work_shift: "",
      installed_capacity: "",
      lagest_capacity_and_utilization: "",
      brief_of_quality_control: "",
      brief_of_sampling: "",
    },
  });

  const { control } = form;

  useEffect(() => {
    if (vendorId && vendor?.data && !isLoading) {
      form.reset({
        production_equipments: vendor?.data?.production_equipments || [{ name: "", manufacturer: "", year: "" }],
        number_of_operational_work_shift: vendor?.data?.number_of_operational_work_shift || "",
        installed_capacity: vendor?.data?.installed_capacity || "",
        lagest_capacity_and_utilization: vendor?.data?.lagest_capacity_and_utilization || "",
        brief_of_quality_control: vendor?.data?.brief_of_quality_control || "",
        brief_of_sampling: vendor?.data?.brief_of_sampling || "",
      });
    }
  }, [vendorId, vendor, isLoading, form]);

  const router = useRouter();

  const pathname = usePathname();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "production_equipments",
  });

  const { handleSubmit } = form;

  const onSubmit = (data: z.infer<typeof VendorsTechnicalSchema>) => {
    console.log(data);

    dispatch(vendorsActions.addVendors(data));

    let path = pathname;

    // Remove the last segment of the path
    path = path.substring(0, path.lastIndexOf("/"));

    // Append the new segment to the path
    path += `/questionnaire?id=${vendorId}`;
    router.push(path);
  };
  return (
    <VendorRegistationLayout>
      <div>
        <h2 className='text-lg font-bold'>Technical Capacity</h2>
        <Form {...form}>
          <form className='mt-10' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label className='text-red-500'>
                Details of Production Equipment
              </Label>
              <div>
                {fields.map((field, index) => {
                  const label = String.fromCharCode("a".charCodeAt(0) + index);
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
                          label='Equipment Name'
                          name={`production_equipments[${index}].name`}
                          defaultValue={field.name}
                          required
                        />
                        <FormInput
                          label='Manufacturer'
                          name={`production_equipments[${index}].manufacturer`}
                          defaultValue={field.manufacturer}
                          required
                        />
                        <FormInput
                          label='Year'
                          name={`production_equipments[${index}].year`}
                          defaultValue={field.year}
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
                      append({ name: "", manufacturer: "", year: "" })
                    }
                    className='cursor-pointer text-primary'
                  />
                </div>
              </div>
            </div>
            <Separator className='mt-8' />
            <div className='mt-10'>
              <FormInput name='installed_capacity' label='Installed Capacity' />
            </div>
            <div className='grid grid-cols-2 gap-6 mt-10'>
              <FormInput
                name='lagest_capacity_and_utilization'
                label='Latest Capacity and Utilization'
              />
              <FormInput
                label='Number of operational work shifts'
                type='number'
                name='number_of_operational_work_shift'
              />
              <FormInput
                label='Provide Brief Details of Quality Control Procedures'
                name='brief_of_quality_control'
              />
              <FormInput
                label='Provide brief details of sampling procedures'
                name='brief_of_sampling'
              />
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

              <FormButton suffix={<ArrowRight size={14} />}>Proceed</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </VendorRegistationLayout>
  );
};

export default Technical;
