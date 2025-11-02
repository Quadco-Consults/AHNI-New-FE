"use client";

/* eslint-disable react/prop-types */

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation"; 
import { SelectContent, SelectItem } from "components/ui/select";
import { Form } from "components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
import FormSelect from "components/atoms/FormSelectField";
import { LoadingSpinner } from "components/Loading";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import FormInput from "components/atoms/FormInput";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { SolicitationSubmissionSchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import { useCreateSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { useGetSingleSolicitation } from "@/features/procurement/controllers/solicitationController";
import { useGetAllSolicitationEvaluationCriteria } from "@/features/modules/controllers";

import GoBack from "components/GoBack";
import { Icon } from "@iconify/react";

const ManualBidSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: vendors, isLoading: vendorsIsLoading } =
    VendorsAPI.useGetVendors({
      status: "Approved",
    });

  const { createSolicitationSubmission, isLoading: isCreateLoading } =
    useCreateSolicitationSubmission();

  const { data: singleSolicitation } = useGetSingleSolicitation(
    id as string
  );

  const { data: solicitationCriteria } =
    useGetAllSolicitationEvaluationCriteria({
      page: 1,
      size: 2000000,
    });

  //   const [
  //     createSolicitationBidMutation,
  //     { isLoading: solicitationBidIsLoading },
  //   ] = SolicitationAPI.useCreateSolicitationBid();

  // @ts-ignore - RFP schema needs to be updated
  const form = useForm({
    // resolver: zodResolver(SolicitationSubmissionSchema), // Disabled until RFP schema is created
    defaultValues: {
      solicitation: id,
      vendor: "",
      // Technical Proposal fields
      company_profile: "",
      project_approach: "",
      team_qualifications: "",
      technical_experience: "",
      // Commercial Proposal fields
      total_project_cost: "",
      payment_terms: "",
      project_duration: "",
      warranty_period: "",
      cost_breakdown: "",
      // Evaluation responses
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

  const onSubmit = async (
    data: any // Using any until RFP schema is created
  ) => {
    try {
      console.log("🚀 Submitting RFP proposal data:", data);

      // Validate that vendor is selected
      if (!data.vendor) {
        toast.error("Please select a vendor");
        return;
      }

      // Validate technical proposal fields
      const technicalFields = ['company_profile', 'project_approach', 'team_qualifications', 'technical_experience'];
      for (const field of technicalFields) {
        // @ts-ignore
        if (!data[field] || data[field].trim() === '') {
          toast.error(`Please fill in the ${field.replace('_', ' ')} field`);
          return;
        }
      }

      // Validate commercial proposal fields
      const commercialFields = ['total_project_cost', 'payment_terms', 'project_duration', 'warranty_period'];
      for (const field of commercialFields) {
        // @ts-ignore
        if (!data[field] || data[field].toString().trim() === '') {
          toast.error(`Please fill in the ${field.replace('_', ' ')} field`);
          return;
        }
      }

      await createSolicitationSubmission(data);

      toast.success("Service proposal submitted successfully!");
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
              <p className='text-gray-600'>Please provide your technical approach and qualifications for this service.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormInput
                name='company_profile'
                label='Company Profile & Experience'
                placeholder='Describe your company background and relevant experience'
                required
              />
              <FormInput
                name='project_approach'
                label='Project Approach & Methodology'
                placeholder='Outline your approach to delivering this service'
                required
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormInput
                name='team_qualifications'
                label='Team Qualifications'
                placeholder='Describe key team members and their qualifications'
                required
              />
              <FormInput
                name='technical_experience'
                label='Relevant Technical Experience'
                placeholder='Highlight relevant past projects and expertise'
                required
              />
            </div>

            <div className='space-y-4'>
              <h5 className='font-semibold text-gray-800'>Technical Documents Upload</h5>
              <div className='border-2 border-dashed border-blue-300 rounded-lg p-8 text-center'>
                <Icon icon='carbon:document-add' className='mx-auto text-4xl text-blue-400 mb-3' />
                <p className='text-gray-600 mb-2'>Upload technical proposal documents</p>
                <p className='text-sm text-gray-500'>Accepted formats: PDF, DOC, DOCX (Max 10MB)</p>
                <button type='button' className='mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100'>
                  Choose Files
                </button>
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
              <p className='text-gray-600'>Please provide your commercial terms and pricing for this service.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormInput
                name='total_project_cost'
                label='Total Project Cost (₦)'
                type='number'
                placeholder='0.00'
                required
              />
              <FormInput
                name='payment_terms'
                label='Payment Terms'
                placeholder='e.g., 30% upfront, 70% on completion'
                required
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormInput
                name='project_duration'
                label='Project Duration'
                placeholder='e.g., 6 months, 12 weeks'
                required
              />
              <FormInput
                name='warranty_period'
                label='Warranty/Support Period'
                placeholder='e.g., 12 months support'
                required
              />
            </div>

            <FormInput
              name='cost_breakdown'
              label='Cost Breakdown (Optional)'
              placeholder='Provide detailed breakdown of costs if required'
            />

            <div className='space-y-4'>
              <h5 className='font-semibold text-gray-800'>Commercial Documents Upload</h5>
              <div className='border-2 border-dashed border-green-300 rounded-lg p-8 text-center'>
                <Icon icon='carbon:document-add' className='mx-auto text-4xl text-green-400 mb-3' />
                <p className='text-gray-600 mb-2'>Upload commercial proposal documents</p>
                <p className='text-sm text-gray-500'>Accepted formats: PDF, DOC, DOCX (Max 10MB)</p>
                <button type='button' className='mt-3 px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100'>
                  Choose Files
                </button>
              </div>
            </div>

            <div className='bg-green-50 border border-green-200 rounded-lg p-6'>
              <h5 className='font-semibold text-green-800 mb-3'>Commercial Summary</h5>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-gray-600'>Total Project Cost:</span>
                  <div className='font-semibold text-green-700 text-lg'>₦{(watch as any)('total_project_cost') ? Number((watch as any)('total_project_cost')).toLocaleString() : '0.00'}</div>
                </div>
                <div>
                  <span className='text-gray-600'>Duration:</span>
                  <div className='font-semibold text-green-700'>{(watch as any)('project_duration') || 'TBD'}</div>
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-5'>
            {responseField.map((_, index) => {
              return (
                <tr key={index} className='w-full'>
                  <FormInput
                    label={solicitationCriteria?.results?.[index]?.name}
                    name={`evaluations.[${index}].response`}
                    className='w-full'
                  />
                </tr>
              );
            })}
          </div>

          <div className='flex justify-end'>
            <FormButton
              loading={isCreateLoading}
              disabled={isCreateLoading}
              type='submit'
            >
              Submit
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ManualBidSubmission;
