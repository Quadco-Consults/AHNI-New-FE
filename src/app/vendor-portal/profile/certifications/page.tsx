"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  Download,
  Check,
  X,
  AlertCircle,
  Calendar,
  Building2,
  Award,
  Plus,
  Trash2
} from "lucide-react";
import { useVendorProfile } from "@/features/vendor-portal/controllers/vendorAuthController";
import { LoadingSpinner } from "@/components/Loading";

interface Certification {
  id: string;
  name: string;
  issuing_authority: string;
  issue_date: string;
  expiry_date: string;
  status: 'VALID' | 'EXPIRED' | 'PENDING_VERIFICATION';
  document_url?: string;
}

export default function VendorCertificationsPage() {
  const { data: vendorProfile, isLoading } = useVendorProfile();
  const [uploading, setUploading] = useState(false);

  // Mock certifications data - this would come from API
  const [certifications] = useState<Certification[]>([
    {
      id: "1",
      name: "ISO 9001:2015 Quality Management",
      issuing_authority: "ISO Certification Body",
      issue_date: "2023-01-15",
      expiry_date: "2026-01-15",
      status: "VALID",
      document_url: "#"
    },
    {
      id: "2",
      name: "Nigerian Content Development Certificate",
      issuing_authority: "NCDMB",
      issue_date: "2022-06-20",
      expiry_date: "2025-06-20",
      status: "VALID",
      document_url: "#"
    }
  ]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'VALID':
        return 'default';
      case 'EXPIRED':
        return 'destructive';
      case 'PENDING_VERIFICATION':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const threMonthsFromNow = new Date();
    threMonthsFromNow.setMonth(now.getMonth() + 3);
    return expiry <= threMonthsFromNow && expiry > now;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      // Simulate upload process
      setTimeout(() => {
        setUploading(false);
        // Handle successful upload here
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading certifications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Certifications & Documents</h1>
        <p className="text-gray-600 mt-1">
          Manage your company certifications and compliance documents
        </p>
      </div>

      {/* Required Documents Alert */}
      <Alert>
        <Award className="h-4 w-4" />
        <AlertDescription>
          <strong>Required Documents:</strong> Business Registration Certificate, Tax Clearance,
          and relevant industry certifications are mandatory for RFQ participation.
        </AlertDescription>
      </Alert>

      {/* Upload New Certification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Upload New Certification
          </CardTitle>
          <CardDescription>
            Add a new certification or compliance document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="cert-name">Certification Name</Label>
                <Input id="cert-name" placeholder="e.g., ISO 9001:2015" />
              </div>
              <div>
                <Label htmlFor="issuing-authority">Issuing Authority</Label>
                <Input id="issuing-authority" placeholder="e.g., ISO Certification Body" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issue-date">Issue Date</Label>
                  <Input id="issue-date" type="date" />
                </div>
                <div>
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input id="expiry-date" type="date" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="document">Document File</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full" disabled={uploading}>
                {uploading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Certification
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Certifications */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Current Certifications</h2>

        {certifications.map((cert) => (
          <Card key={cert.id} className={`${
            cert.status === 'EXPIRED' ? 'border-red-200 bg-red-50' :
            isExpiringSoon(cert.expiry_date) ? 'border-yellow-200 bg-yellow-50' :
            'border-green-200 bg-green-50'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {cert.name}
                    </h3>
                    <Badge variant={getStatusBadgeVariant(cert.status)} className="ml-auto">
                      {cert.status === 'VALID' ? 'Valid' :
                       cert.status === 'EXPIRED' ? 'Expired' : 'Pending Verification'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Issuing Authority</Label>
                      <p className="text-sm text-gray-900">{cert.issuing_authority}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Issue Date</Label>
                      <p className="text-sm text-gray-900 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(cert.issue_date)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Expiry Date</Label>
                      <p className={`text-sm flex items-center gap-1 ${
                        cert.status === 'EXPIRED' ? 'text-red-600' :
                        isExpiringSoon(cert.expiry_date) ? 'text-yellow-600' :
                        'text-gray-900'
                      }`}>
                        <Calendar className="h-3 w-3" />
                        {formatDate(cert.expiry_date)}
                        {isExpiringSoon(cert.expiry_date) && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Expires Soon
                          </Badge>
                        )}
                      </p>
                    </div>
                  </div>

                  {cert.status === 'EXPIRED' && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This certification has expired. Please upload a renewed certificate to maintain compliance.
                      </AlertDescription>
                    </Alert>
                  )}

                  {isExpiringSoon(cert.expiry_date) && cert.status === 'VALID' && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This certification expires within 3 months. Consider renewing soon to avoid interruptions.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {cert.document_url && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-1" />
                    Replace
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Status</CardTitle>
          <CardDescription>
            Your compliance status for RFQ participation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Valid Certifications</h3>
              <p className="text-2xl font-bold text-green-600">
                {certifications.filter((c: any) => c.status === 'VALID').length}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-medium text-gray-900">Expiring Soon</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {certifications.filter((c: any) => isExpiringSoon(c.expiry_date)).length}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-medium text-gray-900">Expired</h3>
              <p className="text-2xl font-bold text-red-600">
                {certifications.filter((c: any) => c.status === 'EXPIRED').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}