import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import GoodReceiveNoteLayout from "./Layout";
import { toast } from "sonner";
import {
  useCreateGoodReceiveNote,
  useModifyGoodReceiveNote,
} from "@/features/admin/controllers/goodReceiveNoteController";
import AddSquareIcon from "components/icons/AddSquareIcon";
import React, { useEffect, useState } from "react";
import Upload from "components/Upload";
import { AdminRoutes } from "constants/RouterConstants";
// import { Link } from "next/link";
import { useRouter } from "next/navigation";
import { TGoodReceiveNoteFormValues } from "features/admin/types/inventory-management/good-receive-note";
import Link from "next/link";

export default function GRNFileUploads() {
  const [files, setFiles] = useState<File[]>();
  const [grnData, setGrnData] = useState<{
    formData: TGoodReceiveNoteFormValues;
    isEdit: boolean;
    editId: string | null;
  } | null>(null);

  const router = useRouter();

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("grnFormData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setGrnData(parsedData);
      } catch (error) {
        console.error("Failed to parse GRN form data:", error);
        toast.error("Failed to load form data");
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = e.target.files;
      const fileArray = Array.from(fileList);
      setFiles(fileArray);
    }
  };

  const { createGoodReceiveNote, isLoading: isCreateLoading } =
    useCreateGoodReceiveNote();

  const { modifyGoodReceiveNote, isLoading: isModifyLoading } =
    useModifyGoodReceiveNote(grnData?.editId || "");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!grnData) {
      toast.error(
        "No form data found. Please go back and fill the form again."
      );
      return;
    }

    try {
      // Create FormData to include both GRN data and files
      const formData = new FormData();

      // Append all GRN data fields
      Object.entries(grnData.formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "object" && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Append files if any
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append(`document`, file);
        });
      }

      let res;
      if (grnData.isEdit) {
        res = await modifyGoodReceiveNote(formData as any);
      } else {
        res = await createGoodReceiveNote(formData as any);
      }

      if (res?.status === "success") {
        // toast.success("Good Receive Note saved successfully");
        localStorage.removeItem("grnFormData");
        router.push(AdminRoutes.GRN);
      }
    } catch (error: any) {
      console.error(error?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <GoodReceiveNoteLayout>
      <form onSubmit={onSubmit} className='space-y-3'>
        <h1 className='text-xl font-bold'>File Uploads</h1>

        <Upload onChange={handleChange} multiple>
          <Button
            className='flex gap-2 py-6 bg-[#FFF2F2] text-red-500 dark:bg-primary dark:text-white'
            type='button'
          >
            <AddSquareIcon />
            Upload Document
          </Button>
        </Upload>

        {files &&
          files?.map((file, index) => (
            <span key={index} className='block'>
              {file.name}&nbsp;
            </span>
          ))}

        <div className='flex items-center justify-end gap-x-4'>
          <Link href={AdminRoutes.GRN_CREATE_SUMMARY}>
            <Button variant='outline' type='button' size='lg'>
              Back
            </Button>
          </Link>

          <FormButton size='lg' loading={isCreateLoading || isModifyLoading}>
            Finish
          </FormButton>
        </div>
      </form>
    </GoodReceiveNoteLayout>
  );
}
