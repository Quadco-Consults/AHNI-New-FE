"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  User,
  Building2,
  CreditCard
} from "lucide-react";
import { useConsultantProfile } from "@/features/consultant-portal/controllers/consultantAuthController";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";
import { useUpdateConsultantProfile } from "@/features/consultant-portal/controllers/consultantProfileController";

export default function EditConsultantProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading, error } = useConsultantProfile();
  const updateProfile = useUpdateConsultantProfile();

  const [formData, setFormData] = useState({
    surname: '',
    other_names: '',
    state_of_origin: '',
    qualifications: '',
    account_name: '',
    bank_name: '',
    account_number: '',
    sort_code: '',
    tax_identification_number: '',
  });

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFormData({
        surname: profile.surname || '',
        other_names: profile.other_names || '',
        state_of_origin: profile.state_of_origin || '',
        qualifications: profile.qualifications || '',
        account_name: profile.account_name || '',
        bank_name: profile.bank_name || '',
        account_number: profile.account_number || '',
        sort_code: profile.sort_code || '',
        tax_identification_number: profile.tax_identification_number || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile.mutate(formData, {
      onSuccess: () => {
        toast.success("Profile updated successfully!");
        router.push('/consultant-portal/profile');
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "Failed to update profile. Please try again.";
        toast.error(errorMessage);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load profile. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="text-gray-600 mt-1">Update your profile information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="surname">Surname *</Label>
                <Input
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="other_names">Other Names *</Label>
                <Input
                  id="other_names"
                  name="other_names"
                  value={formData.other_names}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state_of_origin">State of Origin *</Label>
                <Input
                  id="state_of_origin"
                  name="state_of_origin"
                  value={formData.state_of_origin}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="qualifications">Qualifications *</Label>
              <Textarea
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., BSc Computer Science, MSc Software Engineering"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Banking Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Banking Information
            </CardTitle>
            <CardDescription>
              Update your banking details for payment processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="account_name">Account Name *</Label>
                <Input
                  id="account_name"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="bank_name">Bank Name *</Label>
                <Input
                  id="bank_name"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="account_number">Account Number *</Label>
                <Input
                  id="account_number"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                  required
                  maxLength={10}
                />
              </div>
              <div>
                <Label htmlFor="sort_code">Sort Code</Label>
                <Input
                  id="sort_code"
                  name="sort_code"
                  value={formData.sort_code}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="tax_identification_number">Tax Identification Number (TIN) *</Label>
                <Input
                  id="tax_identification_number"
                  name="tax_identification_number"
                  value={formData.tax_identification_number}
                  onChange={handleChange}
                  required
                  placeholder="Enter your TIN"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Information Notice */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">Contract Information</div>
            <p className="text-sm">
              Contract details (start date, end date, monthly pay) cannot be updated directly.
              Please contact HR at <a href="mailto:hr@ahni.org" className="underline font-semibold">hr@ahni.org</a> to update contract information.
            </p>
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={updateProfile.isPending}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={updateProfile.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
