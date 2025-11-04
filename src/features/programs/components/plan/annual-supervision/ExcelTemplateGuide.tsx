"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Info,
  MapPin,
  Calendar,
  Users,
  Target,
  Clock,
  FileText,
} from "lucide-react";
import {
  EXCEL_TEMPLATE_COLUMNS,
  UPLOAD_VALIDATION_RULES,
  Quarter,
  QuarterLabels,
} from "@/features/programs/types/annual-supervision-plan";
import { useDownloadExcelTemplate } from "@/features/programs/controllers/annualSupervisionPlanController";
import { toast } from "sonner";

interface ExcelTemplateGuideProps {
  standalone?: boolean;
}

export default function ExcelTemplateGuide({ standalone = false }: ExcelTemplateGuideProps) {
  const downloadTemplateMutation = useDownloadExcelTemplate();

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplateMutation.mutateAsync();
      toast.success("Template downloaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to download template");
    }
  };

  const ComponentWrapper = standalone ? "div" : React.Fragment;

  return (
    <ComponentWrapper className={standalone ? "max-w-5xl mx-auto p-6 space-y-6" : ""}>
      {standalone && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Excel Template Guide</h1>
          <p className="text-gray-600 mt-2">
            Complete guide for preparing your annual supervision plan Excel file
          </p>
        </div>
      )}

      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Download Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium">Annual Supervision Plan Template</h4>
                <p className="text-sm text-gray-600">
                  Pre-formatted Excel template with all required columns and sample data
                </p>
              </div>
            </div>
            <Button
              onClick={handleDownloadTemplate}
              disabled={downloadTemplateMutation.isPending}
              className="flex items-center gap-2"
            >
              {downloadTemplateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Template
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                1
              </div>
              <div>
                <h4 className="font-medium">Download the Template</h4>
                <p className="text-sm text-gray-600">
                  Click the download button above to get the pre-formatted Excel template
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                2
              </div>
              <div>
                <h4 className="font-medium">Fill in Your Data</h4>
                <p className="text-sm text-gray-600">
                  Replace the sample data with your actual planned supervision visits
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                3
              </div>
              <div>
                <h4 className="font-medium">Validate Your Data</h4>
                <p className="text-sm text-gray-600">
                  Ensure all required fields are filled and follow the specified formats
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                4
              </div>
              <div>
                <h4 className="font-medium">Save and Upload</h4>
                <p className="text-sm text-gray-600">
                  Save your Excel file and upload it through the annual plan upload form
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Column Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Column Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {EXCEL_TEMPLATE_COLUMNS.map((column) => (
              <div key={column.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium flex items-center gap-2">
                    {column.header}
                    {column.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    Width: {column.width} chars
                  </Badge>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  {/* Column-specific guidance */}
                  {column.key === 'location_name' && (
                    <div className="space-y-1">
                      <p>The exact name of the location/district as it appears in the system.</p>
                      <Alert>
                        <MapPin className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Must match existing locations in AHNI system for automatic matching
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {column.key === 'location_code' && (
                    <p>Optional code for the location (helps with matching if location names are similar)</p>
                  )}

                  {column.key === 'facility_name' && (
                    <div className="space-y-1">
                      <p>Name of specific facility within the location (if applicable)</p>
                      <p className="text-xs text-gray-500">
                        Leave blank for general location visits
                      </p>
                    </div>
                  )}

                  {column.key === 'facility_code' && (
                    <p>Optional facility code for precise identification</p>
                  )}

                  {column.key === 'visit_type' && (
                    <div className="space-y-2">
                      <p>Type of supervision visit to be conducted</p>
                      <div className="flex flex-wrap gap-2">
                        {UPLOAD_VALIDATION_RULES.visit_type.map(type => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {column.key === 'requires_evaluation' && (
                    <div className="space-y-2">
                      <p>Whether this visit requires post-supervision evaluation</p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">YES</Badge>
                        <Badge variant="outline" className="text-xs">NO</Badge>
                      </div>
                    </div>
                  )}

                  {column.key === 'preferred_quarter' && (
                    <div className="space-y-2">
                      <p>Preferred quarter for conducting the visit</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(QuarterLabels).map(([key, label]) => (
                          <Badge key={key} variant="outline" className="text-xs justify-center">
                            {key}: {label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {column.key === 'estimated_duration_days' && (
                    <div className="space-y-1">
                      <p>Expected number of days for the supervision visit</p>
                      <p className="text-xs text-gray-500">
                        Range: {UPLOAD_VALIDATION_RULES.min_duration_days} - {UPLOAD_VALIDATION_RULES.max_duration_days} days
                      </p>
                    </div>
                  )}

                  {column.key === 'special_focus_areas' && (
                    <div className="space-y-1">
                      <p>Specific areas or programs to focus on during the visit</p>
                      <p className="text-xs text-gray-500">
                        e.g., "Data Quality, Service Delivery, Financial Management"
                      </p>
                    </div>
                  )}

                  {column.key === 'comments' && (
                    <div className="space-y-1">
                      <p>Additional notes or special instructions for the visit</p>
                      <p className="text-xs text-gray-500">
                        Optional field for any relevant information
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Validation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Data Validation Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Required Fields</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Location Name must not be empty</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Visit Type must be valid value</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Requires Evaluation must be YES or NO</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Format Rules</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span>Quarter: Q1, Q2, Q3, or Q4 only</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span>Duration: Numbers only (1-30)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span>Text fields: No special characters like quotes</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Common Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Location Not Found:</strong> Ensure location names exactly match those in the AHNI system. Check for extra spaces, different spellings, or case sensitivity.
              </AlertDescription>
            </Alert>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Invalid Visit Type:</strong> Use only the exact values: SUPPORTIVE_SUPERVISION or INTEGRATED_SUPPORTIVE_SUPERVISION (with underscores).
              </AlertDescription>
            </Alert>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Quarter Format:</strong> Use Q1, Q2, Q3, or Q4 only. Do not use "Quarter 1" or "1st Quarter".
              </AlertDescription>
            </Alert>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Duration Issues:</strong> Enter only numbers for duration (e.g., "5" not "5 days"). Range must be 1-30.
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Excel Format:</strong> Save your file as .xlsx or .xls format. CSV files are not supported.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Data Preparation</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Review all location names against the AHNI location database</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Double-check visit types and ensure consistency</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Plan duration realistically based on location and scope</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Quality Control</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Remove empty rows from your Excel file</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Use data validation in Excel to prevent errors</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Test upload with a small sample first</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sample Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-3 py-2 text-left">Location Name</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Visit Type</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Evaluation</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Quarter</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Kampala Central</td>
                  <td className="border border-gray-300 px-3 py-2">SUPPORTIVE_SUPERVISION</td>
                  <td className="border border-gray-300 px-3 py-2">YES</td>
                  <td className="border border-gray-300 px-3 py-2">Q1</td>
                  <td className="border border-gray-300 px-3 py-2">3</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Mukono District</td>
                  <td className="border border-gray-300 px-3 py-2">INTEGRATED_SUPPORTIVE_SUPERVISION</td>
                  <td className="border border-gray-300 px-3 py-2">NO</td>
                  <td className="border border-gray-300 px-3 py-2">Q2</td>
                  <td className="border border-gray-300 px-3 py-2">2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </ComponentWrapper>
  );
}