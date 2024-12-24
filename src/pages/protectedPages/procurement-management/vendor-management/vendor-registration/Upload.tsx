import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
import { Form } from "components/ui/form";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Separator } from "components/ui/separator";
import { Upload as UploadFile } from "lucide-react";
import { motion } from "framer-motion";
import VendorRegistationLayout from "./VendorRegistationLayout";
// import { vendorsActions } from "store/formData/procurement-vendors";
// import { RouteEnum } from "constants/RouterConstants";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import VendorsDocumentAPI from "services/procurementApi/vendors-document";
import { Progress } from "components/ui/progress";

const UploadSchema = z.object({
  files: z
    .array(
      z.object({
        file: z.instanceof(File).nullable().optional(), // Optional file
        description: z.string().optional(), // Optional description
        document_type: z.string().optional(), // Optional document_type
        title: z.string().optional(), // Optional title
      })
    )
    .length(8),
  references: z
    .array(
      z.object({
        file: z.instanceof(File).nullable().optional(), // Optional file
        description: z.string().optional(), // Optional description
        document_type: z.string().optional(), // Optional document_type
        title: z.string().optional(), // Optional title
      })
    )
    .length(5),
  supportingDocument: z
    .object({
      file: z.instanceof(File).nullable().optional(), // Optional file
      description: z.string().optional(), // Optional description
      document_type: z.string().optional(), // Optional document_type
      title: z.string().optional(), // Optional title
    })
    .optional(), // Entire object is optional
});

