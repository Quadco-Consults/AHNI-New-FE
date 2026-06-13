"use client";

/* eslint-disable react/prop-types */

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
import FormSelect from "@/components/atoms/FormSelectField";
import { LoadingSpinner } from "@/components/Loading";
import { VendorsResultsData } from "definitions/procurement-types/vendors";
import FormInput from "@/components/atoms/FormInput";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { RFPSubmissionSchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import { useCreateSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { useGetSingleSolicitation } from "@/features/procurement/controllers/solicitationController";
import { useGetAllSolicitationEvaluationCriteria } from "@/features/modules/controllers";

import GoBack from "@/components/GoBack";
import { DollarSign } from 'lucide-react';import { Icon } from "@iconify/react";

const ManualBidSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [technicalFiles, setTechnicalFiles] = useState<FileList | null>(null);
  const [commercialFiles, setCommercialFiles] = useState<FileList | null>(null);

  const { data: vendors, isLoading: vendorsIsLoading } =
    VendorsAPI.useGetVendors({
      status: "Approved",
    });

  const { createSolicitationSubmission, isLoading: isCreateLoading } =
    useCreateSolicitationSubmission(true); // true indicates file upload

  const { data: singleSolicitation } = useGetSingleSolicitation(
    id as string
  );

  const { data: solicitationCriteria } =
    useGetAllSolicitationEvaluationCriteria({
      page: 1,
      size: 2000000,
    });

  const form = useForm<z.infer<typeof RFPSubmissionSchema>>({
    resolver: zodResolver(RFPSubmissionSchema),
    defaultValues: {
      solicitation: id,
      vendor: "",
      evaluations: [],
    },
  });

  const { control, handleSubmit, setValue, watch } = form;

  const { fields: responseField } = useFieldArray({
    control,
    name: "evaluations",
  });

  const evaluationData = useMemo(() => {
    return solicitationCriteria?.results?.map((data) => ({
      response: "",
      evaluation_criteria: data?.id,
    }));
  }, [solicitationCriteria]);

  useEffect(() => {
    if (evaluationData) {
      setValue("evaluations", evaluationData);
    }
  }, [evaluationData, setValue]);

  const onSubmit = async (data: z.infer<typeof RFPSubmissionSchema>) => {
    try {
      console.log("🚀 Submitting RFP proposal data:", data);

      // Validate that vendor is selected
      if (!data.vendor) {
        toast.error("Please select a vendor");
        return;
      }

      // Validate document uploads
      if (!technicalFiles || technicalFiles.length === 0) {
        toast.error("Please upload technical documents");
        return;
      }

      if (!commercialFiles || commercialFiles.length === 0) {
        toast.error("Please upload commercial documents");
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("solicitation", data.solicitation);
      formData.append("vendor", data.vendor);

      // Append technical documents
      Array.from(technicalFiles).forEach((file, index) => {
        formData.append(`technical_documents`, file);
      });

      // Append commercial documents
      Array.from(commercialFiles).forEach((file, index) => {
        formData.append(`commercial_documents`, file);
      });

      // Append evaluations if any
      if (data.evaluations && data.evaluations.length > 0) {
        formData.append("evaluations", JSON.stringify(data.evaluations));
      }

      console.log("📦 FormData prepared with files:", {
        technicalFilesCount: technicalFiles.length,
        commercialFilesCount: commercialFiles.length,
        vendor: data.vendor,
        solicitation: data.solicitation,
      });

      await createSolicitationSubmission(formData);

      toast.success("RFP proposal submitted successfully!");
      router.back();
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error("Failed to submit proposal. Please try again.");
    }
  };

  return (
    <div className='space-y-10'>
      <GoBack />
      <div>
        <h4 className='text-lg font-bold text-blue-600'>Service Proposal Submission Form</h4>
        <div className='space-y-2'>
          <h6 className='text-gray-700 font-medium'>{singleSolicitation?.data?.title}</h6>
          <div className='flex gap-4 text-sm text-gray-500'>
            <span><strong>RFP ID:</strong> {singleSolicitation?.data?.rfq_id}</span>
            <span><strong>Status:</strong> {singleSolicitation?.data?.status}</span>
            <span><strong>Type:</strong> Service Request</span>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
          <FormSelect name='vendor' label='Vendor' required>
            <SelectContent>
              {vendorsIsLoading && <LoadingSpinner />}
              {/* @ts-ignore */}
              {vendors?.data?.results?.map((vendor: VendorsResultsData) => (
                <SelectItem key={vendor?.id} value={String(vendor?.id)}>
                  {vendor?.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </FormSelect>

          {/* Technical Proposal Section */}
          <div className='space-y-6 border-t pt-6'>
            <div className='space-y-2'>
              <h4 className='text-lg font-bold text-blue-600 flex items-center gap-2'>
                <Icon icon='carbon:document-tasks' />
                Technical Proposal
              </h4>
              <p className='text-gray-600'>Please upload your technical proposal documents.</p>
            </div>

            <div className='space-y-4'>
              <div className='border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50/30'>
                <Icon icon='carbon:document-add' className='mx-auto text-4xl text-blue-400 mb-3' />
                <p className='text-gray-600 mb-2 font-medium'>Upload Technical Proposal Documents</p>
                <p className='text-sm text-gray-500 mb-3'>Accepted formats: PDF, DOC, DOCX (Max 10MB per file)</p>
                <input
                  type='file'
                  id='technical-documents'
                  className='hidden'
                  accept='.pdf,.doc,.docx'
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setTechnicalFiles(files);
                      toast.success(`${files.length} technical document(s) selected`);
                    }
                  }}
                />
                <label
                  htmlFor='technical-documents'
                  className='mt-3 px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block transition-colors'
                >
                  <Icon icon='carbon:upload' className='inline mr-2' />
                  Choose Files
                </label>
                {technicalFiles && technicalFiles.length > 0 && (
                  <div className='mt-4 space-y-2'>
                    <p className='text-sm font-medium text-blue-700'>
                      {technicalFiles.length} file(s) selected:
                    </p>
                    <div className='max-h-32 overflow-y-auto space-y-1'>
                      {Array.from(technicalFiles).map((file, index) => (
                        <div key={index} className='text-xs text-gray-600 bg-white px-3 py-1 rounded border border-blue-200'>
                          <Icon icon='carbon:document' className='inline mr-1' />
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Commercial Proposal Section */}
          <div className='space-y-6 border-t pt-6'>
            <div className='space-y-2'>
              <h4 className='text-lg font-bold text-green-600 flex items-center gap-2'>
                <Icon icon='carbon:currency-dollar' />
                Commercial Proposal
              </h4>
              <p className='text-gray-600'>Please upload your commercial proposal documents.</p>
            </div>

            <div className='space-y-4'>
              <div className='border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-green-50/30'>
                <Icon icon='carbon:document-add' className='mx-auto text-4xl text-green-400 mb-3' />
                <p className='text-gray-600 mb-2 font-medium'>Upload Commercial Proposal Documents</p>
                <p className='text-sm text-gray-500 mb-3'>Accepted formats: PDF, DOC, DOCX (Max 10MB per file)</p>
                <input
                  type='file'
                  id='commercial-documents'
                  className='hidden'
                  accept='.pdf,.doc,.docx'
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setCommercialFiles(files);
                      toast.success(`${files.length} commercial document(s) selected`);
                    }
                  }}
                />
                <label
                  htmlFor='commercial-documents'
                  className='mt-3 px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer inline-block transition-colors'
                >
                  <Icon icon='carbon:upload' className='inline mr-2' />
                  Choose Files
                </label>
                {commercialFiles && commercialFiles.length > 0 && (
                  <div className='mt-4 space-y-2'>
                    <p className='text-sm font-medium text-green-700'>
                      {commercialFiles.length} file(s) selected:
                    </p>
                    <div className='max-h-32 overflow-y-auto space-y-1'>
                      {Array.from(commercialFiles).map((file, index) => (
                        <div key={index} className='text-xs text-gray-600 bg-white px-3 py-1 rounded border border-green-200'>
                          <Icon icon='carbon:document' className='inline mr-1' />
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Evaluation Criteria Section */}
          {solicitationCriteria && solicitationCriteria.results && solicitationCriteria.results.length > 0 && (
            <div className='space-y-6 border-t pt-6'>
              <div className='space-y-2'>
                <h4 className='text-lg font-bold text-purple-600 flex items-center gap-2'>
                  <Icon icon='carbon:chart-evaluation' />
                  Evaluation Criteria Responses
                </h4>
                <p className='text-gray-600'>Please provide responses to the following evaluation criteria.</p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                {responseField.map((_, index) => {
                  return (
                    <div key={index} className='w-full'>
                      <FormInput
                        label={solicitationCriteria?.results?.[index]?.name}
                        name={`evaluations.[${index}].response`}
                        className='w-full'
                        placeholder='Enter your response'
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submission Summary */}
          <div className='border-t pt-6'>
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-6'>
              <h5 className='font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                <Icon icon='carbon:summary' />
                Submission Summary
              </h5>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-gray-600'>RFP ID:</span>
                  <div className='font-semibold text-gray-800'>{singleSolicitation?.data?.rfq_id || 'N/A'}</div>
                </div>
                <div>
                  <span className='text-gray-600'>Vendor:</span>
                  <div className='font-semibold text-gray-800'>
                    {watch('vendor')
                      ? vendors?.data?.results?.find((v: VendorsResultsData) => String(v.id) === watch('vendor'))?.company_name
                      : 'Not selected'}
                  </div>
                </div>
                <div>
                  <span className='text-gray-600'>Technical Documents:</span>
                  <div className='font-semibold text-blue-700'>
                    {technicalFiles ? `${technicalFiles.length} file(s)` : 'Not uploaded'}
                  </div>
                </div>
                <div>
                  <span className='text-gray-600'>Commercial Documents:</span>
                  <div className='font-semibold text-green-700'>
                    {commercialFiles ? `${commercialFiles.length} file(s)` : 'Not uploaded'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-3'>
            <button
              type='button'
              onClick={() => router.back()}
              className='px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
            >
              Cancel
            </button>
            <FormButton
              loading={isCreateLoading}
              disabled={isCreateLoading}
              type='submit'
              className='px-6 py-2.5'
            >
              <Icon icon='carbon:send' className='inline mr-2' />
              Submit RFP Proposal
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ManualBidSubmission;
