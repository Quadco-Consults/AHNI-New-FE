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
});

type EOIResponseFormData = z.infer<typeof EOIResponseSchema>;

interface EOIVendorSubmissionProps {
  eoiData?: any;
}

const EOIVendorSubmission: React.FC<EOIVendorSubmissionProps> = ({ eoiData }) => {
  const [documents, setDocuments] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Submit Response to EOI</h3>
          {eoiData && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium">{eoiData.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{eoiData.description}</p>
              {eoiData.closing_date && (
                <p className="text-sm text-red-600 mt-2">
                  Closing Date: {new Date(eoiData.closing_date).toLocaleDateString("en-US")}
                </p>
              )}
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Information */}
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

            {/* Company Details */}
            <FormTextArea
              name="company_profile"
              label="Company Profile"
              placeholder="Provide a brief overview of your company, including history, size, and core competencies"
              rows={4}
              required
            />

            <FormTextArea
              name="relevant_experience"
              label="Relevant Experience"
              placeholder="Describe your relevant experience for this EOI, including similar projects and achievements"
              rows={4}
              required
            />

            <FormTextArea
              name="proposed_approach"
              label="Proposed Approach"
              placeholder="Outline your proposed approach to meet the requirements of this EOI"
              rows={4}
              required
            />

            {/* Document Upload */}
            <div className="space-y-2">
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
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? "Submitting..." : "Submit EOI Response"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default EOIVendorSubmission;