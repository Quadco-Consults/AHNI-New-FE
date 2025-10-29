import Card from "components/Card";
import { Button } from "components/ui/button";
import { BarChart3, Download } from "lucide-react";

export default function FinancialReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-gray-600">
            Generate and export financial statements and analysis reports
          </p>
        </div>
        <Button>
          <Download size={20} className="mr-2" />
          Export Reports
        </Button>
      </div>

      {/* Coming Soon Card */}
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <BarChart3 className="text-orange-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold">Financial Reports Coming Soon</h3>
          <p className="text-gray-600">
            Comprehensive financial reporting is under development.
            This will include trial balance, income statement, balance sheet, and custom reports.
          </p>
          <div className="flex justify-center space-x-2">
            <Button variant="outline">View Documentation</Button>
            <Button>Request Demo</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}