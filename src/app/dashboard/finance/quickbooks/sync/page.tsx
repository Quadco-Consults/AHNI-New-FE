import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Activity } from "lucide-react";

export default function QuickBooksSyncPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QuickBooks Sync Monitor</h1>
          <p className="text-gray-600">
            Monitor synchronization status and resolve sync issues
          </p>
        </div>
        <Button>
          <RefreshCw size={20} className="mr-2" />
          Start Sync
        </Button>
      </div>

      {/* Coming Soon Card */}
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Activity className="text-blue-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold">QuickBooks Sync Monitor Coming Soon</h3>
          <p className="text-gray-600">
            The sync monitoring interface is under development.
            This will include real-time sync status, error logs, and manual sync controls.
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