"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { Label } from "components/ui/label";
import {
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  Upload,
  DollarSign,
  ArrowLeft,
  Save,
  Send,
  Info
} from "lucide-react";
import { useVendorRFQDetails } from "@/features/vendor-portal/controllers/vendorDashboardController";
import { LoadingSpinner } from "components/Loading";
import { toast } from "sonner";

const BidSubmissionSchema = z.object({
  bid_amount: z.string().min(1, "Bid amount is required"),
  technical_proposal: z.string().min(1, "Technical proposal is required"),
  financial_proposal: z.string().min(1, "Financial proposal is required"),
  implementation_timeline: z.string().min(1, "Implementation timeline is required"),
  team_composition: z.string().min(1, "Team composition is required"),
  project_approach: z.string().min(1, "Project approach is required"),
  risk_management: z.string().optional(),
  quality_assurance: z.string().optional(),
  delivery_schedule: z.string().optional(),
  payment_terms: z.string().optional(),
  warranty_terms: z.string().optional(),
  additional_notes: z.string().optional(),
});

type BidSubmissionFormData = z.infer<typeof BidSubmissionSchema>;

export default function VendorBidSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const rfqId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [documents, setDocuments] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const { data: rfqDetails, isLoading, error } = useVendorRFQDetails(rfqId as string);

  const form = useForm<BidSubmissionFormData>({
    resolver: zodResolver(BidSubmissionSchema),
    defaultValues: {
      bid_amount: "",
      technical_proposal: "",
      financial_proposal: "",
      implementation_timeline: "",
      team_composition: "",
      project_approach: "",
      risk_management: "",
      quality_assurance: "",
      delivery_schedule: "",
      payment_terms: "",
      warranty_terms: "",
      additional_notes: "",
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading bid submission form...</span>
      </div>
    );
  }

  if (error || !rfqDetails) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load RFQ details. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    const now = new Date();
    const closing = new Date(rfqDetails.closing_date);
    const diffTime = closing.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setDocuments(event.target.files);
    }
  };

  const onSaveDraft = async (data: BidSubmissionFormData) => {
    setIsSavingDraft(true);
    try {
      // TODO: Implement save draft API call
      console.log("Saving draft:", { rfqId, ...data, documents });

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Draft saved successfully!");
    } catch (error) {
      toast.error("Failed to save draft");
      console.error(error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const onSubmit = async (data: BidSubmissionFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Add form data
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Add RFQ ID
      formData.append("rfq_id", rfqId as string);

      // Add documents if any
      if (documents) {
        for (let i = 0; i < documents.length; i++) {
          formData.append("documents", documents[i]);
        }
      }

      // TODO: Implement actual API call
      console.log("Submitting bid:", formData);

      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success("Bid submitted successfully!");
      router.push(`/vendor-portal/rfqs/${rfqId}`);

    } catch (error) {
      toast.error("Failed to submit bid");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysRemaining = getDaysRemaining();
  const isClosingSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isClosed = daysRemaining <= 0;

  const sections = [
    {
      title: "Financial Proposal",
      description: "Bid amount and financial details",
      fields: ["bid_amount", "financial_proposal", "payment_terms"]
    },
    {
      title: "Technical Proposal",
      description: "Technical approach and methodology",
      fields: ["technical_proposal", "project_approach", "implementation_timeline"]
    },
    {
      title: "Team & Resources",
      description: "Team composition and resource allocation",
      fields: ["team_composition", "quality_assurance", "delivery_schedule"]
    },
    {
      title: "Risk & Additional Info",
      description: "Risk management and additional details",
      fields: ["risk_management", "warranty_terms", "additional_notes"]
    }
  ];

  if (isClosed || rfqDetails.eligibility_status !== 'ELIGIBLE') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/vendor-portal/rfqs/${rfqId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to RFQ
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bid Submission</h1>
            <p className="text-gray-600 mt-1">{rfqDetails.title}</p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {isClosed
              ? "This RFQ is closed and no longer accepting submissions."
              : "You are not eligible to submit a bid for this RFQ."
            }
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/vendor-portal/rfqs/${rfqId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to RFQ
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Submit Bid</h1>
          <p className="text-gray-600 mt-1">{rfqDetails.title}</p>
        </div>
      </div>

      {/* Status Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Closes: {formatDate(rfqDetails.closing_date)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {daysRemaining} days remaining
                </span>
              </div>
              <Badge variant="default">Eligible to Bid</Badge>
            </div>
            {isClosingSoon && (
              <Badge variant="secondary" className="text-orange-600 border-orange-200">
                Closing Soon
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Submission Progress</h3>
            <span className="text-sm text-gray-600">
              Section {currentSection + 1} of {sections.length}
            </span>
          </div>
          <div className="flex space-x-2">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
                  currentSection === index
                    ? 'bg-blue-600 text-white'
                    : index < currentSection
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <Form {...form}>
        <form className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{sections[currentSection].title}</CardTitle>
              <CardDescription>
                {sections[currentSection].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Financial Proposal Section */}
              {currentSection === 0 && (
                <>
                  <FormField
                    control={form.control}
                    name="bid_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Bid Amount (USD) *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter your total bid amount"
                              className="pl-9"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="financial_proposal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Financial Proposal Details *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Provide detailed cost breakdown, pricing structure, and financial terms"
                            rows={6}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payment_terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Payment Terms</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe your preferred payment schedule and terms"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Technical Proposal Section */}
              {currentSection === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="technical_proposal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technical Proposal *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Provide detailed technical specifications, methodology, and solutions"
                            rows={6}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="project_approach"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Approach *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe your overall approach to this project"
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="implementation_timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Implementation Timeline *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Provide detailed timeline with key milestones and deliverables"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Team & Resources Section */}
              {currentSection === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="team_composition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Composition *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe your team structure, key personnel, and their roles"
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quality_assurance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quality Assurance Plan</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe your quality assurance processes and standards"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="delivery_schedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Schedule</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Outline your delivery schedule and key deadlines"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Risk & Additional Info Section */}
              {currentSection === 3 && (
                <>
                  <FormField
                    control={form.control}
                    name="risk_management"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Management Plan</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Identify potential risks and your mitigation strategies"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="warranty_terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warranty Terms</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe warranty coverage and support terms"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additional_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Any additional information you'd like to include"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Document Upload Section */}
                  <div className="space-y-4">
                    <Label>Supporting Documents</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div className="text-center">
                          <Label htmlFor="documents" className="cursor-pointer text-blue-600 hover:text-blue-500">
                            Click to upload supporting documents
                          </Label>
                          <Input
                            id="documents"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.xlsx,.jpg,.jpeg,.png"
                          />
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, XLSX, JPG, PNG up to 10MB each</p>
                      </div>
                      {documents && (
                        <div className="mt-4">
                          <p className="text-sm font-medium">Selected files:</p>
                          <ul className="text-sm text-gray-600">
                            {Array.from(documents).map((file, index) => (
                              <li key={index}>• {file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Navigation and Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  {currentSection > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentSection(currentSection - 1)}
                    >
                      Previous
                    </Button>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onSaveDraft(form.getValues())}
                    disabled={isSavingDraft}
                  >
                    {isSavingDraft ? (
                      <>
                        <LoadingSpinner />
                        <span className="ml-2">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </>
                    )}
                  </Button>

                  {currentSection < sections.length - 1 ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentSection(currentSection + 1)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner />
                          <span className="ml-2">Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Bid
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Once submitted, you may not be able to modify your bid.
              Please review all sections carefully before final submission.
              You can save drafts at any time to continue later.
            </AlertDescription>
          </Alert>
        </form>
      </Form>
    </div>
  );
}