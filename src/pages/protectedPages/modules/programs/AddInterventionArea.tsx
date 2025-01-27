import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";

import FormTextArea from "atoms/FormTextArea";
import {
  InterventionAreaSchema,
  TInterventionAreaData,
  TInterventionAreaFormValues,
} from "definations/modules/program/intervention-area";
import {
  useAddInterventionAreaMutation,
  useUpdateInterventionAreaMutation,
} from "services/modules/program/interventions";

const AddInterventionArea = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TInterventionAreaData;

  const form = useForm<TInterventionAreaFormValues>({
    resolver: zodResolver(InterventionAreaSchema),
    defaultValues: {
      code: data?.code ?? "",
      description: data?.description ?? "",
    },
  });

  const dispatch = useAppDispatch();
  const [interventionArea, { isLoading }] = useAddInterventionAreaMutation();
  const [updateInterventionArea, { isLoading: updateRiskLoading }] =
    useUpdateInterventionAreaMutation();

  const onSubmit: SubmitHandler<TInterventionAreaFormValues> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? await updateInterventionArea({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          }).unwrap()
        : await interventionArea(data).unwrap();
      toast.success("Intervention Area Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
    }
  };

  return (
    <CardContent>
      <Form {...form}>
        <form
          action=''
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-y-7'
        >
          <FormInput
            label='Code'
            name='code'
            placeholder='Enter Code'
            required
          />

          <FormTextArea
            label='Description'
            placeholder='Enter Description'
            name='description'
          />

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || updateRiskLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddInterventionArea;
