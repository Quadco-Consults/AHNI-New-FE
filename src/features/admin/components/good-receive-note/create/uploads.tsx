import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import GoodReceiveNoteLayout from "./Layout";
import { toast } from "sonner";
import {
  useCreateGoodReceiveNote,
  useModifyGoodReceiveNote,
  useDebugCreateGoodReceiveNote,
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
        console.log("🔍 Raw localStorage data:", storedData);
        console.log("🔍 Parsed GRN data:", parsedData);
        console.log("🔍 items in parsed data:", parsedData?.formData?.items);
        console.log("🔍 grn_items in parsed data:", parsedData?.formData?.grn_items);
        console.log("🔍 All formData keys:", Object.keys(parsedData?.formData || {}));
        setGrnData(parsedData);
      } catch (error) {
        console.error("Failed to parse GRN form data:", error);
        toast.error("Failed to load form data");
      }
    } else {
      console.error("❌ No GRN form data found in localStorage");
      toast.error("No form data found. Please go back and fill the form again.");
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

  const { debugCreateGoodReceiveNote, isLoading: isDebugLoading } =
    useDebugCreateGoodReceiveNote();

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
      // Check if we have files - if not, send as JSON instead of FormData
      const hasFiles = files && files.length > 0;

      // Check for items in different possible locations
      const itemsToProcess = grnData.formData.items || grnData.formData.grn_items || [];

      // Validate items exist
      if (!itemsToProcess || itemsToProcess.length === 0) {
        console.error("❌ No items found in form data!");
        console.error("❌ Full form data:", grnData.formData);
        console.error("❌ Available keys:", Object.keys(grnData.formData || {}));
        toast.error("No items found to process. Please go back and add items.");
        return;
      }

      console.log("📋 GRN Items being processed:", itemsToProcess);
      console.log("📋 Has files:", hasFiles);

      // Transform items to match backend expectations (grn_items)
      const transformedItems = itemsToProcess.map(item => ({
        // Handle different possible field names
        purchase_order_item: item.item_id || item.purchase_order_item,
        received_quantity: item.quantity_received || item.received_quantity,
        remark: item.comment || item.remark,
      }));

      if (!hasFiles) {
        // Send as JSON when no files
        const jsonPayload = {
          purchase_order: grnData.formData.purchase_order,
          invoice_number: grnData.formData.invoice_number,
          waybill_number: grnData.formData.waybill_number,
          remark: grnData.formData.remark,
          grn_items: transformedItems,
        };

        console.log("📤 Sending as JSON (no files):", jsonPayload);

        await createGoodReceiveNote(jsonPayload);
        toast.success("GRN created successfully!");
        return;
      }

      // If we have files, use FormData
      const formData = new FormData();

      // Append all GRN data fields
      Object.entries(grnData.formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "items") {
            // Transform "items" to "grn_items" with correct field mapping
            console.log(`📤 Transforming items to grn_items (${transformedItems.length} items):`, transformedItems);

            // Send each item as individual form fields (Django array format)
            transformedItems.forEach((item, index) => {
              formData.append(`grn_items[${index}][purchase_order_item]`, String(item.purchase_order_item));
              formData.append(`grn_items[${index}][received_quantity]`, String(item.received_quantity));
              formData.append(`grn_items[${index}][remark]`, String(item.remark));
            });

            console.log(`📤 Added ${transformedItems.length} items as individual form fields`);

          } else if (typeof value === "object" && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            console.log(`📤 Appending ${key}:`, String(value));
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

      // Debug: Log FormData contents
      console.log("📤 FormData being sent:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      let res;

      // DEBUG MODE: Test with debug endpoint first to see what backend receives
      const DEBUG_MODE = true; // Set to false to use real endpoint

      if (DEBUG_MODE) {
        console.log("🔬 DEBUG MODE: Using debug endpoint");
        try {
          if (!files || files.length === 0) {
            console.log("🔬 DEBUG: Testing JSON payload");
            res = await debugCreateGoodReceiveNote(grnData.formData as any);
          } else {
            console.log("🔬 DEBUG: Testing FormData payload");
            res = await debugCreateGoodReceiveNote(formData as any);
          }

          if (res) {
            toast.success("Debug: Data structure sent successfully! Check backend logs.");
            console.log("🔬 Debug response:", res);
          }
        } catch (error: any) {
          console.log("🔬 Debug endpoint not available, falling back to regular creation");
          // Fall back to regular creation if debug endpoint doesn't exist
        }
      }

      // Regular creation flow
      if (!DEBUG_MODE || !res) {
        // Test: Try sending as JSON first (without files) to isolate the issue
        if (!files || files.length === 0) {
          console.log("🧪 Testing: Sending as JSON (no files)");
          console.log("🧪 JSON payload:", grnData.formData);

          // Send as regular JSON instead of FormData
          if (grnData.isEdit) {
            res = await modifyGoodReceiveNote(grnData.formData as any);
          } else {
            res = await createGoodReceiveNote(grnData.formData as any);
          }
        } else {
          console.log("🧪 Testing: Sending as FormData (with files)");
          if (grnData.isEdit) {
            res = await modifyGoodReceiveNote(formData as any);
          } else {
            res = await createGoodReceiveNote(formData as any);
          }
        }
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

          <FormButton size='lg' loading={isCreateLoading || isModifyLoading || isDebugLoading}>
            Finish
          </FormButton>
        </div>
      </form>
    </GoodReceiveNoteLayout>
  );
}
