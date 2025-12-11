"use client";

import { ColumnDef } from "@tanstack/react-table";
import logoSvg from "@/assets/svgs/logo-bg.svg";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import { ChevronRight } from "lucide-react";
import TenderChecklist from "./TenderCheckList";
import { useForm } from "react-hook-form";
import GoBack from "components/GoBack";
import { useRouter, useParams } from "next/navigation";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { useEffect, useState } from "react";
import { RouteEnum } from "constants/RouterConstants";
import { toast } from "sonner";
import { Loading } from "components/Loading";
import { skipToken } from "@reduxjs/toolkit/query";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
import { useGetSingleSolicitation } from "@/features/procurement/controllers/solicitationController";
import { getCurrentUser } from "@/utils/auth";

const TPS = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const appID = params?.appID as string;

  // const { data: cbaData } = CbaAPI.useGetCba({
  //   path: {
  //     // @ts-ignore
  //     id: id,
  //   },
  // });

  // Get solicitation data (the RFQ being evaluated)
  const { data: solicitationData, isLoading: isSolicitationLoading } = useGetSingleSolicitation(appID as string, !!appID);

  // Get vendor submission data for this specific vendor and solicitation
  const { data: submissionData, isLoading: isSubmissionLoading } = useGetSolicitationSubmission(appID as string, !!appID);

  // Debug the submission data structure
  console.log("🔍 Debug Submission Data Structure:", {
    fullSubmissionData: submissionData,
    dataPath1: submissionData?.data?.data?.results,
    dataPath2: submissionData?.data?.results,
    dataPath3: (submissionData as any)?.results,
    lookingForId: id,
    solicitationId: appID
  });

  // Try multiple possible data paths to find vendor submissions
  let vendorSubmissions: any[] = [];
  if ((submissionData as any)?.data?.data?.results) {
    vendorSubmissions = (submissionData as any).data.data.results;
  } else if ((submissionData as any)?.data?.results) {
    vendorSubmissions = (submissionData as any).data.results;
  } else if ((submissionData as any)?.results) {
    vendorSubmissions = (submissionData as any).results;
  }

  console.log("🔍 All Vendor Submissions:", vendorSubmissions);

  // Find the specific vendor submission being evaluated
  const vendorSubmission = vendorSubmissions.find((submission: any) => submission.id === id);

  console.log("🔍 Found Vendor Submission:", {
    vendorSubmission,
    submissionId: id,
    foundMatch: !!vendorSubmission
  });

  // Get vendor data from the submission
  const vendorData = vendorSubmission?.vendor;

  // Get current user conducting the evaluation
  const currentUser = getCurrentUser();

  console.log("📋 Vendor Prequalification Data:", {
    vendorSubmissionId: id,
    solicitationId: appID,
    vendorSubmission: vendorSubmission,
    vendorData: vendorData,
    solicitationData: solicitationData?.data,
    submissionData: submissionData?.data,
    evaluatedBy: currentUser,
    hasVendorData: !!vendorData,
    vendorDataKeys: vendorData ? Object.keys(vendorData) : null
  });

  // State to track evaluation results
  const [evaluationResults, setEvaluationResults] = useState<any[]>([]);

  const form = useForm({
    defaultValues: {
      vendor_id: id,
      solicitation_id: appID,
      stage: "TECHNICAL",
      criteriaDataStatus: [],
    },
  });

  const { handleSubmit, control, getValues, setValue } = form;

  // Load any existing evaluation for this vendor
  useEffect(() => {
    const existingEvaluations = JSON.parse(localStorage.getItem('vendor_evaluations') || '[]');
    const existingEvaluation = existingEvaluations.find((evaluation: any) =>
      evaluation.vendor_submission_id === id && evaluation.solicitation_id === appID && evaluation.stage === "TECHNICAL"
    );

    if (existingEvaluation) {
      console.log("📋 Found existing technical evaluation:", existingEvaluation);
      setEvaluationResults(existingEvaluation.criteria_results || []);
    }
  }, [id, appID]);

  const onSubmit = async (data: any) => {
    if (!id || !appID) {
      toast.error("Vendor ID or Solicitation ID is missing.");
      return;
    }

    try {
      let failedCount = 0; // Counter for failed responses
      const evaluationResults = [];

      for (let criteria of data.criteriaDataStatus) {
        const passed = criteria.status === "PASS";

        // Store evaluation result
        evaluationResults.push({
          criteria: criteria.criteria,
          passed: passed,
          stage: "TECHNICAL"
        });

        console.log(`📊 Criteria: ${criteria.criteria} - ${criteria.status}`);

        if (!passed) {
          failedCount++;
        }
      }

      // Save evaluation results (you may want to create a new API endpoint for vendor prequalification)
      const prequalificationData = {
        vendor_id: id,
        solicitation_id: appID,
        stage: "TECHNICAL",
        evaluation_results: evaluationResults,
        overall_status: failedCount === 0 ? "PASSED" : "FAILED",
        evaluated_by: currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.username : "Procurement Officer",
        evaluation_date: new Date().toISOString(),
      };

      console.log("💾 Saving Vendor Prequalification:", prequalificationData);

      // Create comprehensive evaluation record with enhanced persistence
      const evaluationRecord = {
        vendor_submission_id: id,
        solicitation_id: appID,
        vendor_name: vendorData?.company_name || vendorSubmission?.vendor?.company_name,
        vendor_data: {
          company_name: vendorData?.company_name || vendorSubmission?.vendor?.company_name,
          company_registration_number: vendorData?.company_registration_number || vendorSubmission?.vendor?.company_registration_number,
          type_of_business: vendorData?.type_of_business || vendorSubmission?.vendor?.type_of_business,
          email: vendorData?.email || vendorSubmission?.vendor?.email,
        },
        evaluation_date: new Date().toISOString(),
        evaluator: {
          name: currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.username : "Procurement Officer",
          id: currentUser?.id || null,
          role: currentUser?.role ?
            (typeof currentUser.role === 'string' ? currentUser.role :
             (currentUser.role.title || "Procurement Officer")) :
            "Procurement Officer"
        },
        stage: "TECHNICAL",
        criteria_results: evaluationResults,
        overall_status: failedCount === 0 ? "PASSED" : "FAILED",
        total_criteria: data.criteriaDataStatus.length,
        passed_criteria: data.criteriaDataStatus.length - failedCount,
        failed_criteria: failedCount,
        evaluation_status: "TECHNICAL_COMPLETED", // Track completion status
        is_complete: true
      };

      // Store in localStorage for persistence across navigation
      const existingEvaluations = JSON.parse(localStorage.getItem('vendor_evaluations') || '[]');
      const updatedEvaluations = existingEvaluations.filter((evaluation: any) =>
        !(evaluation.vendor_submission_id === id && evaluation.solicitation_id === appID && evaluation.stage === "TECHNICAL")
      );
      updatedEvaluations.push(evaluationRecord);
      localStorage.setItem('vendor_evaluations', JSON.stringify(updatedEvaluations));

      console.log("💾 Vendor Technical Evaluation Saved:", evaluationRecord);

      if (failedCount === 0) {
        toast.success("✅ Technical prequalification passed! Proceeding to financial evaluation.");
      } else {
        toast.warning(`⚠️ ${failedCount} criteria failed. Review required.`);
      }

      // Navigate to financial evaluation stage
      const financialUrl = RouteEnum.PROCUREMENT_CBA_FINANCIAL_BID_OPENING.replace(':id', id);
      const params = new URLSearchParams({
        vendor_submission_id: id,
        solicitation: appID?.toString() || "",
        vendor_name: vendorData?.company_name || vendorSubmission?.vendor?.company_name || 'Unknown',
        stage: 'FINANCIAL',
        from: 'technical'
      });

      const fullUrl = `${financialUrl}?${params.toString()}`;
      console.log('🔗 Navigating to Financial Evaluation:', fullUrl);

      router.push(fullUrl);

    } catch (error) {
      console.error("❌ Error submitting vendor prequalification:", error);
      toast.error("Failed to save evaluation. Please try again.");
    }
  };

  if (isSolicitationLoading || isSubmissionLoading) return <Loading />;

  return (
    <>
      <GoBack />
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto p-5">
        <div className="bg-white p-8 h-full flex flex-col gap-8">
          <div className="">
            <div className="flex justify-center items-center flex-col">
              <img src={logoSvg.src || logoSvg} alt="Company Logo" width={200} className="max-w-full h-auto" />
            </div>
            <div className="p-4 w-full h-[70px] flex justify-between items-center text-xl">
              <h3 className="w-[250px] whitespace-nowrap text-primary">
                VENDOR EVALUATION
              </h3>
              <div className="flex w-full items-center justify-start ml-6">
                <p className="font-semibold">
                  TECHNICAL PREQUALIFICATION ASSESSMENT
                </p>
              </div>
            </div>
            <Separator />
            <div className="p-4 w-full h-[70px] flex justify-between items-center">
              <h3 className="w-[250px] whitespace-nowrap">Project Title</h3>
              <div className="flex w-full items-center justify-start ml-6">
                <p>{solicitationData?.data?.title || "RFQ Evaluation"}</p>
              </div>
            </div>{" "}
            <Separator />
            <div className="p-4 w-full min-h-[100px] flex justify-between items-start">
              <h3 className="w-[250px] whitespace-nowrap">Company Being Evaluated:</h3>
              <div className="flex w-full items-start justify-start ml-6">
                <div className="w-full">
                  {vendorSubmission ? (
                    <>
                      <p className="font-medium text-lg">
                        {vendorData?.company_name ||
                         vendorSubmission?.vendor?.company_name ||
                         vendorSubmission?.company_name ||
                         "Company Name Not Available"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Registration:</span> {
                          vendorData?.company_registration_number ||
                          vendorSubmission?.vendor?.company_registration_number ||
                          vendorSubmission?.company_registration_number ||
                          "N/A"
                        }
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Business Type:</span> {
                          vendorData?.type_of_business ||
                          vendorSubmission?.vendor?.type_of_business ||
                          vendorSubmission?.type_of_business ||
                          "N/A"
                        }
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {
                          vendorData?.email ||
                          vendorSubmission?.vendor?.email ||
                          vendorSubmission?.email ||
                          "N/A"
                        }
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Submission ID:</span> {vendorSubmission?.id}
                      </p>
                      {(vendorData?.status || vendorSubmission?.vendor?.status) && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Status:</span> {vendorData?.status || vendorSubmission?.vendor?.status}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-red-600">
                      <p className="font-medium">⚠️ Vendor data not found</p>
                      <p className="text-sm">Submission ID: {id}</p>
                      <p className="text-sm">Solicitation ID: {appID}</p>
                      <p className="text-sm">Check console for debug info</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <TenderChecklist
              control={control}
              criteriaData={criteriaData}
              setValue={setValue}
              getValues={getValues}
            />
          </div>
          <div className="">
            <Card className="border-yellow-darker space-y-3">
              <p>
                <strong>Vendor Evaluation Note:</strong>
              </p>
              <p>
                This evaluation determines the vendor's
                <span className="text-primary mx-1">
                  TECHNICAL QUALIFICATION
                </span>
                to participate in the procurement process. The vendor must meet all
                essential criteria to be considered
                <span className="text-primary mx-1">QUALIFIED</span>
                for this solicitation. This assessment is conducted
                <span className="text-primary mx-1">BEFORE</span>
                any competitive bidding analysis.
              </p>
            </Card>
          </div>
          {/* <div className='  px-8 my-8'>
            <p className='mb-4'> STAGE 1 & 2 ASSESSMENT:</p>
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
            </div>
          </div> */}
          <div className=" flex-col justify-center  items-center w-full p-2">
            <h3 className="underline font-semibold">
              Review Conducted by Evaluator:
            </h3>
            <DataTable
              columns={columns}
              data={getCurrentUserEvaluationData(currentUser)}
            />
          </div>
          <div className="w-full">
            <Button
              type="submit"
              className="w-full bg-alternate text-primary my-4 mt-10"
            >
              <ChevronRight size={20} />
              Next
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

// Helper function to get current user evaluation data
const getCurrentUserEvaluationData = (currentUser: any) => {
  const today = new Date().toLocaleDateString();

  // If we have current user data, use it
  if (currentUser) {
    // Handle role being an object or string
    let designation = 'Evaluator';
    if (currentUser.role) {
      if (typeof currentUser.role === 'string') {
        designation = currentUser.role;
      } else if (typeof currentUser.role === 'object' && currentUser.role.title) {
        designation = currentUser.role.title;
      }
    } else if (currentUser.position) {
      designation = typeof currentUser.position === 'string' ? currentUser.position : 'Evaluator';
    }

    return [
      {
        name: `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.username || 'Current User',
        designation: designation,
        signature: "____________________",
        date: today
      }
    ];
  }

  // Fallback if no user data available
  return [
    {
      name: "Procurement Officer",
      designation: "Evaluator",
      signature: "____________________",
      date: today
    }
  ];
};

export default TPS;

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

const criteriaData = [
  {
    stage: 1,
    criteria: "COMPLETENESS AND CONFORMITY TO TENDER REQUIREMENT",
    description_1:
      "If Tender submission CONFORMS to tender requirement, this includes submission of Technical Documentation, Financial Quotation as well as Tender Registration (Tick PASS)",
    description_2:
      "If Tender submission DO NOT CONFIRM to tender requirement, this includes submission of Technical Documentations, Financial Quotation as well as Tender Registration (Tick FAIL)",
  },
  {
    stage: 2,
    criteria: "ESSENTIAL AND LEGAL REGISTRATION DOCUMENT",
    description_1:
      "If provided with Company Profile, CAC or Business Name Registration, FORM C02, FORM C07,Office Address, Functional Telephone and Emails (Tick PASS)",
    description_2:
      "If this important legal registration information is not provided (Tick FAIL)",
  },
  {
    stage: 3,
    criteria: "TAX CLEARANCE",
    description_1:
      "If provided with Company Profile, CAC or Business Name Registration, FORM C02, FORM C07,Office Address, Functional Telephone and Emails (Tick PASS)",
    description_2:
      "If this important legal registration information is not provided (Tick FAIL)",
  },
  {
    stage: 4,
    criteria: "GOOD FINANCIAL BUSINESS PRACTICE",
    description_1:
      "If provided with Company Profile, CAC or Business Name Registration, FORM C02, FORM C07,Office Address, Functional Telephone and Emails (Tick PASS)",
    description_2:
      "If this important legal registration information is not provided (Tick FAIL)",
  },
  {
    stage: 5,
    criteria: "BANK REFERENCE",
    description_1:
      "If provided with Company Profile, CAC or Business Name Registration, FORM C02, FORM C07,Office Address, Functional Telephone and Emails (Tick PASS)",
    description_2:
      "If this important legal registration information is not provided (Tick FAIL)",
  },
  {
    stage: 6,
    criteria: "ORIGINAL EQUIPMENT MANUFACTURER(OEM) AUTHORIZATION TO DEAL",
    description_1:
      "If provided with Company Profile, CAC or Business Name Registration, FORM C02, FORM C07,Office Address, Functional Telephone and Emails (Tick PASS)",
    description_2:
      "If this important legal registration information is not provided (Tick FAIL)",
  },

  {
    stage: 7,
    criteria: "PREVIOUS JOB EXPERIENCE",
    description_1:
      "If provided with Company Profile, CAC or Business Name Registration, FORM C02, FORM C07,Office Address, Functional Telephone and Emails (Tick PASS)",
    description_2:
      "If this important legal registration information is not provided (Tick FAIL)",
  },
];
