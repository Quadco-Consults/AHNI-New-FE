import Card from "components/Card";
import { Button } from "components/ui/button";
import { Upload, CreditCard } from "lucide-react";

export default function BankReconciliationPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bank Reconciliation</h1>
          <p className="text-gray-600">
            Import bank statements and reconcile transactions
          </p>
        </div>
        <Button>
          <Upload size={20} className="mr-2" />
          Import Statement
        </Button>
      </div>

      {/* Coming Soon Card */}
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
            <CreditCard className="text-teal-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold">Bank Reconciliation Coming Soon</h3>
          <p className="text-gray-600">
            The bank reconciliation system is under development.
            This will include statement import, auto-matching, and reconciliation workflows.
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