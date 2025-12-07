"use client";

import React, { useState } from "react";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import FormTextArea from "components/atoms/FormTextArea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Upload } from "lucide-react";

const EOIResponseSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  contact_person: z.string().min(1, "Contact person is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  company_profile: z.string().min(1, "Company profile is required"),
  relevant_experience: z.string().min(1, "Relevant experience is required"),
  proposed_approach: z.string().min(1, "Proposed approach is required"),
  // Additional fields for procurement bids
  bid_amount: z.string().optional(),
  technical_proposal: z.string().optional(),
  financial_proposal: z.string().optional(),
  implementation_timeline: z.string().optional(),
  team_composition: z.string().optional(),
  // Vendor registration fields
  business_registration_number: z.string().optional(),
  tax_identification: z.string().optional(),
  business_address: z.string().optional(),
  years_in_business: z.string().optional(),
  annual_turnover: z.string().optional(),
  certifications: z.string().optional(),
});

type EOIResponseFormData = z.infer<typeof EOIResponseSchema>;

interface EOIVendorSubmissionProps {
  eoiData?: any;
  isProcurementWithRegistration?: boolean;
}

const EOIVendorSubmission: React.FC<EOIVendorSubmissionProps> = ({ eoiData, isProcurementWithRegistration = false }) => {
  const [documents, setDocuments] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<'company' | 'proposal' | 'bid' | 'documents'>('company');

  const form = useForm<EOIResponseFormData>({
    resolver: zodResolver(EOIResponseSchema),
    defaultValues: {
      company_name: "",
      contact_person: "",
      email: "",
      phone: "",
      company_profile: "",
      relevant_experience: "",
      proposed_approach: "",
      bid_amount: "",
      technical_proposal: "",
      financial_proposal: "",
      implementation_timeline: "",
      team_composition: "",
      business_registration_number: "",
      tax_identification: "",
      business_address: "",
      years_in_business: "",
      annual_turnover: "",
      certifications: "",
    },
  });

  const onSubmit = async (data: EOIResponseFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Add form data
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add EOI ID
      if (eoiData?.id) {
        formData.append("eoi_id", eoiData.id);
      }

      // Add documents if any
      if (documents) {
        for (let i = 0; i < documents.length; i++) {
          formData.append("documents", documents[i]);
        }
      }

      // TODO: Replace with actual API call
      console.log("Submitting EOI response:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("EOI response submitted successfully!");
      form.reset();
      setDocuments(null);
      
    } catch (error) {
      toast.error("Failed to submit EOI response");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setDocuments(event.target.files);
    }
  };

  const sectionConfig = isProcurementWithRegistration
    ? {
        company: { title: "Company Information", description: "Basic company details and registration information" },
        proposal: { title: "Technical Proposal", description: "Your approach and experience for this opportunity" },
        bid: { title: "Financial Proposal", description: "Bid amount and financial details" },
        documents: { title: "Supporting Documents", description: "Upload required documents and certifications" }
      }
    : {
        company: { title: "Company Information", description: "Basic company details" },
        proposal: { title: "EOI Response", description: "Your response to this expression of interest" },
        documents: { title: "Supporting Documents", description: "Upload supporting documents" }
      };

  const sections = isProcurementWithRegistration
    ? ['company', 'proposal', 'bid', 'documents'] as const
    : ['company', 'proposal', 'documents'] as const;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {isProcurementWithRegistration ? "Vendor Registration & Bid Submission" : "Submit Response to EOI"}
          </h3>
          {eoiData && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium">{eoiData.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{eoiData.description}</p>
              {eoiData.closing_date && (
                <p className="text-sm text-red-600 mt-2">
                  Closing Date: {new Date(eoiData.closing_date).toLocaleDateString("en-US")}
                </p>
              )}
              {isProcurementWithRegistration && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Dual Purpose:</strong> This form will register your company as a vendor and submit your bid for this procurement opportunity.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section Navigation */}
        {isProcurementWithRegistration && (
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {sections.map((section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => setActiveSection(section)}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                    activeSection === section
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {sectionConfig[section].title}
                </button>
              ))}
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Information Section */}
            {(!isProcurementWithRegistration || activeSection === 'company') && (
              <div className="space-y-6">
                {isProcurementWithRegistration && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900">{sectionConfig.company.title}</h4>
                    <p className="text-sm text-gray-600">{sectionConfig.company.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="company_name"
                    label="Company Name"
                    placeholder="Enter your company name"
                    required
                  />
                  <FormInput
                    name="contact_person"
                    label="Contact Person"
                    placeholder="Enter contact person name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="Enter email address"
                    required
                  />
                  <FormInput
                    name="phone"
                    label="Phone Number"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                {isProcurementWithRegistration && (
                  <>
                    <FormTextArea
                      name="business_address"
                      label="Business Address"
                      placeholder="Enter your complete business address"
                      rows={2}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        name="business_registration_number"
                        label="Business Registration Number"
                        placeholder="Enter registration number"
                      />
                      <FormInput
                        name="tax_identification"
                        label="Tax Identification Number"
                        placeholder="Enter tax ID"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        name="years_in_business"
                        label="Years in Business"
                        type="number"
                        placeholder="Enter years"
                      />
                      <FormInput
                        name="annual_turnover"
                        label="Annual Turnover (USD)"
                        placeholder="Enter annual turnover"
                      />
                    </div>

                    <FormTextArea
                      name="certifications"
                      label="Certifications & Accreditations"
                      placeholder="List relevant certifications, licenses, and accreditations"
                      rows={3}
                    />
                  </>
                )}

                <FormTextArea
                  name="company_profile"
                  label="Company Profile"
                  placeholder="Provide a brief overview of your company, including history, size, and core competencies"
                  rows={4}
                  required
                />
              </div>
            )}

            {/* Proposal Section */}
            {(!isProcurementWithRegistration || activeSection === 'proposal') && (
              <div className="space-y-6">
                {isProcurementWithRegistration && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900">{sectionConfig.proposal.title}</h4>
                    <p className="text-sm text-gray-600">{sectionConfig.proposal.description}</p>
                  </div>
                )}

                <FormTextArea
                  name="relevant_experience"
                  label="Relevant Experience"
                  placeholder="Describe your relevant experience for this opportunity, including similar projects and achievements"
                  rows={4}
                  required
                />

                <FormTextArea
                  name="proposed_approach"
                  label="Proposed Approach"
                  placeholder="Outline your proposed approach to meet the requirements"
                  rows={4}
                  required
                />

                {isProcurementWithRegistration && (
                  <>
                    <FormTextArea
                      name="technical_proposal"
                      label="Technical Proposal"
                      placeholder="Provide detailed technical specifications and methodology"
                      rows={5}
                    />

                    <FormTextArea
                      name="implementation_timeline"
                      label="Implementation Timeline"
                      placeholder="Outline your proposed timeline with key milestones"
                      rows={4}
                    />

                    <FormTextArea
                      name="team_composition"
                      label="Team Composition"
                      placeholder="Describe your team structure and key personnel"
                      rows={4}
                    />
                  </>
                )}
              </div>
            )}

            {/* Bid Section (Procurement with Registration only) */}
            {isProcurementWithRegistration && activeSection === 'bid' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">{sectionConfig.bid.title}</h4>
                  <p className="text-sm text-gray-600">{sectionConfig.bid.description}</p>
                </div>

                <FormInput
                  name="bid_amount"
                  label="Total Bid Amount (USD)"
                  type="number"
                  placeholder="Enter your total bid amount"
                />

                <FormTextArea
                  name="financial_proposal"
                  label="Financial Proposal Details"
                  placeholder="Provide detailed cost breakdown and financial terms"
                  rows={5}
                />

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Your bid amount should be competitive and include all costs.
                    Ensure you have reviewed all requirements before submitting.
                  </p>
                </div>
              </div>
            )}

            {/* Documents Section */}
            {(!isProcurementWithRegistration || activeSection === 'documents') && (
              <div className="space-y-6">
                {isProcurementWithRegistration && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900">{sectionConfig.documents.title}</h4>
                    <p className="text-sm text-gray-600">{sectionConfig.documents.description}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>
                    {isProcurementWithRegistration ? "Required Documents" : "Supporting Documents"}
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <div className="text-center">
                        <Label htmlFor="documents" className="cursor-pointer text-blue-600 hover:text-blue-500">
                          Click to upload documents
                        </Label>
                        <Input
                          id="documents"
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB each</p>
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

                  {isProcurementWithRegistration && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Required Documents:</strong> Business registration, tax certificates,
                        financial statements, relevant certifications, and technical documentation.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation and Submit Buttons */}
            <div className="flex justify-between pt-6 border-t">
              {isProcurementWithRegistration ? (
                <>
                  <div className="flex space-x-4">
                    {sections.map((section, index) => (
                      index > 0 && activeSection === section && (
                        <Button
                          key={`prev-${section}`}
                          type="button"
                          variant="outline"
                          onClick={() => setActiveSection(sections[index - 1])}
                        >
                          Previous
                        </Button>
                      )
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    {sections.map((section, index) => (
                      index < sections.length - 1 && activeSection === section && (
                        <Button
                          key={`next-${section}`}
                          type="button"
                          onClick={() => setActiveSection(sections[index + 1])}
                        >
                          Next
                        </Button>
                      )
                    ))}

                    {activeSection === 'documents' && (
                      <Button type="submit" disabled={isSubmitting} size="lg">
                        {isSubmitting ? "Submitting..." : "Submit Registration & Bid"}
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex justify-end w-full">
                  <Button type="submit" disabled={isSubmitting} size="lg">
                    {isSubmitting ? "Submitting..." : "Submit EOI Response"}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default EOIVendorSubmission;