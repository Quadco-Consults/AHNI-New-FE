"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  FileText,
  Users,
  TrendingUp,
  Package,
  ClipboardList,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart,
  DollarSign,
  Truck,
  FileCheck
} from "lucide-react";
import Link from "next/link";
import { useGetPurchaseRequests } from "../controllers/purchaseRequestController";
import { useGetAllPurchaseOrders } from "../controllers/purchaseOrderController";
import { useGetVendors } from "../controllers/vendorsController";
import { useGetAllProcurementPlans } from "../controllers/procurementPlanController";
import { useGetAllProcurementTrackers } from "../controllers/procurementTrackerController";

const Overview = () => {
  // Fetch data
  const { data: purchaseRequestsData } = useGetPurchaseRequests({});
  const { data: purchaseOrdersData } = useGetAllPurchaseOrders({});
  const { data: vendorsData } = useGetVendors({});
  const { data: procurementPlansData } = useGetAllProcurementPlans({});
  const { data: procurementTrackerData } = useGetAllProcurementTrackers({});

  // Calculate metrics
  const purchaseRequests = purchaseRequestsData?.data?.results || [];
  const purchaseOrders = purchaseOrdersData?.data?.results || [];
  const vendors = vendorsData?.data?.results || [];
  const procurementPlans = procurementPlansData?.data?.results || [];
  const trackerItems = procurementTrackerData?.data?.results || [];

  const totalPurchaseRequests = purchaseRequests.length;
  const totalPurchaseOrders = purchaseOrders.length;
  const totalVendors = vendors.length;
  const totalProcurementPlans = procurementPlans.length;

  // Calculate status counts for PR lifecycle
  // Pending = Pending + Reviewed + Authorised (awaiting final approval)
  const pendingRequests = purchaseRequests.filter((r: any) =>
    r.status === 'Pending' || r.status === 'Reviewed' || r.status === 'Authorised'
  ).length;

  // Approved PRs ready for procurement
  const approvedRequests = purchaseRequests.filter((r: any) =>
    r.status === 'Approved'
  ).length;

  // In Procurement = Has RFQ or PO but no GRN yet
  const inProcurementRequests = purchaseRequests.filter((r: any) =>
    (r.has_rfq === true || r.has_po === true) && r.has_grn !== true
  ).length;

  // Closed Out = Complete cycle with GRN
  const closedOutRequests = purchaseRequests.filter((r: any) =>
    r.has_grn === true
  ).length;

  const activePurchaseOrders = purchaseOrders.filter((po: any) =>
    po.status?.toLowerCase() === 'active' || po.status?.toLowerCase() === 'approved'
  ).length;

  return (
    <div className="w-full space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Procurement Overview</h1>
        <p className="text-muted-foreground">
          Monitor and manage the complete procurement workflow from requests to orders
        </p>
      </div>

      {/* ============ STAGE 1: PURCHASE REQUEST (PR) ============ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50">
          <ShoppingCart className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-blue-900">Stage 1: Purchase Request (PR)</h2>
            <p className="text-sm text-blue-700">Internal requisition and approval process</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/procurement/purchase-request">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Purchase Requests</CardTitle>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPurchaseRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">All PRs created</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/procurement/purchase-request">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-amber-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <div className="bg-amber-50 p-2 rounded-lg">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval workflow</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/procurement/purchase-request">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved PRs</CardTitle>
                <div className="bg-green-50 p-2 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">Ready for procurement</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/procurement/activity-memo">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activity Memo</CardTitle>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium mt-2">Create PR Memo</div>
                <p className="text-xs text-muted-foreground mt-1">Authorization documents</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* ============ STAGE 2: SOLICITATION (RFQ/RFP) ============ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-l-4 border-purple-500 pl-4 py-2 bg-purple-50/50">
          <FileText className="h-6 w-6 text-purple-600" />
          <div>
            <h2 className="text-xl font-bold text-purple-900">Stage 2: Solicitation (RFQ/RFP)</h2>
            <p className="text-sm text-purple-700">Request quotes and proposals from vendors</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/procurement/solicitation-management/rfq">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Request for Quotation</CardTitle>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium mt-2">Manage RFQs</div>
                <p className="text-xs text-muted-foreground mt-1">Price quotes from vendors</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/procurement/solicitation-management/rfp">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Request for Proposal</CardTitle>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <ClipboardList className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium mt-2">Manage RFPs</div>
                <p className="text-xs text-muted-foreground mt-1">Detailed vendor proposals</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/procurement/competitive-bid-analysis">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bid Analysis</CardTitle>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <BarChart className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium mt-2">Compare Bids</div>
                <p className="text-xs text-muted-foreground mt-1">Competitive bid analysis</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* STAGE 3: PURCHASE ORDER (PO) */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-50/50">
          <FileCheck className="h-6 w-6 text-emerald-600" />
          <div>
            <h2 className="text-xl font-bold text-emerald-900">Stage 3: Purchase Order (PO)</h2>
            <p className="text-sm text-emerald-700">Create and manage purchase orders</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/procurement/purchase-order">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-emerald-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Purchase Orders</CardTitle>
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPurchaseOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">All POs created</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/procurement/purchase-order">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active POs</CardTitle>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Truck className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activePurchaseOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">Orders in progress</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/procurement/procurement-tracker">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Procurement</CardTitle>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProcurementRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting completion</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* ============ COMPLETION & TRACKING ============ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-l-4 border-teal-500 pl-4 py-2 bg-teal-50/50">
          <Package className="h-6 w-6 text-teal-600" />
          <div>
            <h2 className="text-xl font-bold text-teal-900">Completion & Tracking</h2>
            <p className="text-sm text-teal-700">Monitor completed procurements and track progress</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/dashboard/procurement/purchase-request">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-teal-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Closed Out</CardTitle>
                <div className="bg-teal-50 p-2 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-teal-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{closedOutRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">Complete procurement cycle</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/procurement/procurement-tracker">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-teal-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Procurement Tracker</CardTitle>
                <div className="bg-teal-50 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-teal-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium mt-2">Track All Items</div>
                <p className="text-xs text-muted-foreground mt-1">Monitor procurement progress</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* ============ VENDOR MANAGEMENT ============ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-l-4 border-cyan-500 pl-4 py-2 bg-cyan-50/50">
          <Users className="h-6 w-6 text-cyan-600" />
          <div>
            <h2 className="text-xl font-bold text-cyan-900">Vendor Management</h2>
            <p className="text-sm text-cyan-700">Manage vendor database and performance</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/procurement/supplier-database">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-cyan-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registered Vendors</CardTitle>
                <div className="bg-cyan-50 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-cyan-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVendors}</div>
                <p className="text-xs text-muted-foreground mt-1">Active supplier database</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/procurement/vendor-management/prequalification">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-cyan-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prequalification</CardTitle>
                <div className="bg-cyan-50 p-2 rounded-lg">
                  <ClipboardList className="h-4 w-4 text-cyan-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium mt-2">Vendor Prequalification</div>
                <p className="text-xs text-muted-foreground mt-1">Assess vendor capabilities</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/procurement/vendor-management/eoi">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-cyan-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">EOI Management</CardTitle>
                <div className="bg-cyan-50 p-2 rounded-lg">
                  <FileText className="h-4 w-4 text-cyan-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium mt-2">Expression of Interest</div>
                <p className="text-xs text-muted-foreground mt-1">Manage vendor interest</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/procurement/vendor-performance">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-cyan-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendor Performance</CardTitle>
                <div className="bg-cyan-50 p-2 rounded-lg">
                  <BarChart className="h-4 w-4 text-cyan-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium mt-2">Performance Tracking</div>
                <p className="text-xs text-muted-foreground mt-1">Monitor vendor quality</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* ============ PLANNING & ANALYSIS ============ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-l-4 border-orange-500 pl-4 py-2 bg-orange-50/50">
          <BarChart className="h-6 w-6 text-orange-600" />
          <div>
            <h2 className="text-xl font-bold text-orange-900">Planning & Analysis</h2>
            <p className="text-sm text-orange-700">Strategic planning and procurement intelligence</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/procurement/procurement-plan">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Procurement Plan</CardTitle>
                <div className="bg-orange-50 p-2 rounded-lg">
                  <ClipboardList className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProcurementPlans}</div>
                <p className="text-xs text-muted-foreground mt-1">Active procurement plans</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/procurement/price-intelligence">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Price Intelligence</CardTitle>
                <div className="bg-orange-50 p-2 rounded-lg">
                  <DollarSign className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium mt-2">Market Prices</div>
                <p className="text-xs text-muted-foreground mt-1">Track price trends</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/procurement/competitive-bid-analysis">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bid Analysis</CardTitle>
                <div className="bg-orange-50 p-2 rounded-lg">
                  <BarChart className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium mt-2">Compare Bids</div>
                <p className="text-xs text-muted-foreground mt-1">Analyze vendor quotes</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/procurement/procurement-report">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reports</CardTitle>
                <div className="bg-orange-50 p-2 rounded-lg">
                  <FileText className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium mt-2">Procurement Reports</div>
                <p className="text-xs text-muted-foreground mt-1">Analytics & insights</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* ============ ALERTS & SUMMARY ============ */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Action Required
            </CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests > 0 && (
                <Link
                  href="/dashboard/procurement/purchase-request"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-50 p-2 rounded-lg">
                      <ShoppingCart className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{pendingRequests} Pending Purchase Requests</p>
                      <p className="text-xs text-muted-foreground">Review and approve PRs</p>
                    </div>
                  </div>
                </Link>
              )}
              {pendingRequests === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No pending actions at this time
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-500" />
              Procurement Summary
            </CardTitle>
            <CardDescription>Overall procurement statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/50">
                <span className="text-sm text-gray-700 font-medium">Total Purchase Requests</span>
                <span className="text-sm font-bold text-blue-700">{totalPurchaseRequests}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50">
                <span className="text-sm text-gray-700 font-medium">Active Purchase Orders</span>
                <span className="text-sm font-bold text-emerald-700">{activePurchaseOrders}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-50/50">
                <span className="text-sm text-gray-700 font-medium">Registered Vendors</span>
                <span className="text-sm font-bold text-cyan-700">{totalVendors}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50/50">
                <span className="text-sm text-gray-700 font-medium">Procurement Plans</span>
                <span className="text-sm font-bold text-orange-700">{totalProcurementPlans}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
