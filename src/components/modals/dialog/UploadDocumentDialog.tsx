"use client";

import FileUpload from "atoms/FileUpload";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
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

export default function UploadDocumentDialog({
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
              <AlertDialogTitle> {title}</AlertDialogTitle>
              <AlertDialogDescription>
                <FormInput label='Name Of Document' name={name} required />
                <FileUpload label='Choose Document' name='document' />
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
