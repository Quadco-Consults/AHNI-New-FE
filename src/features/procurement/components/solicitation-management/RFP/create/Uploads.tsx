"use client";

import RfqLayout from "./RfpLayout";
import { Button } from "components/ui/button";

import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormButton from "@/components/FormButton";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Upload as UploadFile } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "components/ui/badge";
import { Input } from "components/ui/input";
import { RouteEnum } from "constants/RouterConstants";

const Items = () => {
  const router = useRouter();
  // const formData = JSON.parse(localStorage.getItem("rfqQuotation") as any);

  const form = useForm({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      files: Array(8).fill({
        file: null,
        description: "",
        document_type: "",
        title: "",
      }),
      references: Array(5).fill({
        file: null,
        description: "",
        document_type: "",
        title: "",
      }),
      supportingDocument: {
        file: null,
        description: "",
        document_type: "",
        title: "",
      },
    },
  });

  const handleInputChange = (
    field: string,
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    const currentValues = form.getValues();

    // @ts-ignore
    if (Array.isArray(currentValues[field])) {
      // For arrays like "files" or "references"
      // @ts-ignore
      const updatedFiles = [...currentValues[field]];

      updatedFiles[index] = { ...updatedFiles[index], description: value };

      // @ts-ignore
      form.setValue(field, updatedFiles);
    } else {
      // For objects like "supportingDocument"

      // @ts-ignore
      form.setValue(field, { ...currentValues[field], description: value });
    }
  };
  const { handleSubmit } = form;

  const currentValues = form.getValues();

  const handleFileChange = (
    field: string,
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    document_type?: string
    // eslint-disable-next-line no-unused-vars
  ) => {
    const fileArray = Array.from(e?.target.files || []);
    const file = e?.target.files?.[0]!;

    // @ts-ignore
    if (Array.isArray(currentValues[field])) {
      // For arrays like "files" or "references"
      // @ts-ignore
      const updatedFiles = [...currentValues[field]];
      updatedFiles[index] = {
        ...updatedFiles[index],
        file: fileArray,
        document_type,
        title: file?.name || "",
      };

      // @ts-ignore
      form.setValue(field, updatedFiles);
      // Update uploadedFiles state for UI display
    } else {
      // For objects like "supportingDocument"

      // @ts-ignore
      form.setValue(field, {
        // @ts-ignore
        ...currentValues[field],
        file: fileArray,
        document_type,
        title: file?.name || "",
      });
    }
  };

  const goBack = () => router.back();

  const [fileStatuses, setFileStatuses] = useState<
    Record<string, Record<number, boolean>>
  >({});
  const [fileErrors, setFileErrors] = useState<
    Record<string, Record<number, boolean>>
  >({});

  const setLoader = (field: string, index: number, status: boolean) => {
    setFileStatuses((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [index]: status,
      },
    }));
  };

  const setError = (field: string, index: number, status: boolean) => {
    setFileErrors((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [index]: status,
      },
    }));
  };

  const onSubmit = async (data: {
    files: any[];
    references: any[];
    supportingDocument: { file: any };
  }) => {
    // Prepare all files and add them to FormData
    const allFiles = [
      ...data.files.map((file, index) => ({ field: "files", index, file })),
      ...data.references.map((file, index) => ({
        field: "references",
        index,
        file: file,
      })),
      ...(data.supportingDocument?.file
        ? [
            {
              field: "supportingDocument",
              index: 0,
              file: data.supportingDocument,
            },
          ]
        : []),
    ];

    // For each file, append it to FormData and handle loading/error states
    for (let { field, index, file } of allFiles) {
      if (!file.file) continue; // Skip if no file uploaded

      const clonedFile = file?.file;

      try {
        setLoader(field, index, true); // Set loader for the current file

        // Prepare FormData object
        const formData = new FormData();

        // Append all files
        clonedFile.forEach((file: string | Blob) => {
          formData.append("files", file); // The key "files" must match what the backend expects
        });

        // const newArray = ["hello"];
        // Append file and additional data to FormData
        // @ts-ignore
        // formData.append(`files`, file?.file);
        // formData.append(`files`, clonedFile);
        formData.append(`document_type`, file?.document_type || "");
        formData.append(`title`, file?.title || "");
        formData.append(`description`, file.description || "");
        // formData.append(`vendor`, vendor || "");

        // Send the request
        // await createVendorDocumentMutation(formData) ;
        toast.success(`Successfully uploaded file`);
        setError(field, index, false); // Mark the file as failed
      } catch (error) {
        console.error(`Error uploading file`, error);
        setError(field, index, true); // Mark the file as failed
        toast.error(`Failed to upload file`);
      } finally {
        setLoader(field, index, false); // Clear loader for the current file
      }
    }
    // let path = pathname;

    // path = path.substring(0, path.lastIndexOf("/"));

    // path += "/prequalification";
    // router.push(path);

    router.push(RouteEnum.RFP);
  };

  const documentFields = [
    {
      doc_type: "Cover Page",
      label:
        "Cover Page (indicating category(s) of interest and related LOT Number(s))",
    },
    {
      doc_type: "Company Profile",
      label:
        "Company Profile; registered address(s), official/functional emails, telephone numbers and point of contact for the company",
    },
    {
      doc_type: "CAC Registration Certificate",
      label:
        "Evidence of legal registration document of the company (CAC, FORM CO7 and FORM CO2)",
    },
    {
      doc_type: "Tax Clearance Certificate",
      label: "Latest Tax Clearance Certificate",
    },
    {
      doc_type: "Audited Financial Account",
      label: "Evidence of Financial Capability (Latest Audited Accounts)",
    },
    {
      doc_type: "Reference Letter",
      label:
        "Bank Reference Letter duly addressed to AHNi Procurement Committee",
    },
    {
      doc_type: "Professional Membership",
      label:
        "Evidence of Registration with Professional Organizations, Regulatory Bodies, Manufacturers and/or Certificate of Authorized Dealership and Distributorship with Makes, Brands, Equipment, Machine and/or accessories as it relates to field of business endevour",
    },
    {
      doc_type: "Authorized Dealership",
      label:
        "Evidence of possession of experience in the line of business(s) you are applying for; prospecting Suppliers must provide at least 5 copies of completed Job Orders and Proof of Deliveries (Delivery Notes or Job Completion Notification in area(s) of business endevour",
      multiple: true,
    },
    {
      doc_type: "Financial Proposal",
      label: "Financial Bid",
    },
  ];

  const renderFileUploadRow = (
    // fileName: any,
    field: string,
    label: string,
    index: number,
    placeholder?: string,
    title?: string,
    document_type?: string,
    multiple?: boolean
  ) => {
    const isLoading = fileStatuses[field]?.[index] || false;
    const hasError = fileErrors[field]?.[index] || false;
    // const currentValues = formx.getValues();

    // const fileName = currentValues[field]?.[index] || ""; // Get the file name for display

    // @ts-ignore
    const files = form.watch(field);

    // @ts-ignore
    const fileName = files?.[index]?.title || files?.title || "";
    const fileNamex =
      files?.[index]?.file?.map(
        (
          file: {
            name:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
          },
          i: React.Key | null | undefined
        ) => {
          return (
            <Badge key={i} className="py-2 rounded-lg bg-[#EBE8E1] text-black">
              {file.name}
            </Badge>
          );
        }
      ) ||
      // @ts-ignore
      files?.title ||
      "";

    return (
      <div key={index} className="mb-4 w-full">
        <h5 className="font-bold text-[12px] mb-2">{label}</h5>
        <div className="flex items-center w-full gap-2 h-[50px]">
          <div className="w-full max-w-[142px] h-[52px] rounded-[8px] border flex justify-center items-center text-gray-800">
            <>
              <input
                // id={`fileInput-${index}`}
                id={`fileInput-${field}-${index}`}
                type="file"
                multiple={multiple}
                onChange={(e) =>
                  handleFileChange(field, index, e || null, document_type)
                }
                className="hidden"
                name={`fileInput-${field}-${index}`}
              />
              <motion.label
                htmlFor={`fileInput-${field}-${index}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer flex gap-4 text-sm px-1 py-2 rounded"
              >
                {fileName ? (
                  <div className="overflow-hidden max-w-[120px]  w-full">
                    <span className=" ml-2 text-sm text-gray-500 whitespace-nowrap">
                      {fileName}
                    </span>
                  </div>
                ) : (
                  <div className="px-3 flex gap-4 w-full ">
                    <UploadFile size={20} />
                    Select File
                  </div>
                )}
              </motion.label>
            </>
          </div>

          <Input
            type="text"
            name={`${field}-${index}-description`}
            // {...register(`${field}.${index}.description`)}
            placeholder={placeholder || "Enter description (if any)"}
            className="h-[52px] rounded-[8px] bg-white relative top-[1px]"
            onChange={(e) => handleInputChange(field, index, e)}
          />

          {isLoading && <span className="loader">Uploading...</span>}
          {hasError && !isLoading && <span className="error">Failed</span>}
        </div>
        {fileNamex && multiple && (
          <div className="  w-full">
            {/* <span className=' ml-2 text-sm text-gray-500 whitespace-nowrap'> */}
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {fileNamex}
            </div>
            {/* </span> */}
          </div>
        )}
      </div>
    );
  };

  return (
    <RfqLayout>
      <Form {...form}>
        <form className="space-y-8 p-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <h6 className="text-yellow-600">Uploads</h6>

            {documentFields.map(({ label, doc_type, multiple }, index) => {
              return renderFileUploadRow(
                // fileName,
                "files",
                label,
                index,
                "",
                label,
                doc_type,
                multiple
              );
            })}
          </div>

          <div className="flex justify-between mt-16">
            <Button
              onClick={goBack}
              type="button"
              className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            >
              Cancel
            </Button>
            {/* <Link href={{ pathname: RouteEnum.RFQ_CREATE_CBA }}> */}
            <FormButton
              // loading={isCreateLoading}
              // disabled={isCreateLoading}
              type="submit"
            >
              Save Changes
            </FormButton>
            {/* </Link> */}
          </div>
        </form>
      </Form>
    </RfqLayout>
  );
};

export default Items;

const UploadSchema = z.object({
  files: z
    .array(
      z.object({
        file: z.array(z.instanceof(File)).nullable().optional(), // Optional array of File objects
        description: z.string().optional(), // Optional description
        document_type: z.string().optional(), // Optional document_type
        title: z.string().optional(), // Optional title
      })
    )
    .length(8),
  references: z
    .array(
      z.object({
        file: z.array(z.instanceof(File)).nullable().optional(), // Optional array of File objects
        description: z.string().optional(), // Optional description
        document_type: z.string().optional(), // Optional document_type
        title: z.string().optional(), // Optional title
      })
    )
    .length(5),
  supportingDocument: z
    .object({
      file: z.array(z.instanceof(File)).nullable().optional(), // Optional array of File objects
      description: z.string().optional(), // Optional description
      document_type: z.string().optional(), // Optional document_type
      title: z.string().optional(), // Optional title
    })
    .optional(), // Entire object is optional
});
