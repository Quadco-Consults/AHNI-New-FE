"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  ExternalLink,
  Download,
  Upload,
  Wifi,
  WifiOff
} from "lucide-react";
import { toast } from "sonner";

interface QuickBooksConnectionStatus {
  isConnected: boolean;
  companyName?: string;
  lastSync?: string;
  connectionHealth: "healthy" | "warning" | "error";
  accountsSynced: number;
  transactionsPending: number;
  lastError?: string;
}

interface QuickBooksSettings {
  autoSync: boolean;
  syncInterval: number; // minutes
  syncChartOfAccounts: boolean;
  syncCustomers: boolean;
  syncVendors: boolean;
  syncItems: boolean;
  createJournalEntries: boolean;
  defaultAccountMapping: {
    revenueAccount: string;
    expenseAccount: string;
    assetAccount: string;
    liabilityAccount: string;
  };
}

export default function QuickBooksConnectionWidget() {
  const [connectionStatus, setConnectionStatus] = useState<QuickBooksConnectionStatus>({
    isConnected: false,
    connectionHealth: "error",
    accountsSynced: 0,
    transactionsPending: 0
  });

  const [settings, setSettings] = useState<QuickBooksSettings>({
    autoSync: true,
    syncInterval: 15,
    syncChartOfAccounts: true,
    syncCustomers: true,
    syncVendors: true,
    syncItems: false,
    createJournalEntries: true,
    defaultAccountMapping: {
      revenueAccount: "",
      expenseAccount: "",
      assetAccount: "",
      liabilityAccount: ""
    }
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Simulate checking connection status
  useEffect(() => {
    // This would be replaced with actual QuickBooks API calls
    const checkConnection = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock connected status for demo
      setConnectionStatus({
        isConnected: true,
        companyName: "AHNI Demo Company",
        lastSync: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
        connectionHealth: "healthy",
        accountsSynced: 45,
        transactionsPending: 3
      });
    };

    checkConnection();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Simulate QuickBooks OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));

      setConnectionStatus(prev => ({
        ...prev,
        isConnected: true,
        companyName: "AHNI Demo Company",
        connectionHealth: "healthy",
        lastSync: new Date().toISOString()
      }));

      toast.success("Successfully connected to QuickBooks!");
    } catch (error) {
      toast.error("Failed to connect to QuickBooks");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Simulate disconnect
      await new Promise(resolve => setTimeout(resolve, 1000));

      setConnectionStatus({
        isConnected: false,
        connectionHealth: "error",
        accountsSynced: 0,
        transactionsPending: 0
      });

      toast.success("Disconnected from QuickBooks");
    } catch (error) {
      toast.error("Failed to disconnect from QuickBooks");
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 3000));

      setConnectionStatus(prev => ({
        ...prev,
        lastSync: new Date().toISOString(),
        accountsSynced: prev.accountsSynced + 2,
        transactionsPending: Math.max(0, prev.transactionsPending - 1)
      }));

      toast.success("Successfully synced with QuickBooks!");
    } catch (error) {
      toast.error("Failed to sync with QuickBooks");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 1500));

      setConnectionStatus(prev => ({
        ...prev,
        connectionHealth: "healthy",
        lastError: undefined
      }));

      toast.success("Connection test successful!");
    } catch (error) {
      toast.error("Connection test failed");
    }
  };

  const getConnectionIcon = () => {
    if (connectionStatus.isConnected) {
      switch (connectionStatus.connectionHealth) {
        case "healthy":
          return <CheckCircle className="w-5 h-5 text-green-500" />;
        case "warning":
          return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        case "error":
          return <XCircle className="w-5 h-5 text-red-500" />;
      }
    }
    return <WifiOff className="w-5 h-5 text-gray-400" />;
  };

  const getConnectionColor = () => {
    if (!connectionStatus.isConnected) return "bg-gray-100 text-gray-800";

    switch (connectionStatus.connectionHealth) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatLastSync = (lastSync?: string) => {
    if (!lastSync) return "Never";

    const now = new Date();
    const syncTime = new Date(lastSync);
    const diffMinutes = Math.floor((now.getTime() - syncTime.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Connection Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wifi className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">QuickBooks Integration</h3>
              <p className="text-sm text-gray-600">
                Sync accounting data with QuickBooks Online
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getConnectionIcon()}
            <Badge className={getConnectionColor()}>
              {connectionStatus.isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </div>

        {connectionStatus.isConnected && (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Company</div>
                <div className="font-medium">{connectionStatus.companyName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Last Sync</div>
                <div className="font-medium">{formatLastSync(connectionStatus.lastSync)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Accounts Synced</div>
                <div className="font-medium">{connectionStatus.accountsSynced}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Pending Transactions</div>
                <div className="font-medium">
                  {connectionStatus.transactionsPending}
                  {connectionStatus.transactionsPending > 0 && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Needs Sync
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {connectionStatus.lastError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700">{connectionStatus.lastError}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-3">
          {!connectionStatus.isConnected ? (
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4 mr-2" />
              )}
              {isConnecting ? "Connecting..." : "Connect to QuickBooks"}
            </Button>
          ) : (
            <>
              <Button onClick={handleSync} disabled={isSyncing}>
                {isSyncing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isSyncing ? "Syncing..." : "Sync Now"}
              </Button>
              <Button variant="outline" onClick={handleTestConnection}>
                <Wifi className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>QuickBooks Integration Settings</DialogTitle>
                    <DialogDescription>
                      Configure how AHNI syncs data with QuickBooks Online
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    {/* Sync Settings */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Sync Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="auto-sync">Enable automatic sync</Label>
                          <Switch
                            id="auto-sync"
                            checked={settings.autoSync}
                            onCheckedChange={(checked) =>
                              setSettings(prev => ({ ...prev, autoSync: checked }))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sync-interval">Sync interval (minutes)</Label>
                          <Select
                            value={settings.syncInterval.toString()}
                            onValueChange={(value) =>
                              setSettings(prev => ({ ...prev, syncInterval: parseInt(value) }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 minutes</SelectItem>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="240">4 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Data Sync Options */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Data Sync Options</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sync-coa">Chart of Accounts</Label>
                          <Switch
                            id="sync-coa"
                            checked={settings.syncChartOfAccounts}
                            onCheckedChange={(checked) =>
                              setSettings(prev => ({ ...prev, syncChartOfAccounts: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="sync-customers">Customers</Label>
                          <Switch
                            id="sync-customers"
                            checked={settings.syncCustomers}
                            onCheckedChange={(checked) =>
                              setSettings(prev => ({ ...prev, syncCustomers: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="sync-vendors">Vendors</Label>
                          <Switch
                            id="sync-vendors"
                            checked={settings.syncVendors}
                            onCheckedChange={(checked) =>
                              setSettings(prev => ({ ...prev, syncVendors: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="sync-items">Items/Products</Label>
                          <Switch
                            id="sync-items"
                            checked={settings.syncItems}
                            onCheckedChange={(checked) =>
                              setSettings(prev => ({ ...prev, syncItems: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="auto-journal">Create journal entries automatically</Label>
                          <Switch
                            id="auto-journal"
                            checked={settings.createJournalEntries}
                            onCheckedChange={(checked) =>
                              setSettings(prev => ({ ...prev, createJournalEntries: checked }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Default Account Mapping */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Default Account Mapping</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="revenue-account">Revenue Account</Label>
                          <Input
                            id="revenue-account"
                            placeholder="4000 - Revenue"
                            value={settings.defaultAccountMapping.revenueAccount}
                            onChange={(e) =>
                              setSettings(prev => ({
                                ...prev,
                                defaultAccountMapping: {
                                  ...prev.defaultAccountMapping,
                                  revenueAccount: e.target.value
                                }
                              }))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="expense-account">Expense Account</Label>
                          <Input
                            id="expense-account"
                            placeholder="6000 - Expenses"
                            value={settings.defaultAccountMapping.expenseAccount}
                            onChange={(e) =>
                              setSettings(prev => ({
                                ...prev,
                                defaultAccountMapping: {
                                  ...prev.defaultAccountMapping,
                                  expenseAccount: e.target.value
                                }
                              }))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="asset-account">Asset Account</Label>
                          <Input
                            id="asset-account"
                            placeholder="1000 - Assets"
                            value={settings.defaultAccountMapping.assetAccount}
                            onChange={(e) =>
                              setSettings(prev => ({
                                ...prev,
                                defaultAccountMapping: {
                                  ...prev.defaultAccountMapping,
                                  assetAccount: e.target.value
                                }
                              }))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="liability-account">Liability Account</Label>
                          <Input
                            id="liability-account"
                            placeholder="2000 - Liabilities"
                            value={settings.defaultAccountMapping.liabilityAccount}
                            onChange={(e) =>
                              setSettings(prev => ({
                                ...prev,
                                defaultAccountMapping: {
                                  ...prev.defaultAccountMapping,
                                  liabilityAccount: e.target.value
                                }
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      toast.success("Settings saved successfully");
                      setSettingsOpen(false);
                    }}>
                      Save Settings
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleDisconnect} className="text-red-600 hover:text-red-700">
                Disconnect
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Sync Actions */}
      {connectionStatus.isConnected && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Data Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Import from QuickBooks</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Import Chart of Accounts
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Import Customers
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Import Vendors
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Export to QuickBooks</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Export Journal Entries
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Export Transactions
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Export Budgets
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Mapping</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Mapping
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Class Mapping
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Department Mapping
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}