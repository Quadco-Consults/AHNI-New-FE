import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "components/atoms/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import { Form } from "components/ui/form";
import {
  ExpenditureSchema,
  IExpenditurePaginatedData,
  TExpenditureFormData,
} from "features/contracts-grants/types/grants";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateExpenditure,
  useModifyExpenditure,
} from "@/features/contracts-grants/controllers/grant/expenditureController";
import { toast } from "sonner";
import { closeDialog } from "store/ui";

export default function ExpenditureModal() {
  const { dialogProps } = useAppSelector((state) => state.ui.dailog);

  const expenditure =
    dialogProps?.expenditure as unknown as IExpenditurePaginatedData;

  const form = useForm<TExpenditureFormData>({
    resolver: zodResolver(ExpenditureSchema),
    defaultValues: {
      amount: expenditure?.amount ?? "",
      description: expenditure?.description ?? "",
    },
  });

  const dispatch = useAppDispatch();

  const grantId = dialogProps?.grantId as string;

  const { createExpenditure, isLoading: isCreateLoading } =
    useCreateExpenditure();

  const { modifyExpenditure, isLoading: isModifyLoading } =
    useModifyExpenditure();

  const onSubmit: SubmitHandler<TExpenditureFormData> = async (data) => {
    try {
      if (expenditure?.id) {
        await modifyExpenditure({
          grantId,
          expenditureId: expenditure?.id,
          body: data,
        })();
        toast.success("Expenditure Updated");
      } else {
        await createExpenditure({
          grantId,
          body: data,
        })();
        toast.success("Expenditure Created");
      }

      dispatch(closeDialog());
    } catch (error: any) {
      console.log(error);
      toast.error(error.data?.message ?? "Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        {/* <FormSelect
          label='Project'
          name='amount'
          placeholder='Select Project'
          required
          options={[]}
        /> */}
        {/* 
        <FormSelect
          label='Activity'
          name='amount'
          placeholder='Select Activity'
          required
          options={[]}
        /> */}

        <FormInput
          type='number'
          label='Amount'
          name='amount'
          placeholder='Enter Amount'
          required
        />

        <FormTextArea
          label='Description'
          name='description'
          placeholder='Enter Description'
          required
        />

        <div className='flex justify-end'>
          <FormButton size='lg' loading={isCreateLoading || isModifyLoading}>
            Submit
          </FormButton>
        </div>
      </form>
    </Form>
  );
}