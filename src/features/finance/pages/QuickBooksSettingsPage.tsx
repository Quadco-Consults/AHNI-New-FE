"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  Settings,
  RefreshCw,
  CheckCircle,
  Download,
  Upload,
  BarChart,
  FileText,
  Users,
  Building2
} from "lucide-react";
import { toast } from "sonner";
import QuickBooksConnectionWidget from "../components/quickbooks/QuickBooksConnectionWidget";

export default function QuickBooksSettingsPage() {
  const [syncHistory] = useState([
    {
      id: 1,
      action: "Chart of Accounts Sync",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      status: "success",
      details: "45 accounts synchronized"
    },
    {
      id: 2,
      action: "Journal Entries Export",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: "success",
      details: "12 journal entries exported"
    },
    {
      id: 3,
      action: "Customer Data Import",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      status: "warning",
      details: "23 customers imported, 2 duplicates found"
    },
    {
      id: 4,
      action: "Vendor Data Sync",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "success",
      details: "18 vendors synchronized"
    },
    {
      id: 5,
      action: "Budget Data Export",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: "error",
      details: "Failed: Invalid account mapping"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <RefreshCw className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <RefreshCw className="w-4 h-4 text-red-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QuickBooks Integration</h1>
          <p className="text-gray-600">
            Configure and manage your QuickBooks Online integration
          </p>
        </div>
      </div>

      <Tabs defaultValue="connection" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="data-management">Data Management</TabsTrigger>
          <TabsTrigger value="reports">Sync Reports</TabsTrigger>
          <TabsTrigger value="history">Sync History</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-4">
          <QuickBooksConnectionWidget />
        </TabsContent>

        <TabsContent value="data-management" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Chart of Accounts */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Chart of Accounts</h3>
                    <p className="text-sm text-gray-600">45 accounts synced</p>
                  </div>
                </div>

                <p className="text-gray-600">
                  Synchronize account structures between AHNI and QuickBooks for consistent financial reporting.
                </p>

                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Import from QuickBooks
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Export to QuickBooks
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Mapping
                  </Button>
                </div>
              </div>
            </Card>

            {/* Journal Entries */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Journal Entries</h3>
                    <p className="text-sm text-gray-600">12 pending export</p>
                  </div>
                </div>

                <p className="text-gray-600">
                  Automatically create journal entries in QuickBooks from AHNI financial transactions.
                </p>

                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Export Pending Entries
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Auto-Export Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    View Export Log
                  </Button>
                </div>
              </div>
            </Card>

            {/* Customers & Vendors */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Customers & Vendors</h3>
                    <p className="text-sm text-gray-600">67 contacts synced</p>
                  </div>
                </div>

                <p className="text-gray-600">
                  Synchronize customer and vendor information for consistent contact management.
                </p>

                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Import Customers
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Import Vendors
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Sync Settings
                  </Button>
                </div>
              </div>
            </Card>

            {/* Project Classes */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Project Classes</h3>
                    <p className="text-sm text-gray-600">15 classes mapped</p>
                  </div>
                </div>

                <p className="text-gray-600">
                  Map AHNI projects to QuickBooks classes for detailed project-based financial tracking.
                </p>

                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Map Projects to Classes
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Export Project Data
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Project Reports
                  </Button>
                </div>
              </div>
            </Card>

            {/* Budget Integration */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <BarChart className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Budget Integration</h3>
                    <p className="text-sm text-gray-600">8 budgets exported</p>
                  </div>
                </div>

                <p className="text-gray-600">
                  Export AHNI budget data to QuickBooks for comprehensive financial planning and tracking.
                </p>

                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Export Budget Lines
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Export FCO Budgets
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Budget Mapping
                  </Button>
                </div>
              </div>
            </Card>

            {/* Cost Categories */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Settings className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Cost Categories</h3>
                    <p className="text-sm text-gray-600">12 categories mapped</p>
                  </div>
                </div>

                <p className="text-gray-600">
                  Map AHNI cost categories to QuickBooks accounts for accurate expense categorization.
                </p>

                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Category Mapping
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Export Categories
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Category Reports
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Sync Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Syncs Today</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Successful Syncs</span>
                    <span className="font-semibold text-green-600">22</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Failed Syncs</span>
                    <span className="font-semibold text-red-600">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Warnings</span>
                    <span className="font-semibold text-yellow-600">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold">91.7%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Volume</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Accounts Synced</span>
                    <span className="font-semibold">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Journal Entries</span>
                    <span className="font-semibold">127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Customers</span>
                    <span className="font-semibold">34</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vendors</span>
                    <span className="font-semibold">33</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Transactions</span>
                    <span className="font-semibold">₦15,670,000</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Sync Performance Chart</h3>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Sync performance chart would be displayed here</p>
                  <p className="text-sm text-gray-500">Integration with charting library needed</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recent Sync Activity</h3>
                <Button variant="outline" size="sm" onClick={() => toast.success("Sync history refreshed")}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="space-y-3">
                {syncHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <div className="font-medium">{item.action}</div>
                        <div className="text-sm text-gray-600">{item.details}</div>
                        <div className="text-xs text-gray-500">{formatTimestamp(item.timestamp)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button variant="outline" onClick={() => toast.info("Loading more history...")}>
                  Load More History
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}