"use client";

import FormButton from "atoms/FormButton";
import FormTextArea from "atoms/FormTextArea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "components/ui/alert-dialog";
import { FormProvider } from "react-hook-form";

export default function WriteDialog({
  open,
  form,
  title,
  name,
  onSubmit,
  loading,
  onCancel,
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <FormProvider {...form}>
          {" "}
          {/* Wrap with FormProvider */}
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit {title}</AlertDialogTitle>
              <AlertDialogDescription>
                <FormTextArea name={name} label={title} rows={8} required />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
              <AlertDialogAction type='submit'>
                <FormButton loading={loading} disabled={loading}>
                  Submit
                </FormButton>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </FormProvider>
      </AlertDialogContent>
    </AlertDialog>
  );
}
