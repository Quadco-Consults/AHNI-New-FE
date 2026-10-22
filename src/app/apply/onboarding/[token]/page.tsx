"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useGetOnboardingForm,
  useSubmitOnboardingForm,
} from "@/features/hr/controllers/publicJobApplicationController";
import { Loading } from "@/components/Loading";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, User, Mail, Phone, Building2, Heart, GraduationCap, Briefcase, CreditCard } from "lucide-react";

export default function PublicOnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const [formData, setFormData] = useState({
    // Personal Information
    legal_firstname: "",
    legal_middlename: "",
    legal_lastname: "",
    date_of_birth: "",
    marital_status: "",
    gender: "",

    // Contact Information
    email: "",
    phone_number: "",
    other_number: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",

    // Identity Documents
    ss_number: "",
    nin_number: "",
    tax_id: "",
    passport_number: "",

    // Emergency Contact
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
    emergency_contact_address: "",

    // Banking Information
    bank_name: "",
    account_number: "",
    account_name: "",
    bvn: "",

    // Educational Background
    highest_qualification: "",
    institution: "",
    course_of_study: "",
    graduation_year: "",

    // Previous Employment
    previous_employer: "",
    previous_position: "",
    years_of_experience: "",

    // Health Information
    blood_group: "",
    genotype: "",
    medical_conditions: "",
    allergies: "",

    // Next of Kin
    nok_name: "",
    nok_relationship: "",
    nok_phone: "",
    nok_address: "",

    // Professional Details
    professional_certifications: "",
    professional_memberships: "",

    // System Requirements
    own_computer: false,
    require_email_access: true,
  });

  const [employeeData, setEmployeeData] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);

  const getOnboardingForm = useGetOnboardingForm(token);
  const submitOnboardingForm = useSubmitOnboardingForm(token);

  // Fetch onboarding form data on mount
  useEffect(() => {
    if (token) {
      getOnboardingForm.mutate(undefined, {
        onSuccess: (response) => {
          const data = response.data;
          setEmployeeData(data);

          // Pre-fill form with existing data
          setFormData((prev) => ({
            ...prev,
            legal_firstname: data.employee.legal_firstname || "",
            legal_middlename: data.employee.legal_middlename || "",
            legal_lastname: data.employee.legal_lastname || "",
            email: data.employee.email || "",
            phone_number: data.employee.phone_number || "",
            address: data.employee.address || "",
            ...data.existing_data,
          }));
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to load onboarding form");
        },
      });
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.legal_firstname || !formData.legal_lastname || !formData.email || !formData.phone_number) {
      toast.error("Please fill in all required fields");
      return;
    }

    submitOnboardingForm.mutate(formData, {
      onSuccess: (response) => {
        toast.success(response.message || "Onboarding form submitted successfully!");
        setSubmitted(true);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || "Failed to submit onboarding form");
      },
    });
  };

  // Loading state
  if (getOnboardingForm.isPending) {
    return <Loading />;
  }

  // Error state
  if (getOnboardingForm.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-bold text-red-600">Invalid Link</h2>
          </div>
          <p className="text-gray-600 mb-4">
            The onboarding link is invalid or has expired. Please contact HR for assistance.
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
              Welcome to AHNI!
            </h2>
            <p className="text-gray-600 mb-6">
              Your onboarding form has been submitted successfully. Our HR team will review your
              information and complete the final setup.
            </p>
            <div className="w-full space-y-2 mb-6">
              <div className="text-sm text-left space-y-1">
                <p className="font-medium text-gray-700">What happens next:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>HR will review your information</li>
                  <li>You'll receive your system login credentials via email</li>
                  <li>Welcome to the AHNI team!</li>
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Onboarding Form</h1>
          <p className="text-gray-600">
            Position: <span className="font-semibold">{employeeData?.position}</span>
          </p>
          {employeeData?.department && (
            <p className="text-sm text-gray-500 mt-1">
              Department: {employeeData.department} | Location: {employeeData.location}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Fields marked with * are required
          </p>
        </div>

        {/* Instructions Card */}
        {employeeData?.instructions && (
          <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">Important Instructions</h3>
            <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
              {employeeData.instructions.map((instruction: string, index: number) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </Card>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="legal_firstname">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="legal_firstname"
                  name="legal_firstname"
                  value={formData.legal_firstname}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="legal_middlename">Middle Name</Label>
                <Input
                  id="legal_middlename"
                  name="legal_middlename"
                  value={formData.legal_middlename}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="legal_lastname">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="legal_lastname"
                  name="legal_lastname"
                  value={formData.legal_lastname}
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
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => handleSelectChange("gender", value)} value={formData.gender}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="marital_status">Marital Status</Label>
                <Select onValueChange={(value) => handleSelectChange("marital_status", value)} value={formData.marital_status}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
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
                <Label htmlFor="phone_number">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="other_number">Alternative Phone</Label>
                <Input
                  id="other_number"
                  name="other_number"
                  type="tel"
                  value={formData.other_number}
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
                  rows={2}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Identity Documents */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Identity Documents</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nin_number">NIN Number</Label>
                <Input
                  id="nin_number"
                  name="nin_number"
                  value={formData.nin_number}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ss_number">Social Security Number</Label>
                <Input
                  id="ss_number"
                  name="ss_number"
                  value={formData.ss_number}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="tax_id">Tax ID</Label>
                <Input
                  id="tax_id"
                  name="tax_id"
                  value={formData.tax_id}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="passport_number">Passport Number</Label>
                <Input
                  id="passport_number"
                  name="passport_number"
                  value={formData.passport_number}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Banking Information */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Banking Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input
                  id="bank_name"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="account_number">Account Number</Label>
                <Input
                  id="account_number"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="account_name">Account Name</Label>
                <Input
                  id="account_name"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bvn">BVN</Label>
                <Input
                  id="bvn"
                  name="bvn"
                  value={formData.bvn}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Educational Background */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Educational Background</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="highest_qualification">Highest Qualification</Label>
                <Input
                  id="highest_qualification"
                  name="highest_qualification"
                  value={formData.highest_qualification}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="course_of_study">Course of Study</Label>
                <Input
                  id="course_of_study"
                  name="course_of_study"
                  value={formData.course_of_study}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="graduation_year">Graduation Year</Label>
                <Input
                  id="graduation_year"
                  name="graduation_year"
                  value={formData.graduation_year}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Previous Employment */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Previous Employment</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="previous_employer">Previous Employer</Label>
                <Input
                  id="previous_employer"
                  name="previous_employer"
                  value={formData.previous_employer}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="previous_position">Previous Position</Label>
                <Input
                  id="previous_position"
                  name="previous_position"
                  value={formData.previous_position}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="years_of_experience">Years of Experience</Label>
                <Input
                  id="years_of_experience"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Health Information */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Health Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="blood_group">Blood Group</Label>
                <Select onValueChange={(value) => handleSelectChange("blood_group", value)} value={formData.blood_group}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="genotype">Genotype</Label>
                <Select onValueChange={(value) => handleSelectChange("genotype", value)} value={formData.genotype}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select genotype" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AA">AA</SelectItem>
                    <SelectItem value="AS">AS</SelectItem>
                    <SelectItem value="AC">AC</SelectItem>
                    <SelectItem value="SS">SS</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="medical_conditions">Medical Conditions (if any)</Label>
                <Textarea
                  id="medical_conditions"
                  name="medical_conditions"
                  value={formData.medical_conditions}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="allergies">Allergies (if any)</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Phone className="h-5 w-5 text-red-600" />
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
              <div className="md:col-span-2">
                <Label htmlFor="emergency_contact_address">Contact Address</Label>
                <Textarea
                  id="emergency_contact_address"
                  name="emergency_contact_address"
                  value={formData.emergency_contact_address}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Next of Kin */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Next of Kin</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nok_name">Name</Label>
                <Input
                  id="nok_name"
                  name="nok_name"
                  value={formData.nok_name}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="nok_relationship">Relationship</Label>
                <Input
                  id="nok_relationship"
                  name="nok_relationship"
                  value={formData.nok_relationship}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="nok_phone">Phone Number</Label>
                <Input
                  id="nok_phone"
                  name="nok_phone"
                  type="tel"
                  value={formData.nok_phone}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="nok_address">Address</Label>
                <Textarea
                  id="nok_address"
                  name="nok_address"
                  value={formData.nok_address}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Professional Details */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Professional Details</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="professional_certifications">Professional Certifications</Label>
                <Textarea
                  id="professional_certifications"
                  name="professional_certifications"
                  value={formData.professional_certifications}
                  onChange={handleChange}
                  placeholder="List any professional certifications you hold"
                  rows={2}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="professional_memberships">Professional Memberships</Label>
                <Textarea
                  id="professional_memberships"
                  name="professional_memberships"
                  value={formData.professional_memberships}
                  onChange={handleChange}
                  placeholder="List any professional organizations you belong to"
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* System Requirements */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">System Requirements</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="own_computer"
                  checked={formData.own_computer}
                  onCheckedChange={(checked) => handleCheckboxChange("own_computer", checked as boolean)}
                />
                <label htmlFor="own_computer" className="text-sm font-medium cursor-pointer">
                  I own a computer
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="require_email_access"
                  checked={formData.require_email_access}
                  onCheckedChange={(checked) => handleCheckboxChange("require_email_access", checked as boolean)}
                />
                <label htmlFor="require_email_access" className="text-sm font-medium cursor-pointer">
                  I require email access
                </label>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="submit"
              disabled={submitOnboardingForm.isPending}
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              {submitOnboardingForm.isPending ? "Submitting..." : "Submit Onboarding Form"}
            </Button>
          </div>
        </form>

        {/* Footer Note */}
        <Card className="mt-6 p-6 bg-gray-50 border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Privacy Notice:</strong> Your information will be handled in accordance with our privacy
            policy and will only be used for employment and HR purposes. All data is securely stored and
            accessible only to authorized HR personnel.
          </p>
        </Card>
      </div>
    </div>
  );
}
