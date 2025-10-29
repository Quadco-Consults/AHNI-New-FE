import Card from "components/Card";
import { Button } from "components/ui/button";
import { TrendingUp, Download } from "lucide-react";

export default function FinancialAnalysisPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Analysis</h1>
          <p className="text-gray-600">
            Analyze financial performance and integration health
          </p>
        </div>
        <Button>
          <Download size={20} className="mr-2" />
          Export Analysis
        </Button>
      </div>

      {/* Coming Soon Card */}
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
            <TrendingUp className="text-pink-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold">Financial Analysis Coming Soon</h3>
          <p className="text-gray-600">
            Advanced financial analysis and reporting is under development.
            This will include trend analysis, performance metrics, and predictive insights.
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