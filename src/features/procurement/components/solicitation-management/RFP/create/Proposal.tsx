"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import RfpLayout from "./RfpLayout";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import FormTextArea from "components/atoms/FormTextArea";
import FormSelect from "components/atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import FormButton from "@/components/FormButton";
import { toast } from "sonner";
import { useGetPurchaseRequestById } from "@/features/procurement/controllers/purchaseRequestController";
import { useCreateSolicitation } from "@/features/procurement/controllers/solicitationController";
// Removed unused imports for items and lots
import { LoadingSpinner } from "components/Loading";

// Schema for RFP Proposal matching backend requirements
const RFPProposalFormSchema = z.object({
  // Core RFP fields matching SolicitationProposalSchema
  title: z.string().min(1, "RFP title is required"),
  rfp_id: z.string().min(1, "RFP ID is required"),
  background: z.string().min(1, "Background/description is required"),
  tender_type: z.string().min(1, "Tender type is required"),
  request_type: z.string().min(1, "Request type is required"),
  eoi_tender: z.string().optional(),
  categories: z.array(z.string()).optional(),
  procurement_type: z.string().min(1, "Procurement type is required"),
  opening_date: z.string().optional(),
  closing_date: z.string().optional(),

  // Document requirements
  documents: z.array(z.object({
    title: z.string().min(1, "Document title is required"),
    description: z.string().optional(),
    document_type: z.string().min(1, "Document type is required"),
    deliverable: z.string().optional(),
    number_of_days: z.string().optional(),
  })).min(1, "At least one document requirement is required"),

  // Project-specific fields for RFP
  project_scope: z.string().min(1, "Project scope is required"),
  objectives: z.string().min(1, "Project objectives are required"),
  deliverables: z.string().min(1, "Expected deliverables are required"),
  timeline: z.string().min(1, "Project timeline is required"),
  budget_range: z.string().optional(),
  technical_requirements: z.string().optional(),
  evaluation_criteria: z.string().min(1, "Evaluation criteria are required"),
  qualification_criteria: z.string().optional(),
});

type RFPProposalFormData = z.infer<typeof RFPProposalFormSchema>;

