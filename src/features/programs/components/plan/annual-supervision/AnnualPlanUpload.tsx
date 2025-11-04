"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "components/ui/alert";
import { Textarea } from "components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { LoadingSpinner } from "components/Loading";
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
  useValidateExcelUpload,
  useDownloadExcelTemplate,
} from "@/features/programs/controllers/annualSupervisionPlanController";

import { useGetAllFinancialYears } from "@/features/modules/controllers";

interface AnnualPlanUploadProps {
  onSuccess?: (result: IUploadProcessingResult) => void;
  onCancel?: () => void;
}

const AnnualPlanUpload = ({ onSuccess, onCancel }: AnnualPlanUploadProps) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<IUploadValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showValidationDetails, setShowValidationDetails] = useState(false);

  // Fetch financial years
  const { data: financialYearsData, isLoading: isLoadingFinancialYears } = useGetAllFinancialYears({
    page: 1,
    size: 100,
  });

  // Mutations
  const createAnnualPlanMutation = useCreateAnnualPlan();
  const validateUploadMutation = useValidateExcelUpload();
  const downloadTemplateMutation = useDownloadExcelTemplate();

  // Form setup
  const form = useForm<AnnualPlanUploadFormData>({
    resolver: zodResolver(AnnualPlanUploadSchema),
    defaultValues: {
      financial_year_id: "",
      title: "",
      description: "",
    },
  });

  const financialYears = financialYearsData?.data?.results || [];

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

    // Auto-validate the file
    setIsValidating(true);
    try {
      const validation = await validateUploadMutation.mutateAsync(file);
      setValidationResult(validation);

      if (validation.isValid) {
        toast.success(`File validated successfully! ${validation.validRowsCount} valid entries found.`);
      } else {
        toast.warning(`File has validation issues. ${validation.validRowsCount} valid entries, ${validation.invalidRows.length} errors.`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to validate file");
      setValidationResult(null);
    } finally {
      setIsValidating(false);
    }
  }, [validateUploadMutation, form]);

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplateMutation.mutateAsync();
      toast.success("Template downloaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to download template");
    }
  };

  const handleSubmit = async (data: AnnualPlanUploadFormData) => {
    if (!validationResult?.isValid) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    try {
      const result = await createAnnualPlanMutation.mutateAsync({
        financial_year_id: data.financial_year_id,
        title: data.title,
        description: data.description,
        upload_file: uploadFile!,
      });

      toast.success("Annual plan created successfully!");

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create annual plan");
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
                            <SelectItem value="" disabled>
                              Loading financial years...
                            </SelectItem>
                          ) : (
                            financialYears.map((year: any) => (
                              <SelectItem key={year.id} value={year.id}>
                                {year.year} ({year.start_date} - {year.end_date})
                              </SelectItem>
                            ))
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
              {(isValidating || validationResult) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {isValidating ? (
                        <>
                          <LoadingSpinner />
                          Validating File...
                        </>
                      ) : (
                        <>
                          {getValidationIcon(validationResult?.isValid || false)}
                          Validation Results
                        </>
                      )}
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
                              {validationResult.validRowsCount}
                            </div>
                            <div className="text-sm text-green-600">Valid Rows</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded">
                            <div className="text-2xl font-bold text-red-600">
                              {validationResult.invalidRows.length}
                            </div>
                            <div className="text-sm text-red-600">Invalid Rows</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded">
                            <div className="text-2xl font-bold text-yellow-600">
                              {validationResult.warnings.length}
                            </div>
                            <div className="text-sm text-yellow-600">Warnings</div>
                          </div>
                        </div>

                        {/* Errors and Warnings */}
                        {(validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
                          <div className="space-y-3">
                            {validationResult.errors.length > 0 && (
                              <Alert variant="destructive">
                                <XCircle className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>Errors:</strong>
                                  <ul className="list-disc list-inside mt-1">
                                    {validationResult.errors.map((error, index) => (
                                      <li key={index} className="text-sm">{error}</li>
                                    ))}
                                  </ul>
                                </AlertDescription>
                              </Alert>
                            )}

                            {validationResult.warnings.length > 0 && (
                              <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>Warnings:</strong>
                                  <ul className="list-disc list-inside mt-1">
                                    {validationResult.warnings.map((warning, index) => (
                                      <li key={index} className="text-sm">{warning}</li>
                                    ))}
                                  </ul>
                                </AlertDescription>
                              </Alert>
                            )}

                            {validationResult.invalidRows.length > 0 && (
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
                                    {validationResult.invalidRows.map((invalidRow, index) => (
                                      <div key={index} className="mb-2 p-2 bg-white rounded border">
                                        <div className="font-medium text-sm">Row {invalidRow.row}</div>
                                        <ul className="list-disc list-inside text-xs text-red-600 mt-1">
                                          {invalidRow.errors.map((error, errorIndex) => (
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
                <Button
                  type="submit"
                  disabled={
                    createAnnualPlanMutation.isPending ||
                    !uploadFile ||
                    !validationResult?.isValid
                  }
                  className="flex items-center gap-2"
                >
                  {createAnnualPlanMutation.isPending ? (
                    <>
                      <LoadingSpinner />
                      Creating Plan...
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