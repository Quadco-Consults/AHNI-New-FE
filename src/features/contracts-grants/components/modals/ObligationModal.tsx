import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "components/atoms/FormButton";
import FormInput from "components/atoms/FormInput";
// import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import { Form } from "components/ui/form";
import {
  IObligationPaginatedData,
  ObligationSchema,
  TObligationFormData,
} from "features/contracts-grants/types/grants";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateObligation,
  useModifyObligation,
} from "@/features/contracts-grants/controllers/obligationController";
import { toast } from "sonner";
import { closeDialog } from "store/ui";

export default function AObligationModal() {
  const { dialogProps } = useAppSelector((state) => state.ui.dailog);

  const obligation =
    dialogProps?.obligation as unknown as IObligationPaginatedData;

  const form = useForm<TObligationFormData>({
    resolver: zodResolver(ObligationSchema),
    defaultValues: {
      amount: obligation?.amount ?? "",
      description: obligation?.description ?? "",
    },
  });

  const dispatch = useAppDispatch();

  const grantId = dialogProps?.grantId as string;

  const { createObligation, isLoading: isCreateLoading } =
    useCreateObligation();

  const { modifyObligation, isLoading: isModifyLoading } =
    useModifyObligation();

  const onSubmit: SubmitHandler<TObligationFormData> = async (data) => {
    try {
      if (obligation?.id) {
        await modifyObligation({
          grantId,
          obligationId: obligation?.id,
          body: data,
        })();
      } else {
        await createObligation({
          grantId,
          body: data,
        })();

        toast.success("Obligation Created");
      }

      dispatch(closeDialog());
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
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