const Proposal = () => {
  const router = useRouter();
  const [quotationData, setQuotationData] = useState<any>(null);
  // Removed isPopulating state - not needed for single RFP form

  const form = useForm<RFPProposalFormData>({
    resolver: zodResolver(RFPProposalFormSchema),
    defaultValues: {
      title: "",
      rfp_id: "",
      background: "",
      tender_type: "NATIONAL OPEN TENDER",
      request_type: "REQUEST FOR PROPOSAL",
      eoi_tender: "",
      categories: [],
      procurement_type: "PROCUREMENT",
      opening_date: "",
      closing_date: "",
      project_scope: "",
      objectives: "",
      deliverables: "",
      timeline: "",
      budget_range: "",
      technical_requirements: "",
      evaluation_criteria: "Technical Experience (40%), Company Profile & Financial Capacity (30%), Cost Effectiveness (30%)",
      qualification_criteria: "Must be legally registered in Nigeria, Have current tax clearance certificate, Demonstrate minimum 3 years experience in similar projects with reputable organizations, Provide audited financial statements for the last 2 years",
      documents: [
        {
          title: "Company Profile",
          description: "Legal registration details and company information",
          document_type: "COMPANY_PROFILE",
          deliverable: "",
          number_of_days: "",
        },
        {
          title: "Tax Clearance Certificate",
          description: "Current valid tax clearance certificate",
          document_type: "TAX_CLEARANCE",
          deliverable: "",
          number_of_days: "",
        },
        {
          title: "Audited Financial Report",
          description: "Most recent audited financial statements (last 2 years)",
          document_type: "FINANCIAL_REPORT",
          deliverable: "",
          number_of_days: "",
        },
        {
          title: "Technical Experience Portfolio",
          description: "Portfolio showing similar projects with reputable organizations",
          document_type: "TECHNICAL_PORTFOLIO",
          deliverable: "",
          number_of_days: "",
        },
        {
          title: "Bank Reference Letter",
          description: "Reference letter from financial institution",
          document_type: "BANK_REFERENCE",
          deliverable: "",
          number_of_days: "",
        },
      ],
    },
  });

  // No field array needed - single RFP form

  // Get purchase request ID from quotation data
  const purchaseRequestId = quotationData?.purchase_request;

  // Fetch purchase request data if ID exists
  const { data: purchaseRequestData, isLoading: isPRLoading } = useGetPurchaseRequestById(
    purchaseRequestId as string,
    !!purchaseRequestId
  );

  // Items and lots not needed for RFP (document-based proposals)

  // Load quotation data from sessionStorage
  useEffect(() => {
    const storedData = sessionStorage.getItem("rfpProposalFormData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setQuotationData(parsed);
        console.log("📋 Loaded RFP proposal data:", parsed);
      } catch (error) {
        console.error("Error parsing RFP proposal data:", error);
      }
    }
  }, []);

  // Note: RFPs are typically created from scratch, not from Purchase Requests
  // Auto-population logic removed for RFP-specific workflow

  // Create solicitation hook
  const { createSolicitation, isLoading: isCreating } = useCreateSolicitation();

  const onSubmit: SubmitHandler<RFPProposalFormData> = async (data) => {
    try {
      console.log("🔍 RFP Form Data Received:", data);

      // Validate required fields
      if (!data.title) {
        throw new Error("RFP title is required");
      }
      if (!data.background) {
        throw new Error("RFP background/description is required");
      }
      if (!data.rfp_id) {
        throw new Error("RFP ID is required");
      }

      // Prepare final solicitation data matching Django REST API requirements
      const finalData = {
        // Core RFP fields matching SolicitationProposalSchema
        title: data.title,
        rfp_id: data.rfp_id,
        background: data.background,
        tender_type: data.tender_type,
        request_type: data.request_type,
        eoi_tender: data.eoi_tender || null,
        categories: data.categories || [],
        procurement_type: data.procurement_type,

        // Include session data if available
        ...quotationData,

        // Documents for RFP
        documents: data.documents || [],

        // Project details stored in background or as metadata
        project_details: {
          scope: data.project_scope,
          objectives: data.objectives,
          deliverables: data.deliverables,
          timeline: data.timeline,
          budget_range: data.budget_range,
          technical_requirements: data.technical_requirements,
          evaluation_criteria: data.evaluation_criteria,
          qualification_criteria: data.qualification_criteria,
        },

        // Dates
        opening_date: data.opening_date || quotationData?.opening_date || null,
        closing_date: data.closing_date || quotationData?.closing_date || null,

        // RFP typically doesn't have specific items like RFQ
        solicitation_items: [],
        solicitation_evaluations: [],
      };

      console.log("🚀 Creating RFP with Django REST API format:", finalData);

      // Validate required Django API fields before submission
      if (!finalData.title) {
        throw new Error("RFP title is required");
      }
      if (!finalData.background) {
        throw new Error("RFP background/description is required");
      }

      // Create RFP using the API
      const result = await createSolicitation(finalData);

      console.log("📋 RFP Creation Result:", result);

      if (result) {
        toast.success("RFP created successfully!");
        router.push("/dashboard/procurement/solicitation-management/rfp");

        // Clear stored form data after successful creation
        setTimeout(() => {
          sessionStorage.removeItem("rfpProposalFormData");
          sessionStorage.removeItem("rfpCompleteFormData");
        }, 1000);
      } else {
        throw new Error("No result returned from API");
      }

    } catch (error: any) {
      console.error("🚨 Error creating RFP:", {
        error: error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        fullError: error
      });

      // More specific error messages
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          "Failed to create RFP. Please check all required fields and try again.";

      toast.error(errorMessage);
    }
  };

  // No add/remove functions needed for single RFP form

  return (
    <RfpLayout>
      <div className="p-5">
        <div className="mb-6">
          <h4 className="font-semibold text-lg">Define RFP Project/Service Requirements</h4>
          <p className="text-gray-600 text-sm mt-2">
            Define the project or service requirements for vendors to submit document-based proposals
          </p>

          {quotationData && (
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>RFP:</strong> {quotationData.title || "Untitled RFP"}
                </p>
              </div>

              {purchaseRequestId && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Purchase Request:</strong> {purchaseRequestData?.data?.ref_number || purchaseRequestId}
                  </p>
                  {isPRLoading && (
                    <p className="text-xs text-green-600 mt-1">
                      Loading purchase request items...
                    </p>
                  )}
                  {purchaseRequestData?.data?.items && (
                    <p className="text-xs text-green-600 mt-1">
                      ✅ {purchaseRequestData.data.items.length} items loaded from this purchase request
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {isPRLoading && (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
            <span className="ml-2 text-gray-600">
              Loading purchase request...
            </span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Core RFP Information */}
            <div className="border border-gray-200 rounded-lg p-6 space-y-6">
              <h5 className="font-medium text-gray-900 text-lg">
                RFP Basic Information
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name="title"
                  label="RFP Title"
                  placeholder="e.g., Health Management Organization (HMO) Services"
                  required
                />
                <FormInput
                  name="rfp_id"
                  label="RFP ID"
                  placeholder="e.g., AHNI/RFP/2024/001"
                  required
                />
              </div>

              <FormTextArea
                name="background"
                label="Background/Description"
                placeholder="Provide comprehensive background information about this RFP"
                rows={4}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormSelect name="tender_type" label="Tender Type">
                  <SelectContent>
                    <SelectItem value="NATIONAL OPEN TENDER">National Open Tender</SelectItem>
                    <SelectItem value="LIMITED SOLICITATION">Limited Solicitation</SelectItem>
                    <SelectItem value="SINGLE SOURCE">Single Source</SelectItem>
                  </SelectContent>
                </FormSelect>

                <FormSelect name="procurement_type" label="Procurement Type">
                  <SelectContent>
                    <SelectItem value="PROCUREMENT">Procurement</SelectItem>
                    <SelectItem value="ADMIN">Administrative</SelectItem>
                  </SelectContent>
                </FormSelect>

                <FormInput
                  name="eoi_tender"
                  label="EOI Reference (Optional)"
                  placeholder="EOI reference if applicable"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name="opening_date"
                  label="Opening Date (Optional)"
                  type="date"
                />
                <FormInput
                  name="closing_date"
                  label="Closing Date (Optional)"
                  type="date"
                />
              </div>
            </div>

            {/* Project Scope and Requirements */}
            <div className="border border-gray-200 rounded-lg p-6 space-y-6">
              <h5 className="font-medium text-gray-900 text-lg">
                Project Scope and Requirements
              </h5>

              <FormTextArea
                name="project_scope"
                label="Project Scope"
                placeholder="Detailed description of the project scope and work to be performed"
                rows={4}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormTextArea
                  name="objectives"
                  label="Project Objectives"
                  placeholder="What are AHNI's main goals and objectives for this project?"
                  rows={3}
                  required
                />
                <FormTextArea
                  name="deliverables"
                  label="Expected Deliverables"
                  placeholder="What specific deliverables should vendors provide?"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name="timeline"
                  label="Project Timeline"
                  placeholder="e.g., 6 months, 1 year, ongoing"
                  required
                />
                <FormInput
                  name="budget_range"
                  label="Budget Range (Optional)"
                  placeholder="e.g., ₦5M - ₦10M, USD 50K - 100K"
                />
              </div>

              <FormTextArea
                name="technical_requirements"
                label="Technical Requirements (Optional)"
                placeholder="Specific technical specifications or requirements"
                rows={3}
              />
            </div>

            {/* Evaluation Criteria */}
            <div className="border border-gray-200 rounded-lg p-6 space-y-6">
              <h5 className="font-medium text-gray-900 text-lg">
                Evaluation and Qualification Criteria
              </h5>

              <FormTextArea
                name="evaluation_criteria"
                label="Evaluation Criteria"
                placeholder="AHNI Evaluation Criteria: Technical Experience with similar organizations (40%), Company Profile & Financial Capacity demonstrated through audited statements (30%), Cost Effectiveness and Value for Money (30%)"
                rows={4}
                required
              />

              <FormTextArea
                name="qualification_criteria"
                label="Qualification Criteria (Optional)"
                placeholder="Minimum requirements vendors must meet to qualify (e.g., Must be legally registered in Nigeria, Have current tax clearance certificate, etc.)"
                rows={4}
              />
            </div>

            {/* Required Documents Section */}
            <div className="border border-gray-200 rounded-lg p-6 space-y-6">
              <h5 className="font-medium text-gray-900 text-lg">
                Required Documents from Vendors
              </h5>
              <p className="text-sm text-gray-600">
                The following documents are pre-configured based on AHNI's standard requirements. You can modify these as needed.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h6 className="font-medium text-gray-800">✓ Company Profile</h6>
                  <p className="text-sm text-gray-600">Legal registration details and company information</p>
                </div>
                <div className="space-y-2">
                  <h6 className="font-medium text-gray-800">✓ Tax Clearance Certificate</h6>
                  <p className="text-sm text-gray-600">Current valid tax clearance certificate</p>
                </div>
                <div className="space-y-2">
                  <h6 className="font-medium text-gray-800">✓ Audited Financial Report</h6>
                  <p className="text-sm text-gray-600">Most recent audited financial statements (last 2 years)</p>
                </div>
                <div className="space-y-2">
                  <h6 className="font-medium text-gray-800">✓ Technical Experience Portfolio</h6>
                  <p className="text-sm text-gray-600">Portfolio showing similar projects with reputable organizations</p>
                </div>
                <div className="space-y-2">
                  <h6 className="font-medium text-gray-800">✓ Bank Reference Letter</h6>
                  <p className="text-sm text-gray-600">Reference letter from financial institution</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <FormButton type="submit" disabled={isCreating || isPRLoading}>
                {isCreating ? "Creating RFP..." : "Create RFP"}
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </RfpLayout>
  );
};

export default Proposal;