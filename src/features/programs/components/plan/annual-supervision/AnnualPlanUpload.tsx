"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormSelect from "@/components/FormSelectField";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Users,
  MapPin,
  Calendar,
  Target,
} from "lucide-react";

import {
  AnnualPlanUploadSchema,
  AnnualPlanUploadFormData,
  EXCEL_TEMPLATE_COLUMNS,
  UPLOAD_VALIDATION_RULES,
  IUploadValidationResult,
  IUploadProcessingResult,
} from "@/features/programs/types/annual-supervision-plan";

import {
  useCreateAnnualPlan,
  useDownloadExcelTemplate,
  useValidateExcelUpload,
} from "@/features/programs/controllers/annualSupervisionPlanController";

import { useGetAllFinancialYears } from "@/features/modules/controllers";
import { useGetAllUsers } from "@/features/auth/controllers/userController";

interface AnnualPlanUploadProps {
  onSuccess?: (result: IUploadProcessingResult) => void;
  onCancel?: () => void;
  editMode?: boolean;
  planId?: string | null;
}

const AnnualPlanUpload = ({ onSuccess, onCancel, editMode = false, planId }: AnnualPlanUploadProps) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<IUploadValidationResult | null>(null);
  const [showValidationDetails, setShowValidationDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch financial years
  const {
    data: financialYearsData,
    isLoading: isLoadingFinancialYears,
    error: financialYearsError
  } = useGetAllFinancialYears({
    page: 1,
    size: 100,
  });

  // Fetch users for workflow role assignments
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError
  } = useGetAllUsers({
    page: 1,
    size: 1000, // Get all users
  });

  // Mutations
  const createAnnualPlanMutation = useCreateAnnualPlan();
  const downloadTemplateMutation = useDownloadExcelTemplate();
  const validateUploadMutation = useValidateExcelUpload();

  // Form setup
  const form = useForm<AnnualPlanUploadFormData>({
    resolver: zodResolver(AnnualPlanUploadSchema),
    defaultValues: {
      financial_year_id: "",
      title: "",
      description: "",
      reviewer_id: "none",
      authorizer_id: "none",
      approver_id: "none",
    },
  });

  // Handle different possible response structures from backend
  const financialYears = financialYearsData?.results ||
                         (financialYearsData as any)?.data?.results ||
                         (Array.isArray((financialYearsData as any)?.data) ? (financialYearsData as any).data : []) ||
                         (Array.isArray(financialYearsData) ? financialYearsData : []);

  const users = usersData?.results ||
                (usersData as any)?.data?.results ||
                (Array.isArray((usersData as any)?.data) ? (usersData as any).data : []) ||
                (Array.isArray(usersData) ? usersData : []);

  // Convert users to dropdown options format
  const userOptions = [
    { label: "No reviewer assigned", value: "none" },
    ...(isLoadingUsers ?
       [{ label: "Loading users...", value: "loading" }] :
       users.length > 0 ?
       users.map((user: any) => ({
         label: user.full_name ||
                `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
                user.username ||
                `User ${user.id}`,
         value: user.id,
       })) :
       [{ label: "No users found", value: "no-data" }]
    )
  ];

  const authorizerOptions = [
    { label: "No authorizer assigned", value: "none" },
    ...(isLoadingUsers ?
       [{ label: "Loading users...", value: "loading" }] :
       users.length > 0 ?
       users.map((user: any) => ({
         label: user.full_name ||
                `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
                user.username ||
                `User ${user.id}`,
         value: user.id,
       })) :
       [{ label: "No users found", value: "no-data" }]
    )
  ];

  const approverOptions = [
    { label: "No approver assigned", value: "none" },
    ...(isLoadingUsers ?
       [{ label: "Loading users...", value: "loading" }] :
       users.length > 0 ?
       users.map((user: any) => ({
         label: user.full_name ||
                `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
                user.username ||
                `User ${user.id}`,
         value: user.id,
       })) :
       [{ label: "No users found", value: "no-data" }]
    )
  ];

  // Debug logging (can be removed in production)
  // console.log('🔍 DEBUG: Financial Years Data:', { count: financialYears.length, isLoading: isLoadingFinancialYears });
  // console.log('🔍 DEBUG: Users Data:', { count: users.length, isLoading: isLoadingUsers });

  // Log errors if any
  if (financialYearsError) {
    console.error('❌ Financial Years API Error:', financialYearsError);
  }

  if (usersError) {
    console.error('❌ Users API Error:', usersError);
  }

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setUploadFile(null);
      setValidationResult(null);
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadFile(file);
    form.setValue('upload_file', file);

    // Display file upload success (validation happens during creation)
    toast.success(`File selected: ${file.name}. Click "Create Annual Plan" to process and validate.`);

    // Clear any previous validation results
    setValidationResult(null);
  }, [form]);

  const handleDownloadTemplate = async () => {
    try {
      const result = await downloadTemplateMutation.mutateAsync();

      if (result.fallback) {
        toast.info(
          result.message ||
          "CSV template downloaded successfully. Open in Excel to edit and save as .xlsx when done.",
          { duration: 5000 }
        );
      } else {
        toast.success("Template downloaded successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to download template");
    }
  };

  // 🧪 TEST FUNCTION: Validate endpoint isolation
  const handleTestValidateOnly = async () => {
    if (!uploadFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      console.log('🧪 TESTING VALIDATE-UPLOAD ENDPOINT ONLY:');
      console.log('📁 File being validated:', {
        name: uploadFile.name,
        size: uploadFile.size,
        type: uploadFile.type
      });

      const result = await validateUploadMutation.mutateAsync(uploadFile);

      console.log('✅ VALIDATE ENDPOINT SUCCESS:', result);

      if (result.isValid) {
        toast.success(`✅ Validate endpoint works! Found ${result.validRowsCount} valid entries. Your backend validation is working!`);
      } else {
        toast.warning(`⚠️ Validate endpoint works but found validation issues: ${result.errors.length} errors`);
      }

      // Check for enhanced validation markers
      const hasEnhancedValidation = JSON.stringify(result).includes('[ENHANCED_VALIDATION]');
      console.log('🔍 Enhanced validation detected:', hasEnhancedValidation);

      if (hasEnhancedValidation) {
        toast.success('🎯 [ENHANCED_VALIDATION] markers found - your backend code IS working!');
      }

    } catch (error: any) {
      console.error('❌ VALIDATE ENDPOINT FAILED:', error);

      if (error.response?.status === 500) {
        toast.error('🚨 Validate endpoint also returns 500 - this is a Heroku/routing level issue!');
      } else if (error.response?.status === 405) {
        toast.warning('⚠️ Validate endpoint returns 405 - endpoint may not exist');
      } else {
        toast.error(`Validate endpoint error: ${error.message}`);
      }
    }
  };

  const handleSubmit = async (data: AnnualPlanUploadFormData) => {
    if (!uploadFile) {
      toast.error("Please select a file to upload");
      return;
    }

    // Prevent multiple submissions
    if (createAnnualPlanMutation.isPending || isSubmitting) {
      console.warn("⚠️ Preventing duplicate submission - already in progress");
      toast.info("Plan creation is already in progress...");
      return;
    }

    try {
      setIsSubmitting(true);

      // Debug file state before submission
      console.log("🔍 DEBUG: File state before submission:", {
        file: uploadFile,
        name: uploadFile?.name,
        size: uploadFile?.size,
        type: uploadFile?.type,
        lastModified: uploadFile?.lastModified
      });

      // Check if file is still readable
      if (uploadFile && uploadFile.size === 0) {
        throw new Error("File appears to be empty or corrupted. Please select the file again.");
      }

      console.log("🚀 Starting annual plan creation with validation...");
      toast.info("Processing file and creating annual plan, this may take a few minutes...", { duration: 5000 });

      const result = await createAnnualPlanMutation.mutateAsync({
        financial_year_id: data.financial_year_id,
        title: data.title,
        description: data.description,
        reviewer_id: data.reviewer_id === "none" ? undefined : data.reviewer_id,
        authorizer_id: data.authorizer_id === "none" ? undefined : data.authorizer_id,
        approver_id: data.approver_id === "none" ? undefined : data.approver_id,
        upload_file: uploadFile!,
      });

      console.log("✅ Annual plan created successfully!");
      toast.success("Annual plan created successfully!");

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error: any) {
      console.error("❌ Plan creation failed:", error);

      // Handle specific error types
      const responseData = error.response?.data;
      const errorMessage = responseData?.message || error.message;

      // Check for authentication errors first
      if (error.response?.status === 401 || responseData?.error_code === "not_authenticated") {
        toast.error(
          "Authentication failed. Please log out and log back in, then try again.",
          { duration: 8000 }
        );
        return;
      }

      // Check if this is the "Empty file" Django issue
      if (errorMessage?.includes("Empty file")) {
        toast.error(
          "File upload issue detected. This appears to be a backend configuration problem. " +
          "Please contact your system administrator to check Django file upload settings.",
          { duration: 8000 }
        );

        // Log detailed info for backend team
        console.error("🔧 BACKEND ISSUE: Django reports 'Empty file' but frontend file is valid:", {
          fileSize: uploadFile?.size,
          fileName: uploadFile?.name,
          fileType: uploadFile?.type,
          errorResponse: error.response?.data,
          suggestion: "Check Django settings: FILE_UPLOAD_MAX_MEMORY_SIZE, DATA_UPLOAD_MAX_MEMORY_SIZE, middleware configuration"
        });
        return;
      }

      // Check if error contains validation details
      const errorData = error.response?.data;
      if (errorData?.errors || errorData?.warnings) {
        // Show validation results on error
        const validationResult: IUploadValidationResult = {
          isValid: false,
          errors: errorData.errors || [],
          warnings: errorData.warnings || [],
          validRows: errorData.preview_data || [],
          invalidRows: [],
          totalRows: errorData.total_rows || 0,
          validRowsCount: errorData.valid_rows || 0,
          message: errorData.message || "File validation failed"
        };
        setValidationResult(validationResult);
        toast.error(`File validation failed. ${validationResult.validRowsCount} valid entries found.`);
      } else {
        toast.error(error.message || "Failed to create annual plan");
      }
    } finally {
      setIsSubmitting(false);
      console.log("🔄 Submission state reset");
    }
  };

  const getValidationIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle2 className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6" />
            Upload Annual Supervision Plan
          </CardTitle>
          <p className="text-gray-600">
            Upload your Excel file containing planned supervision visits for the fiscal year
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instructions */}
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Before uploading:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                <li>Download the Excel template using the button below</li>
                <li>Fill in your planned supervision visits</li>
                <li>Save the file and upload it here</li>
                <li>Review validation results before submitting</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Template Download */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium">Excel Template</h4>
                <p className="text-sm text-gray-600">
                  Download the template with required columns and sample data
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              disabled={downloadTemplateMutation.isPending}
              className="flex items-center gap-2"
            >
              {downloadTemplateMutation.isPending ? (
                <LoadingSpinner />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Download Template
            </Button>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Financial Year Selection */}
                <FormField
                  control={form.control}
                  name="financial_year_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Financial Year *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select financial year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingFinancialYears ? (
                            <SelectItem value="loading" disabled>
                              Loading financial years...
                            </SelectItem>
                          ) : financialYears.length > 0 ? (
                            financialYears.map((year: any) => (
                              <SelectItem key={year.id} value={year.id}>
                                {year.year || year.name || `FY ${year.id}`} {year.start_date && year.end_date ? `(${year.start_date} - ${year.end_date})` : ''}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-data" disabled>
                              {financialYearsData ? 'No financial years found' : 'Failed to load financial years. Please refresh the page.'}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Plan Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Title *</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="e.g., Annual Supervision Plan 2024-2025"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Brief description of the annual supervision plan objectives and scope..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Workflow Role Assignments */}
              <div className="space-y-4">
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Workflow Assignments (Optional)
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Assign users who will review, authorize, and approve this annual supervision plan.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Reviewer Selection */}
                    <FormSelect
                      name="reviewer_id"
                      label="Reviewer"
                      placeholder="Select reviewer"
                      options={userOptions}
                      searchPlaceholder="Search reviewers..."
                      emptyMessage="No reviewers found."
                      required={false}
                    />

                    {/* Authorizer Selection */}
                    <FormSelect
                      name="authorizer_id"
                      label="Authorizer"
                      placeholder="Select authorizer"
                      options={authorizerOptions}
                      searchPlaceholder="Search authorizers..."
                      emptyMessage="No authorizers found."
                      required={false}
                    />

                    {/* Approver Selection */}
                    <FormSelect
                      name="approver_id"
                      label="Approver"
                      placeholder="Select approver"
                      options={approverOptions}
                      searchPlaceholder="Search approvers..."
                      emptyMessage="No approvers found."
                      required={false}
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <FormLabel>Upload Excel File *</FormLabel>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          {uploadFile ? uploadFile.name : "Choose Excel file"}
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          or drag and drop (.xlsx, .xls files only)
                        </span>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                      />
                    </div>
                    {uploadFile && (
                      <div className="mt-2">
                        <Badge variant="outline">
                          {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Validation Results */}
              {validationResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getValidationIcon(validationResult?.isValid || false)}
                      Validation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {validationResult && (
                      <div className="space-y-4">
                        {/* Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded">
                            <div className="text-2xl font-bold text-blue-600">
                              {validationResult.totalRows}
                            </div>
                            <div className="text-sm text-blue-600">Total Rows</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded">
                            <div className="text-2xl font-bold text-green-600">
                              {validationResult.validRowsCount || 0}
                            </div>
                            <div className="text-sm text-green-600">Valid Rows</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded">
                            <div className="text-2xl font-bold text-red-600">
                              {validationResult.invalidRows?.length || 0}
                            </div>
                            <div className="text-sm text-red-600">Invalid Rows</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded">
                            <div className="text-2xl font-bold text-yellow-600">
                              {validationResult.warnings?.length || 0}
                            </div>
                            <div className="text-sm text-yellow-600">Warnings</div>
                          </div>
                        </div>

                        {/* Errors and Warnings */}
                        {(validationResult.errors?.length > 0 || validationResult.warnings?.length > 0) && (
                          <div className="space-y-3">
                            {validationResult.errors?.length > 0 && (
                              <Alert variant="destructive">
                                <XCircle className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>Errors:</strong>
                                  <ul className="list-disc list-inside mt-1">
                                    {validationResult.errors?.map((error, index) => (
                                      <li key={index} className="text-sm">{error}</li>
                                    ))}
                                  </ul>
                                </AlertDescription>
                              </Alert>
                            )}

                            {validationResult.warnings?.length > 0 && (
                              <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>Warnings:</strong>
                                  <ul className="list-disc list-inside mt-1">
                                    {validationResult.warnings?.map((warning, index) => (
                                      <li key={index} className="text-sm">{warning}</li>
                                    ))}
                                  </ul>
                                </AlertDescription>
                              </Alert>
                            )}

                            {validationResult.invalidRows?.length > 0 && (
                              <div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowValidationDetails(!showValidationDetails)}
                                >
                                  {showValidationDetails ? "Hide" : "Show"} Invalid Rows Details
                                </Button>

                                {showValidationDetails && (
                                  <div className="mt-3 max-h-60 overflow-y-auto border rounded p-3 bg-gray-50">
                                    {validationResult.invalidRows?.map((invalidRow, index) => (
                                      <div key={index} className="mb-2 p-2 bg-white rounded border">
                                        <div className="font-medium text-sm">Row {invalidRow.row}</div>
                                        <ul className="list-disc list-inside text-xs text-red-600 mt-1">
                                          {invalidRow.errors?.map((error, errorIndex) => (
                                            <li key={errorIndex}>{error}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}

                {/* 🧪 TEST BUTTON: Validate Endpoint Only */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleTestValidateOnly}
                  disabled={!uploadFile || validateUploadMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {validateUploadMutation.isPending ? (
                    <>
                      <LoadingSpinner />
                      Testing...
                    </>
                  ) : (
                    <>
                      🧪 Test Validate Only
                    </>
                  )}
                </Button>

                <Button
                  type="submit"
                  disabled={
                    createAnnualPlanMutation.isPending ||
                    isSubmitting ||
                    !uploadFile
                  }
                  className="flex items-center gap-2"
                >
                  {(createAnnualPlanMutation.isPending || isSubmitting) ? (
                    <>
                      <LoadingSpinner />
                      Processing... (This may take a few minutes)
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4" />
                      Create Annual Plan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Template Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Excel Template Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Required Columns</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    Location Name *
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    Visit Type *
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    Requires Evaluation *
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Optional Columns</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-3 w-3 p-0" />
                    Location Code
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-3 w-3 p-0" />
                    Facility Name
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-3 w-3 p-0" />
                    Preferred Quarter
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-3 w-3 p-0" />
                    Duration (Days)
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <h5 className="font-medium text-sm mb-2">Valid Values</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <strong>Visit Type:</strong> SUPPORTIVE_SUPERVISION, INTEGRATED_SUPPORTIVE_SUPERVISION
                </div>
                <div>
                  <strong>Requires Evaluation:</strong> YES, NO
                </div>
                <div>
                  <strong>Preferred Quarter:</strong> Q1, Q2, Q3, Q4
                </div>
                <div>
                  <strong>Duration:</strong> 1-30 days
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnualPlanUpload;