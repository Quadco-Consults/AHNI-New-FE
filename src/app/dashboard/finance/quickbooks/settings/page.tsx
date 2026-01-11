import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Settings, Zap } from "lucide-react";

export default function QuickBooksSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QuickBooks Settings</h1>
          <p className="text-gray-600">
            Configure QuickBooks integration and sync settings
          </p>
        </div>
        <Button>
          <Zap size={20} className="mr-2" />
          Connect QuickBooks
        </Button>
      </div>

      {/* Coming Soon Card */}
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Settings className="text-gray-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold">QuickBooks Integration Coming Soon</h3>
          <p className="text-gray-600">
            The QuickBooks integration interface is under development.
            This will include OAuth authentication, entity mapping, and sync configuration.
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