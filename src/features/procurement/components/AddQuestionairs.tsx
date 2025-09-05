"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import {
  QuestionnaireSchema,
  TQuestionnaireData,
  TQuestionnaireFormValues,
} from "@/features/procurement/types/procurement/questionnaire";
import {
  useAddQuestionnaire,
  useUpdateQuestionnaire,
} from "@/features/modules/controllers/procurement/questionnaireController";
import FormTextArea from "@/components/FormTextArea";

const AddQuestionairs = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TQuestionnaireData;
  const form = useForm<TQuestionnaireFormValues>({
    resolver: zodResolver(QuestionnaireSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
  });

  const [questionairs, { isLoading }] = useAddQuestionnaire();
  const [updateQuestionairs, { isLoading: updateQuestionairsLoading }] =
    useUpdateQuestionnaire();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TQuestionnaireFormValues> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? await updateQuestionairs({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          })
        : await questionairs(data);
      toast.success("Questionairs Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
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
            label='Name'
            name='name'
            placeholder='Enter Name'
            required
          />

          <FormTextArea
            label='Description'
            placeholder='Enter Description'
            name='description'
          />

          <div className='flex justify-start'>
            <FormButton loading={isLoading || updateQuestionairsLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddQuestionairs;
