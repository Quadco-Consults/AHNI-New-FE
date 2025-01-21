import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
// import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { useAppSelector } from "hooks/useStore";
import { dailogSelector } from "store/ui";
// import { toast } from "sonner";
import {
  CostCategorySchema,
  TCostCategoryData,
  TCostCategoryFormValues,
} from "definations/modules/finance/cost-category";
import FormRadio from "atoms/FormRadio";
import FormInput from "atoms/FormInput";
// import {
//   useAddCostCategoryMutation,
//   useUpdateCostCategoryMutation,
// } from "services/modules/finance/cost-category";

const NewLeaveForm = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TCostCategoryData;

  const form = useForm<TCostCategoryFormValues>({
    resolver: zodResolver(CostCategorySchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      code: data?.code ?? "",
    },
  });

  //   const [addCostCategory, { isLoading }] = useAddCostCategoryMutation();
  //   const [updateCostCategory, { isLoading: updateLoading }] =
  //     useUpdateCostCategoryMutation();

  //   const dispatch = useAppDispatch();

  // const onSubmit: SubmitHandler<TCostCategoryFormValues> = async (data) => {
  //   console.log({ data });

  //   // try {
  //   //   dialogProps?.type === "update"
  //   //     ? await updateCostCategory({
  //   //         //@ts-ignore
  //   //         id: String(dialogProps?.data?.id),
  //   //         body: data,
  //   //       }).unwrap()
  //   //     : await addCostCategory(data).unwrap();
  //   //   toast.success("Category Added Succesfully");
  //   //   dispatch(closeDialog());
  //   //   form.reset();
  //   // } catch (error: any) {
  //   //   toast.error(error.data.message || "Something went wrong");
  //   // }
  // };
  return (
    <CardContent>
      <Form {...form}>
        <form className='space-y-10'>
          <div className='w-full'>
            <FormInput
              label='Number of Days'
              name='number_of_days'
              placeholder=''
              required
            />
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormRadio
              label='Carry Forward'
              name='carry_forward'
              options={[
                {
                  label: "No",
                  value: "no",
                },
                { label: "Yes", value: "yes" },
              ]}
            />
            <div className='w-full'>
              <FormInput
                label='Maximum Leave Days'
                name='maximum_leave_days'
                placeholder=''
                required
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormRadio
              label='Allow Conversion of Leave days to compensation'
              name='leave_conversion'
              options={[
                {
                  label: "No",
                  value: "no",
                },
                { label: "Yes", value: "yes" },
              ]}
            />
            <div className='w-full'>
              <FormInput
                label='Value of a Leave Day'
                name='value_of_a_leave_day'
                placeholder=''
                required
              />
            </div>
          </div>
          <div className='flex justify-end'>
            {/* <FormButton loading={isLoading || updateLoading}>Save</FormButton> */}
            <FormButton>Add</FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default NewLeaveForm;
