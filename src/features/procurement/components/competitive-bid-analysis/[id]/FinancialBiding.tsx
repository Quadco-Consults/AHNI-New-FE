"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import logoPng from "@/assets/svgs/logo-bg.svg";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";

import { ChevronRight } from "lucide-react";
import TenderChecklist from "./TenderCheckList";
import { useForm } from "react-hook-form";
import { RouteEnum } from "constants/RouterConstants";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import ManualBidCbaPrequalificationAPI from "@/features/procurement/controllers/manualBidCbaPrequalificationController";
import { toast } from "sonner";
import GoBack from "components/GoBack";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import { useGetSingleSolicitation } from "@/features/procurement/controllers/solicitationController";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { getCurrentUser } from "@/utils/auth";

const criteriaData = [
  {
    stage: 1,
    criteria:
      "FINANCIAL BID OPENING TO ASSESS CONFORMITY TO FINANCIAL QUOTATION LISTED 8",
    description_1:
      "If Tender submission CONFORMS to Financial Quotation (8) by providing for the following: i)   Quotation, ii)  Comprehensive Specification of Product of Interest including Brands, iii) Clear Delivery Leadtime,  iv) Clear Validity of Quotation, v)  Clear Post Delivery Warranty, vi) All relevant Installation Accessories, vii) Delivery Workplan (Schedule of Installation)",
    description_2: "If such is not clearly provided (Tick FAIL)",
  },
];
const FinancialBid = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // Get parameters from URL search params and route params
  const vendorSubmissionId = params?.id as string || searchParams?.get('vendor_submission_id');
  const solicitation = searchParams?.get('solicitation');
  const vendorName = searchParams?.get('vendor_name');
  const stage = searchParams?.get('stage') || 'FINANCIAL';
  const fromTechnical = searchParams?.get('from') === 'technical';

  console.log("🔍 Financial Evaluation Debug:", {
    vendorSubmissionId,
    solicitation,
    vendorName,
    stage,
    fromTechnical
  });

  const form = useForm({
    defaultValues: {
      vendor_submission_id: vendorSubmissionId,
      solicitation_id: solicitation,
      stage: "FINANCIAL",
      criteriaDataStatus: [],
    },
  });
  const { handleSubmit, control, getValues, setValue } = form;

  // Get current user conducting the evaluation
  const currentUser = getCurrentUser();

  // Load existing evaluation data
  const [technicalEvaluation, setTechnicalEvaluation] = useState<any>(null);
  const [existingFinancialEvaluation, setExistingFinancialEvaluation] = useState<any>(null);

  useEffect(() => {
    const existingEvaluations = JSON.parse(localStorage.getItem('vendor_evaluations') || '[]');

    const techEvaluation = existingEvaluations.find((evaluation: any) =>
      evaluation.vendor_submission_id === vendorSubmissionId &&
      evaluation.solicitation_id === solicitation &&
      evaluation.stage === "TECHNICAL"
    );

    const financialEvaluation = existingEvaluations.find((evaluation: any) =>
      evaluation.vendor_submission_id === vendorSubmissionId &&
      evaluation.solicitation_id === solicitation &&
      evaluation.stage === "FINANCIAL"
    );

    if (techEvaluation) {
      setTechnicalEvaluation(techEvaluation);
      console.log("📋 Found existing technical evaluation:", techEvaluation);
    }

    if (financialEvaluation) {
      setExistingFinancialEvaluation(financialEvaluation);
      console.log("📋 Found existing financial evaluation:", financialEvaluation);

      // Pre-populate form with existing financial evaluation data
      if (financialEvaluation.criteria_results) {
        const criteriaStatus = financialEvaluation.criteria_results.map((result: any) => ({
          criteria: result.criteria,
          status: result.passed ? "PASS" : "FAIL"
        }));
        form.setValue("criteriaDataStatus", criteriaStatus);
      }
    }
  }, [vendorSubmissionId, solicitation, form]);

  // Get solicitation data for committee members
  const { data: solicitationData } = useGetSingleSolicitation(solicitation as string, !!solicitation);

  // Get vendor submission data for vendor details
  const { data: submissionData } = useGetSolicitationSubmission(solicitation as string, !!solicitation);

  // Find the specific vendor submission
  const vendorSubmissions = (submissionData as any)?.data?.data?.results ||
                           (submissionData as any)?.data?.results ||
                           (submissionData as any)?.results || [];

  const vendorSubmission = vendorSubmissions.find((submission: any) => submission.id === vendorSubmissionId);
  const vendorData = vendorSubmission?.vendor;

  const { createManualBidCbaPrequalification } =
    ManualBidCbaPrequalificationAPI.useCreateManualBidCbaPrequalification();

  const formValues = getValues();
  console.log("📊 Financial Form Values:", formValues);
  const onSubmit = async (data: any) => {
    console.log("💰 Financial Evaluation Submitted:", data);

    try {
      let failedCount = 0;
      const evaluationResults = [];

      for (let criteria of data.criteriaDataStatus) {
        const passed = criteria.status === "PASS";

        evaluationResults.push({
          criteria: criteria.criteria,
          passed: passed,
          stage: "FINANCIAL"
        });

        if (!passed) {
          failedCount++;
        }
      }

      // Create comprehensive financial evaluation record
      const financialEvaluationRecord = {
        vendor_submission_id: vendorSubmissionId,
        solicitation_id: solicitation,
        vendor_name: vendorData?.company_name || vendorSubmission?.vendor?.company_name || vendorName,
        vendor_data: technicalEvaluation?.vendor_data || {
          company_name: vendorData?.company_name || vendorSubmission?.vendor?.company_name || vendorName,
          company_registration_number: vendorData?.company_registration_number || vendorSubmission?.vendor?.company_registration_number,
          type_of_business: vendorData?.type_of_business || vendorSubmission?.vendor?.type_of_business,
          email: vendorData?.email || vendorSubmission?.vendor?.email,
        },
        evaluation_date: new Date().toISOString(),
        evaluator: {
          name: currentUser ? `${currentUser.first_name} ${currentUser.last_name}`.trim() : "Procurement Officer",
          id: currentUser?.id || null,
          role: currentUser?.role || "Procurement Officer"
        },
        stage: "FINANCIAL",
        criteria_results: evaluationResults,
        overall_status: failedCount === 0 ? "PASSED" : "FAILED",
        total_criteria: data.criteriaDataStatus.length,
        passed_criteria: data.criteriaDataStatus.length - failedCount,
        failed_criteria: failedCount,
        evaluation_status: "FINANCIAL_COMPLETED",
        is_complete: true,
        // Include technical evaluation reference
        technical_evaluation_ref: technicalEvaluation?.evaluation_date || null,
        technical_evaluator: technicalEvaluation?.evaluator || null
      };

      // Calculate overall evaluation status (both technical and financial)
      const technicalPassed = technicalEvaluation?.overall_status === "PASSED";
      const financialPassed = failedCount === 0;
      const completeEvaluationStatus = technicalPassed && financialPassed ? "FULLY_QUALIFIED" : "NOT_QUALIFIED";

      // Store financial evaluation and update technical evaluation status
      const existingEvaluations = JSON.parse(localStorage.getItem('vendor_evaluations') || '[]');

      // Remove any existing financial evaluation for this vendor/solicitation
      let updatedEvaluations = existingEvaluations.filter((evaluation: any) =>
        !(evaluation.vendor_submission_id === vendorSubmissionId && evaluation.solicitation_id === solicitation && evaluation.stage === "FINANCIAL")
      );

      // Add the new financial evaluation
      updatedEvaluations.push(financialEvaluationRecord);

      // Update technical evaluation to reflect that financial is now complete
      updatedEvaluations = updatedEvaluations.map((evaluation: any) => {
        if (evaluation.vendor_submission_id === vendorSubmissionId &&
            evaluation.solicitation_id === solicitation &&
            evaluation.stage === "TECHNICAL") {
          return {
            ...evaluation,
            financial_completed: true,
            financial_completion_date: new Date().toISOString(),
            overall_evaluation_status: completeEvaluationStatus
          };
        }
        return evaluation;
      });

      // Create a comprehensive evaluation summary
      const evaluationSummary = {
        vendor_submission_id: vendorSubmissionId,
        solicitation_id: solicitation,
        vendor_data: financialEvaluationRecord.vendor_data,
        evaluation_summary: {
          technical: {
            status: technicalEvaluation?.overall_status || "PENDING",
            evaluator: technicalEvaluation?.evaluator || null,
            completed_date: technicalEvaluation?.evaluation_date || null,
            criteria_passed: technicalEvaluation?.passed_criteria || 0,
            criteria_failed: technicalEvaluation?.failed_criteria || 0
          },
          financial: {
            status: financialEvaluationRecord.overall_status,
            evaluator: financialEvaluationRecord.evaluator,
            completed_date: financialEvaluationRecord.evaluation_date,
            criteria_passed: financialEvaluationRecord.passed_criteria,
            criteria_failed: financialEvaluationRecord.failed_criteria
          },
          overall_status: completeEvaluationStatus,
          completion_date: new Date().toISOString()
        },
        stage: "COMPLETED",
        is_complete: true
      };

      // Add summary to evaluations
      updatedEvaluations.push(evaluationSummary);
      localStorage.setItem('vendor_evaluations', JSON.stringify(updatedEvaluations));

      console.log("💾 Financial Evaluation Saved:", financialEvaluationRecord);
      console.log("📊 Evaluation Summary Created:", evaluationSummary);

      // Enhanced success/warning messages with status
      if (completeEvaluationStatus === "FULLY_QUALIFIED") {
        toast.success("✅ Evaluation COMPLETED! Vendor is FULLY QUALIFIED (Technical + Financial)");
      } else if (financialPassed && !technicalPassed) {
        toast.warning("⚠️ Financial evaluation passed, but vendor failed technical evaluation. Overall: NOT QUALIFIED");
      } else if (!financialPassed && technicalPassed) {
        toast.warning(`⚠️ Financial evaluation failed with ${failedCount} criteria. Overall: NOT QUALIFIED`);
      } else {
        toast.error("❌ Vendor failed both technical and financial evaluations. Overall: NOT QUALIFIED");
      }

      // Navigate back to RFQ with comprehensive evaluation status
      router.push(`/dashboard/procurement/solicitation-management/rfq/${solicitation}?tab=vendor-submission&evaluation=complete&status=${completeEvaluationStatus}&vendor=${vendorSubmissionId}`);

    } catch (error) {
      console.error("❌ Error submitting financial evaluation:", error);
      toast.error("Failed to save financial evaluation. Please try again.");
    }
  };

  return (
    <>
      <GoBack />
      <form onSubmit={handleSubmit(onSubmit)} className='mx-auto p-5'>
        <div className='bg-white p-8 h-full flex flex-col gap-8'>
          <div className=''>
            <div className='flex justify-center items-center flex-col'>
              <img src={logoPng} alt='logo' width={200} />
            </div>
            <div className='p-4 w-full h-[70px] flex justify-between items-center text-lg'>
              <h3 className='w-[200px] whitespace-nowrap text-primary'>
                VENDOR EVALUATION
              </h3>
              <div className='flex w-full items-center justify-start'>
                <p className='font-semibold'>
                  FINANCIAL EVALUATION & QUOTATION ASSESSMENT
                </p>
              </div>
            </div>

            {/* Vendor Information Section */}
            <div className='bg-blue-50 p-4 rounded-lg mb-4'>
              <h4 className='font-semibold text-blue-800 mb-2'>Vendor Being Evaluated:</h4>
              {vendorSubmission ? (
                <div className='text-sm text-blue-700'>
                  <p><strong>Company:</strong> {vendorData?.company_name || vendorSubmission?.vendor?.company_name || vendorName || 'Unknown'}</p>
                  <p><strong>Registration:</strong> {vendorData?.company_registration_number || vendorSubmission?.vendor?.company_registration_number || 'N/A'}</p>
                  <p><strong>Business Type:</strong> {vendorData?.type_of_business || vendorSubmission?.vendor?.type_of_business || 'N/A'}</p>
                </div>
              ) : (
                <p className='text-blue-700'>Loading vendor information...</p>
              )}
            </div>

            {/* Technical Evaluation Status */}
            {technicalEvaluation && (
              <div className='bg-green-50 p-4 rounded-lg mb-4'>
                <h4 className='font-semibold text-green-800 mb-2'>Technical Evaluation Completed</h4>
                <div className='text-sm text-green-700 space-y-1'>
                  <p><strong>Status:</strong> {technicalEvaluation.overall_status}</p>
                  <p><strong>Evaluator:</strong> {technicalEvaluation.evaluator?.name || technicalEvaluation.evaluator}</p>
                  <p><strong>Date:</strong> {new Date(technicalEvaluation.evaluation_date).toLocaleDateString()}</p>
                  <p><strong>Criteria Results:</strong> {technicalEvaluation.passed_criteria}/{technicalEvaluation.total_criteria} passed</p>
                </div>
                <p className='text-green-800 text-sm mt-2'>
                  ✅ <strong>Proceeding to Financial Assessment</strong>
                </p>
              </div>
            )}

            {fromTechnical && !technicalEvaluation && (
              <div className='bg-green-50 p-4 rounded-lg mb-4'>
                <p className='text-green-800 text-sm'>
                  ✅ <strong>Technical Evaluation Completed</strong> - Proceeding to Financial Assessment
                </p>
              </div>
            )}

            {/* Existing Financial Evaluation Indicator */}
            {existingFinancialEvaluation && (
              <div className='bg-yellow-50 p-4 rounded-lg mb-4'>
                <h4 className='font-semibold text-yellow-800 mb-2'>Resuming Financial Evaluation</h4>
                <div className='text-sm text-yellow-700 space-y-1'>
                  <p><strong>Previous Evaluator:</strong> {existingFinancialEvaluation.evaluator?.name || existingFinancialEvaluation.evaluator}</p>
                  <p><strong>Last Modified:</strong> {new Date(existingFinancialEvaluation.evaluation_date).toLocaleDateString()}</p>
                  <p><strong>Previous Status:</strong> {existingFinancialEvaluation.overall_status}</p>
                </div>
                <p className='text-yellow-800 text-sm mt-2'>
                  📝 <strong>Form has been pre-filled with previous evaluation data</strong>
                </p>
              </div>
            )}

            <TenderChecklist
              control={control}
              criteriaData={criteriaData}
              setValue={setValue}
              getValues={getValues}
            />
          </div>

          <div className='  px-8 my-8'>
            {/* <p className='mb-4'> STAGE 3 ASSESSMENT:</p>
          <div className='flex gap-5  w-full justify-between'>
            <Controller
              name={"stage_1_and_2"}
              control={control}
              defaultValue=''
              render={({ field }) => (
                <>
                  <div className=''>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='radio'
                        {...field}
                        value='PASS'
                        checked={field.value === "PASS"}
                        className='accent-purple-500'
                      />
                      <label>PASS</label>
                    </div>
                    (Met all the listed technical prequalification criteria)
                  </div>
                  <div>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='radio'
                        {...field}
                        value='FAIL'
                        checked={field.value === "FAIL"}
                        className='accent-purple-500'
                      />
                      <label>FAIL</label>
                    </div>
                    (Did not meet some or all the listed technical
                    prequalification criteria)
                  </div>
                </>
              )}
            />
          </div> */}
          </div>
          <div className=' flex-col justify-center  items-center w-full p-2'>
            <h3 className='underline font-semibold'>
              Review Conducted, Scores Awarded as agreed by the Procurement
              Committee Members:
            </h3>
            <DataTable
              columns={columns}
              data={getCommitteeMembers(solicitationData, currentUser)}
            />
          </div>
          <div className='w-full'>
            <Button
              type='submit'
              className='w-full bg-alternate text-primary my-4 mt-10'
            >
              <ChevronRight size={20} />
              Complete Financial Evaluation
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

// Helper function to get committee members from solicitation or CBA data
const getCommitteeMembers = (solicitationData: any, cbaData: any) => {
  // Try to get committee members from CBA first, then solicitation, or use default
  const cbaMembers = cbaData?.committee_members || [];
  const solicitationMembers = solicitationData?.data?.committee_members || [];

  // If we have actual committee members, use them
  if (cbaMembers.length > 0) {
    return cbaMembers.map((member: any) => ({
      name: `${member.first_name} ${member.last_name}`,
      designation: member.designation,
      signature: "____________________",
      date: "____________________"
    }));
  }

  if (solicitationMembers.length > 0) {
    return solicitationMembers.map((member: any) => ({
      name: `${member.first_name} ${member.last_name}`,
      designation: member.designation,
      signature: "____________________",
      date: "____________________"
    }));
  }

  // Default committee structure for vendor prequalification
  return [
    {
      name: "Committee Chairperson",
      designation: "Head of Procurement",
      signature: "____________________",
      date: "____________________"
    },
    {
      name: "Technical Evaluator",
      designation: "Technical Specialist",
      signature: "____________________",
      date: "____________________"
    },
    {
      name: "Financial Evaluator",
      designation: "Financial Analyst",
      signature: "____________________",
      date: "____________________"
    },
    {
      name: "Legal Representative",
      designation: "Legal Officer",
      signature: "____________________",
      date: "____________________"
    }
  ];
};

export default FinancialBid;

const columns: ColumnDef<any>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        {row.original.designation && (
          <div className="text-sm text-gray-500">{row.original.designation}</div>
        )}
      </div>
    ),
  },
  {
    header: "Signature",
    accessorKey: "signature",
    cell: ({ row }) => (
      <div className="text-center py-4">
        {row.original.signature}
      </div>
    ),
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => (
      <div className="text-center py-4">
        {row.original.date}
      </div>
    ),
  },
];