const Upload = () => {
  // const [formData, setFormData] = useState<FormData>({});

  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const { pathname } = useLocation();
  const [
    createVendorDocumentMutation,
    // { isLoading: createVendorDocumentMutationLoading },
  ] = VendorsDocumentAPI.useCreateVendorDocumentMutation();

  // eslint-disable-next-line no-unused-vars
  const [uploadedFiles, setUploadedFiles] = useState<(File | null)[]>(
    Array(10).fill(null)
  ); // Adjust initial size as needed

  // const form = useForm();
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

  const handleFileChange = (
    field: string,
    index: number,
    file: File | null,
    document_type?: string,
    title?: string
  ) => {
    const currentValues = form.getValues();

    //     {
    //   "file": "string",
    //   "title": "string",
    //   "document_type": "Tax Clearance Certificate",
    //   "description": "string",
    //   "vendor": "0389db27-b82e-4939-a6bf-21e751cacc66"
    // }

    // @ts-ignore
    if (Array.isArray(currentValues[field])) {
      // For arrays like "files" or "references"
      // @ts-ignore
      const updatedFiles = [...currentValues[field]];
      updatedFiles[index] = {
        ...updatedFiles[index],
        file,
        document_type,
        title: file?.name || "",
      };

      // @ts-ignore

      form.setValue(field, updatedFiles);
    } else {
      // For objects like "supportingDocument"

      // @ts-ignore
      form.setValue(field, {
        // @ts-ignore
        ...currentValues[field],
        file,
        document_type,
        title: file?.name || "",
      });
    }
  };

  const goBack = () => navigate(-1);

  // const onSubmit = async (data: any) => {
  //   console.log({ data });

  //   try {
  //     const res = await createVendorDocumentMutation(data).unwrap();
  //     console.log({ res });

  //     // localStorage.setItem("vendorID", res?.data?.id);
  //     toast.success("Successfully created.");
  //     let path = pathname;
  //     path = path.substring(0, path.lastIndexOf("/"));
  //     // path += "/attestation";
  //     console.log({ path });
  //   } catch (error) {
  //     toast.error("Something went wrong");
  //     console.log(error);
  //   }

  //   // sessionStorage.removeItem("completedSteps");
  //   // localStorage.removeItem("vendorID");
  //   // dispatch(vendorsActions.clearVendors());
  //   // navigate(RouteEnum.VENDOR_MANAGEMENT);
  // };

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

  const vendor = localStorage.getItem("vendorID") as string;

  console.log({ vendor });

  const onSubmit = async (data: any) => {
    // Prepare all files and add them to FormData
    const allFiles = [
      ...data.files.map((file, index) => ({ field: "files", index, file })),
      ...data.references.map((file, index) => ({
        field: "references",
        index,
        file,
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

      try {
        setLoader(field, index, true); // Set loader for the current file

        // Prepare FormData object
        const formData = new FormData();

        // Append file and additional data to FormData
        formData.append(`file`, file.file as Blob);
        formData.append(`document_type`, file.document_type || "");
        formData.append(`title`, file.title || "");
        formData.append(`description`, file.description || "");
        formData.append(`vendor`, vendor || "");

        // Send the request
        await createVendorDocumentMutation(formData).unwrap();
        toast.success(`Successfully uploaded file in ${field}[${index}]`);
      } catch (error) {
        console.error(`Error uploading file in ${field}[${index}]`, error);
        setError(field, index, true); // Mark the file as failed
        toast.error(`Failed to upload file in ${field}[${index}]`);
      } finally {
        setLoader(field, index, false); // Clear loader for the current file
      }
    }
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
      doc_type: "Not Sure",
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
      doc_type: "Not Sure",
      label:
        "Evidence of Registration with Professional Organizations, Regulatory Bodies, Manufacturers and/or Certificate of Authorized Dealership and Distributorship with Makes, Brands, Equipment, Machine and/or accessories as it relates to field of business endevour",
    },
    {
      doc_type: "Professional Membership",
      label:
        "Evidence of possession of experience in the line of business(s) you are applying for; prospecting Suppliers must provide at least 5 copies of completed Job Orders and Proof of Deliveries (Delivery Notes or Job Completion Notification in area(s) of business endevour",
    },
  ];

  const renderFileUploadRow = (
    field: string,
    label: string,
    index: number,
    placeholder?: string,
    title?: string,
    document_type?: string
  ) => {
    const isLoading = fileStatuses[field]?.[index] || false;
    const hasError = fileErrors[field]?.[index] || false;

    return (
      <div key={index} className='mb-4 w-full'>
        <h5 className='font-bold text-[12px] mb-2'>{label}</h5>
        <div className='flex items-center w-full gap-2 h-[50px]'>
          <div className='w-full max-w-[142px] h-[52px] rounded-[8px] border flex justify-center items-center text-gray-800'>
            {uploadedFiles[index] ? (
              <div className='overflow-hidden px-2'>
                <p className='whitespace-nowrap'>
                  {uploadedFiles[index]?.name}
                </p>
              </div>
            ) : (
              <>
                <input
                  // id={`fileInput-${index}`}
                  id={`fileInput-${field}-${index}`}
                  type='file'
                  onChange={(e) =>
                    handleFileChange(
                      field,
                      index,
                      e.target.files?.[0] || null,
                      document_type,
                      title
                    )
                  }
                  className='hidden'
                  name={`fileInput-${field}-${index}`}
                />
                <motion.label
                  htmlFor={`fileInput-${field}-${index}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className='cursor-pointer flex gap-4 text-sm px-4 py-2 rounded'
                >
                  <UploadFile size={20} />
                  Select File
                </motion.label>
              </>
            )}
          </div>
          <Input
            type='text'
            name={`${field}-${index}-description`}
            // {...register(`${field}.${index}.description`)}
            placeholder={placeholder || "Enter description (if any)"}
            className='h-[52px] rounded-[8px] bg-white relative top-[1px]'
            onChange={(e) => handleInputChange(field, index, e)}
          />
          {isLoading && <span className='loader'>Uploading...</span>}
          {hasError && <span className='error'>Failed</span>}
        </div>
        {isLoading && <Progress />}
      </div>
    );
  };

  return (
    <div className='space-y-6 min-h-screen'>
      <VendorRegistationLayout>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className='space-y-6 py-5'>
              <h4 className='text-lg font-semibold'>Uploads</h4>
              {documentFields.map(
                ({ label, doc_type }, index) =>
                  renderFileUploadRow(
                    "files",
                    label,
                    index,
                    "",
                    label,
                    doc_type
                  )
                // renderFileUploadRow(label, index)
              )}

              <Separator />

              {/* Reference Letters Section */}
              <h5 className='font-bold text-[12px] mb-2'>
                Where possible, provide reference Letters from at least 5
                reputable organizations, preferably NGOs attesting to active or
                past business relationship and level of performance (the letters
                or lists must have relevant addresses, contact persons,
                telephone numbers and emails); for due diligence confirmation
              </h5>
              {[...Array(5)].map((_, i) => {
                return (
                  <div className='flex items-center gap-2 w-full' key={i}>
                    {i + 1}.
                    {renderFileUploadRow(
                      "references",
                      ``,
                      i,

                      `Reference Letter ${i + 1}`,
                      "label",
                      "Reference Letter"
                    )}
                  </div>
                );
              })}

              <Separator />

              {/* Supporting Documents Section */}
              <h5 className='font-bold text-[12px] mb-2'>
                Any other relevant supporting document(s) that could aid your
                expression of interest.
              </h5>
              {renderFileUploadRow(
                "supportingDocument",
                "",
                0,

                "",
                "label",
                "label"
              )}
            </Card>

            {/* Navigation Buttons */}
            <div className='flex justify-between gap-5 mt-10'>
              <Button
                onClick={goBack}
                type='button'
                className='bg-[#FFF2F2] text-primary dark:text-gray-500'
              >
                Previous
              </Button>
              <Button type='submit' className='bg-primary text-white'>
                Finish
              </Button>
            </div>
          </form>
        </Form>
      </VendorRegistationLayout>
    </div>
  );
};

export default Upload;
