"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BreadcrumbCard from "components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { ArrowLeft, Calendar, Target, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import AnnualPlanUpload from "@/features/programs/components/plan/annual-supervision/AnnualPlanUpload";

const CreateAnnualSupervisionPlanPage = () => {
  const router = useRouter();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Annual Supervision Plan", icon: true },
    { name: "Create Plan", icon: false },
  ];

  const handleUploadSuccess = () => {
    setUploadDialogOpen(false);
    router.push("/dashboard/programs/plan/annual-supervision");
  };

  const handleGoBack = () => {
    router.push("/dashboard/programs/plan/annual-supervision");
  };

  return (
    <div className="p-6">
      <BreadcrumbCard list={breadcrumbs} />

      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Annual Supervision Plan</h1>
            <p className="text-gray-600 mt-1">
              Create a new annual supervision plan for systematic supervision visits
            </p>
          </div>
        </div>

        {/* Creation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bulk Upload Option */}
          <Card className="border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Bulk Upload from Excel</CardTitle>
              <p className="text-gray-600">
                Upload multiple planned visits at once using an Excel template
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  <p>✓ Fast for multiple locations</p>
                  <p>✓ Template with validation</p>
                  <p>✓ Bulk data import</p>
                </div>

                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Excel File
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Upload Annual Supervision Plan</DialogTitle>
                      <DialogDescription>
                        Upload an Excel file containing your annual supervision plan data
                      </DialogDescription>
                    </DialogHeader>
                    <AnnualPlanUpload onSuccess={handleUploadSuccess} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Manual Creation Option */}
          <Card className="border-2 border-dashed border-green-300 hover:border-green-500 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Manual Planning</CardTitle>
              <p className="text-gray-600">
                Create and configure your annual plan step by step
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  <p>✓ Step-by-step guidance</p>
                  <p>✓ Interactive planning</p>
                  <p>✓ Flexible configuration</p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    router.push("/dashboard/programs/plan/annual-supervision/create/manual");
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Start Manual Planning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Planning Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Excel Upload Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Download the template first</li>
                  <li>• Fill in all required columns</li>
                  <li>• Use valid location names</li>
                  <li>• Specify visit types correctly</li>
                  <li>• Save as .xlsx or .xls format</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Visit Types</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>SUPPORTIVE_SUPERVISION:</strong> Regular supervisory visits</li>
                  <li>• <strong>INTEGRATED_SUPPORTIVE_SUPERVISION:</strong> Multi-program visits</li>
                </ul>

                <h4 className="font-medium mb-2 mt-4">Evaluation Options</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>YES:</strong> Visit requires evaluation</li>
                  <li>• <strong>NO:</strong> Visit is informational only</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAnnualSupervisionPlanPage;