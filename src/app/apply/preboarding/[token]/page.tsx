"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetPreboardingForm,
  useSubmitPreboardingForm,
} from "@/features/hr/controllers/publicJobApplicationController";
import { Loading } from "@/components/Loading";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, User, Mail, Phone, MapPin, Calendar, Users } from "lucide-react";

export default function PublicPreboardingPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
    nationality: "",
    state_of_origin: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
  });

  const [applicationData, setApplicationData] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);

  const getPreboardingForm = useGetPreboardingForm(token);
  const submitPreboardingForm = useSubmitPreboardingForm(token);

  // Fetch pre-boarding form data on mount
  useEffect(() => {
    if (token) {
      getPreboardingForm.mutate(undefined, {
        onSuccess: (response) => {
          const data = response.data;
          setApplicationData(data);

          // Pre-fill form with existing data
          setFormData({
            first_name: data.applicant.first_name || "",
            middle_name: data.applicant.middle_name || "",
            last_name: data.applicant.last_name || "",
            email: data.applicant.email || "",
            phone: data.existing_data?.phone || "",
            address: data.existing_data?.address || "",
            date_of_birth: data.existing_data?.date_of_birth || "",
            nationality: data.existing_data?.nationality || "",
            state_of_origin: data.existing_data?.state_of_origin || "",
            emergency_contact_name: data.existing_data?.emergency_contact_name || "",
            emergency_contact_phone: data.existing_data?.emergency_contact_phone || "",
            emergency_contact_relationship: data.existing_data?.emergency_contact_relationship || "",
          });
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to load pre-boarding form");
        },
      });
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    submitPreboardingForm.mutate(formData, {
      onSuccess: (response) => {
        toast.success(response.message || "Pre-boarding form submitted successfully!");
        setSubmitted(true);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || "Failed to submit pre-boarding form");
      },
    });
  };

  // Loading state
  if (getPreboardingForm.isPending) {
    return <Loading />;
  }

  // Error state
  if (getPreboardingForm.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-bold text-red-600">Invalid Link</h2>
          </div>
          <p className="text-gray-600 mb-4">
            The pre-boarding link is invalid or has expired. Please contact HR for assistance.
          </p>
          <Button onClick={() => router.push("/")} className="w-full">
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 bg-green-100 rounded-full p-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Form Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for completing the pre-boarding form. Our HR team will review your
              information and contact you with the next steps.
            </p>
            <div className="w-full space-y-2 mb-6">
              <div className="text-sm text-left space-y-1">
                <p className="font-medium text-gray-700">What happens next:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>HR will review your information</li>
                  <li>You'll receive your employment contract via email</li>
                  <li>Welcome to the team!</li>
                </ul>
              </div>
            </div>
            <Button onClick={() => router.push("/")} className="w-full">
              Return Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Boarding Form</h1>
          <p className="text-gray-600">
            Position: <span className="font-semibold">{applicationData?.position}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please provide your information below. Fields marked with * are required.
          </p>
        </div>

        {/* Instructions Card */}
        {applicationData?.instructions && (
          <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">Instructions</h3>
            <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
              {applicationData.instructions.map((instruction: string, index: number) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </Card>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="p-8">
            {/* Personal Information Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="middle_name">Middle Name</Label>
                  <Input
                    id="middle_name"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state_of_origin">State of Origin</Label>
                  <Input
                    id="state_of_origin"
                    name="state_of_origin"
                    value={formData.state_of_origin}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Home Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Emergency Contact</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency_contact_name">Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    name="emergency_contact_phone"
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                  <Input
                    id="emergency_contact_relationship"
                    name="emergency_contact_relationship"
                    value={formData.emergency_contact_relationship}
                    onChange={handleChange}
                    placeholder="e.g., Spouse, Parent, Sibling"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="submit"
                disabled={submitPreboardingForm.isPending}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                {submitPreboardingForm.isPending ? "Submitting..." : "Submit Form"}
              </Button>
            </div>
          </Card>
        </form>

        {/* Footer Note */}
        <Card className="mt-6 p-6 bg-gray-50 border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Privacy Notice:</strong> Your information will be handled in accordance with our privacy
            policy and will only be used for employment purposes.
          </p>
        </Card>
      </div>
    </div>
  );
}
