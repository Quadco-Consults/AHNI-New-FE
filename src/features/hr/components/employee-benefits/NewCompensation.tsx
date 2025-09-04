"use client";

import { Form } from "components/ui/form";
// import VendorRegistationLayout from "./VendorRegistationLayout";
import { useForm } from "react-hook-form";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import { ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import { SelectContent, SelectItem } from "components/ui/select";
import { useEffect, useMemo } from "react";
import { useGetPayGroups } from "@/features/hr/controllers/payGroupController";
import { useCreateCompensation } from "@/features/hr/controllers/compensationController";
import { toast } from "sonner";
import { Grade } from "@/features/hr/types/pay-group";

const NewCompensation = () => {
  const { data: payGroupsData } = useGetPayGroups();
  const { createCompensation } = useCreateCompensation();
  // @ts-ignore
  const form = useForm({
    // resolver: zodResolver(VendorsRegistrationSchema),
    defaultValues: {
      compensation_name: "",
      type: "",
      amount_or_percentage: "",
      percentage: undefined,
      amount: undefined,
      position: "",
      grade: "",
      period: "",
    },
  });

  // const [isModalOpen, setModalOpen] = useState(false);

  //   const dispatch = useDispatch();

  const router = useRouter();

  const pathname = usePathname();

  const { handleSubmit, watch, setValue } = form;
  // Watch the selected value of amount_or_percentage

  const selectedPayGroup = watch("position"); // watch selected Position

  const grade: Grade = useMemo(() => {
    const selected = payGroupsData?.data?.results?.find(
      (group) => group?.position?.id === selectedPayGroup
    );

    return selected?.grade || []; // Assuming grade is an array in the pay group
  }, [selectedPayGroup, payGroupsData]);

  const amountOrPercentage = watch("amount_or_percentage");

  console.log({ payGroupsData });

  const positionOptions = payGroupsData?.data.results.map((payGroup) => ({
    label: `Position: ${payGroup?.position?.name}, Grade: ${payGroup?.grade?.name},  Level: ${payGroup?.level?.name}`,
    value: payGroup?.id,
  }));

  const onSubmit = async (data: any) => {
    const formData = {
      name: data.compensation_name,
      type: data.type,
      amount_or_percentage: data.amount_or_percentage,
      percentage: data.percentage,
      amount: data.amount,
      pay_group: data.position,
      grade: grade?.id,
      period: data.period,
    };

    await createCompensation(formData);
    toast.success("Compensation created successfully");

    // () => setModalOpen(true);
    // dispatch(vendorsActions.addVendors({ ...data }));

    let path = pathname;

    // Remove the last segment of the path
    path = path.substring(0, path.lastIndexOf("/"));

    // Append the new segment to the path
    // path += "/the-company";
    router.push(path);
  };

  // Clear the grade field whenever the position changes
  useEffect(() => {
    if (grade) {
      setValue("grade", grade?.name?.toLocaleString()); // if grade is a number, convert to string for SelectField
    }
  }, [grade, setValue]);

  return (
    <>
      <div className='px-3 '>
        <h2 className='text-lg font-bold'>New Compensation</h2>
        <div className='mt-10'>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-2 gap-6'>
                <FormInput
                  label='Compensation Name'
                  name='compensation_name'
                  type='text'
                />
                <FormSelect name='type' label='Type'>
                  <SelectContent>
                    {["Deduction", "Earning"].map(
                      (value: string, index: number) => (
                        <SelectItem key={index} value={value}>
                          {value}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </FormSelect>
              </div>
              <FormSelect
                name='amount_or_percentage'
                label='Amount or Percentage'
              >
                <SelectContent>
                  {["Percentage", "Amount"].map(
                    (value: string, index: number) => (
                      <SelectItem key={index} value={value}>
                        {value}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </FormSelect>
              {/* <FormInput label='Percentage' name='percentegae' type='text' />
              <FormInput label='Amount' name='amount' type='text' /> */}

              {/* Conditionally show fields */}
              {amountOrPercentage === "Percentage" && (
                <FormInput
                  label='Percentage'
                  name='percentage'
                  type='number'
                  // control={control}
                />
              )}
              {amountOrPercentage === "Amount" && (
                <FormInput
                  label='Amount'
                  name='amount'
                  type='number'
                  // control={control}
                />
              )}

              <div className=''>
                {/* <h2 className='text-md font-semibold mb-10'>Pay Group</h2> */}
                <div className='grid grid-cols-2 col-span-3 gap-x-6  mb-4'>
                  {/* <FormSelect name='position' label='Position'>
                    <SelectContent>
                      {payGroupsData?.data?.results?.map((payGroup) => (
                        <SelectItem
                          key={payGroup.id}
                          value={payGroup.position?.id}
                        >
                          {payGroup?.position?.name} {grade?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FormSelect> */}
                  <FormSelect
                    label='Pay Group'
                    placeholder='Select Position'
                    name='position'
                    required
                    options={positionOptions}
                  />
                  <FormSelect name='period' label='Period'>
                    <SelectContent>
                      {[
                        "Daily",
                        "Weekly",
                        "Monthly",
                        "Annually",
                        "One-Off",
                      ].map((value: string, index: number) => (
                        <SelectItem key={index} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FormSelect>
                </div>
              </div>

              <div className='flex justify-end gap-6 mt-16'>
                <Button
                  type='button'
                  onClick={() => router.back()}
                  className='bg-[#FFF2F2] text-primary dark:text-gray-500'
                >
                  Cancel
                </Button>
                {/* <Button className="bg-primary">
                  Proceed <ChevronRight size={14} />{" "}
                </Button> */}
                <FormButton
                  suffix={<ChevronRight size={14} type='submit' />}
                  // onClick={() => setModalOpen(true)}
                >
                  Create
                </FormButton>
              </div>
            </form>
          </Form>
        </div>
      </div>
      {/* <PayGroupModal
        isOpen={isModalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => {}}
      /> */}
    </>
  );
};

export default NewCompensation;
