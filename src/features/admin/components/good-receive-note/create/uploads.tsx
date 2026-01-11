import FormButton from "@/components/FormButton";
import { Button } from "@/components/ui/button";
import GoodReceiveNoteLayout from "./Layout";
import { toast } from "sonner";
import {
  useCreateGoodReceiveNote,
  useModifyGoodReceiveNote,
} from "@/features/admin/controllers/goodReceiveNoteController";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import React, { useEffect, useState } from "react";
import Upload from "@/components/Upload";
import { AdminRoutes } from "@/constants/RouterConstants";
// import { Link } from "next/link";
import { useRouter } from "next/navigation";
import { TGoodReceiveNoteFormValues } from "@/features/admin/types/inventory-management/good-receive-note";
import Link from "next/link";

export default function GRNFileUploads() {
  const [files, setFiles] = useState<File[]>();
  const [grnData, setGrnData] = useState<{
    formData: any; // Using any because formData structure differs from form schema
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
        console.log("🔍 invoice_number:", parsedData?.formData?.invoice_number);
        console.log("🔍 waybill_number:", parsedData?.formData?.waybill_number);
        console.log("🔍 remark:", parsedData?.formData?.remark);
        setGrnData(parsedData);
      } catch (error) {
        console.error("Failed to parse GRN form data:", error);
        toast.error("Failed to load form data");
      }
    } else {
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
      const itemsToProcess = grnData.formData.grn_items || grnData.formData.items || [];

      console.log("🔍 Checking for items...");
      console.log("🔍 grnData.formData.grn_items:", grnData.formData.grn_items);
      console.log("🔍 grnData.formData.items:", grnData.formData.items);
      console.log("🔍 itemsToProcess:", itemsToProcess);

      // Validate items exist
      if (!itemsToProcess || itemsToProcess.length === 0) {
        console.error("❌ No items found in form data!");
        console.error("❌ Full form data:", grnData.formData);
        console.error("❌ Available keys:", Object.keys(grnData.formData || {}));
        toast.error("No items found to process. Please go back and fill in at least one item with quantity received.");
        return;
      }

      console.log("📋 GRN Items being processed:", itemsToProcess);
      console.log("📋 Has files:", hasFiles);

      // Transform items to match backend expectations (grn_items)
      console.log("🔍 Raw items to process:", itemsToProcess);
      const transformedItems = itemsToProcess.map((item: any, index: number) => {
        console.log(`🔍 Processing item ${index}:`, item);

        // Handle different possible field names
        // IMPORTANT: Check purchase_order_item FIRST (what summary.tsx saves)
        const purchase_order_item = item.purchase_order_item || item.item_id || item.id;
        const received_quantity = item.received_quantity || item.quantity_received;
        const remark = item.remark || item.comment || "";

        console.log(`🔍 Item ${index} extracted values:`, {
          purchase_order_item,
          received_quantity,
          remark,
          raw_item: item
        });

        // Validate required fields
        if (!purchase_order_item) {
          console.error(`❌ Item ${index} missing purchase_order_item:`, item);
          throw new Error(`Item #${index + 1}: Missing purchase order item ID. Check console for details.`);
        }
        if (!received_quantity || parseFloat(String(received_quantity)) < 0) {
          console.error(`❌ Item ${index} invalid quantity:`, item);
          throw new Error(`Item #${index + 1}: Invalid received quantity`);
        }

        const transformed = {
          purchase_order_item: String(purchase_order_item),
          received_quantity: parseFloat(String(received_quantity)),
          remark: String(remark),
        };

        console.log(`✅ Item ${index} transformed:`, transformed);
        return transformed;
      });

      // Validate required fields before sending
      if (!grnData.formData.invoice_number || grnData.formData.invoice_number.trim() === '') {
        toast.error("Invoice number is required");
        return;
      }
      if (!grnData.formData.waybill_number || grnData.formData.waybill_number.trim() === '') {
        toast.error("Waybill number is required");
        return;
      }
      if (!grnData.formData.remark || grnData.formData.remark.trim() === '') {
        toast.error("Remark is required");
        return;
      }

      // ALWAYS use FormData - backend only accepts multipart/form-data
      const formData = new FormData();

      // Append core GRN fields
      formData.append('purchase_order', grnData.formData.purchase_order);
      formData.append('invoice_number', grnData.formData.invoice_number.trim());
      formData.append('waybill_number', grnData.formData.waybill_number.trim());
      formData.append('remark', grnData.formData.remark.trim());

      // ⭐ CRITICAL: Append destination_store field
      if (grnData.formData.destination_store) {
        formData.append('destination_store', grnData.formData.destination_store);
        console.log('✅ Destination store added:', grnData.formData.destination_store);
      } else {
        console.error('❌ WARNING: No destination_store in form data!');
        toast.error("Destination store is required. Please go back and select a store.");
        return;
      }

      // Append optional received_by field
      if (grnData.formData.received_by) {
        formData.append('received_by', grnData.formData.received_by);
      }

      // Send grn_items using bracket notation (same format as payment_items)
      console.log(`📤 Adding ${transformedItems.length} GRN items to FormData`);
      transformedItems.forEach((item, index) => {
        formData.append(`grn_items[${index}][purchase_order_item]`, String(item.purchase_order_item));
        formData.append(`grn_items[${index}][received_quantity]`, String(item.received_quantity));
        formData.append(`grn_items[${index}][remark]`, String(item.remark));

        console.log(`📤 Item ${index} appended:`, {
          purchase_order_item: item.purchase_order_item,
          received_quantity: item.received_quantity,
          remark: item.remark
        });
      });

      // Append files if they exist
      if (hasFiles && files) {
        console.log(`📤 Adding ${files.length} file(s) to FormData`);
        files.forEach((file, index) => {
          formData.append(`document`, file);
          console.log(`📤 File ${index + 1}: ${file.name} (${file.size} bytes)`);
        });
      } else {
        console.log(`📤 No files to upload`);
      }

      // Log FormData contents for debugging
      console.log("📤 FormData contents:");
      for (const [key, value] of Array.from(formData.entries())) {
        if (value instanceof File) {
          console.log(`  ${key}: [File: ${value.name}]`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      let res;
      if (grnData.isEdit) {
        res = await modifyGoodReceiveNote(formData as any);
      } else {
        res = await createGoodReceiveNote(formData as any);
      }

      if (res) {
        toast.success(`Good Receive Note ${grnData.isEdit ? 'updated' : 'created'} successfully`);
        localStorage.removeItem("grnFormData");
        router.push(AdminRoutes.GRN);
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Failed to save GRN";
      toast.error(errorMessage);
      console.error("GRN save error:", error);
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
