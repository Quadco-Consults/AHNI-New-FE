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
  BarChart3,
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

  // Calculate status counts
  const pendingRequests = purchaseRequests.filter((r: any) =>
    r.status?.toLowerCase() === 'pending' || r.status?.toLowerCase() === 'submitted'
  ).length;

  const approvedRequests = purchaseRequests.filter((r: any) =>
    r.status?.toLowerCase() === 'approved'
  ).length;

  const activePurchaseOrders = purchaseOrders.filter((po: any) =>
    po.status?.toLowerCase() === 'active' || po.status?.toLowerCase() === 'approved'
  ).length;

  // Quick stats cards
  const statsCards = [
    {
      title: "Purchase Requests",
      value: totalPurchaseRequests,
      icon: ShoppingCart,
      description: `${approvedRequests} approved, ${pendingRequests} pending`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/dashboard/procurement/purchase-request"
    },
    {
      title: "Purchase Orders",
      value: totalPurchaseOrders,
      icon: FileCheck,
      description: `${activePurchaseOrders} active orders`,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/dashboard/procurement/purchase-order"
    },
    {
      title: "Registered Vendors",
      value: totalVendors,
      icon: Users,
      description: "Active supplier database",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/dashboard/procurement/supplier-database"
    },
    {
      title: "Procurement Plans",
      value: totalProcurementPlans,
      icon: ClipboardList,
      description: "Active procurement plans",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      link: "/dashboard/procurement/procurement-plan"
    }
  ];

  // Quick actions
  const quickActions = [
    {
      title: "Purchase Management",
      items: [
        { name: "Create Purchase Request", link: "/dashboard/procurement/purchase-request", icon: ShoppingCart },
        { name: "Manage Purchase Orders", link: "/dashboard/procurement/purchase-order", icon: FileCheck },
        { name: "Activity Memo", link: "/dashboard/procurement/activity-memo", icon: FileText },
        { name: "Procurement Tracker", link: "/dashboard/procurement/procurement-tracker", icon: TrendingUp }
      ]
    },
    {
      title: "Vendor Management",
      items: [
        { name: "Supplier Database", link: "/dashboard/procurement/supplier-database", icon: Users },
        { name: "Vendor Prequalification", link: "/dashboard/procurement/vendor-management/prequalification", icon: ClipboardList },
        { name: "EOI Management", link: "/dashboard/procurement/vendor-management/eoi", icon: FileText },
        { name: "Vendor Performance", link: "/dashboard/procurement/vendor-performance", icon: BarChart3 }
      ]
    },
    {
      title: "Planning & Analysis",
      items: [
        { name: "Procurement Plan", link: "/dashboard/procurement/procurement-plan", icon: ClipboardList },
        { name: "Price Intelligence", link: "/dashboard/procurement/price-intelligence", icon: DollarSign },
        { name: "Competitive Bid Analysis", link: "/dashboard/procurement/competitive-bid-analysis", icon: BarChart3 },
        { name: "Procurement Reports", link: "/dashboard/procurement/procurement-report", icon: FileText }
      ]
    }
  ];

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Procurement Overview</h1>
        <p className="text-muted-foreground">
          Monitor and manage purchase requests, vendors, and procurement activities
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link href={stat.link} key={index}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for processing</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-amber-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active POs</CardTitle>
            <Truck className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{activePurchaseOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Purchase orders in progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <CardDescription>Quick access to common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={itemIndex}
                      href={item.link}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                    >
                      <div className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity / Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
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
                    <ShoppingCart className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium">{pendingRequests} Pending Purchase Requests</p>
                      <p className="text-xs text-muted-foreground">Review and approve</p>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Quick Stats
            </CardTitle>
            <CardDescription>At a glance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Purchase Requests</span>
                <span className="text-sm font-semibold">{totalPurchaseRequests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Purchase Orders</span>
                <span className="text-sm font-semibold">{activePurchaseOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Registered Vendors</span>
                <span className="text-sm font-semibold">{totalVendors}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Procurement Plans</span>
                <span className="text-sm font-semibold">{totalProcurementPlans}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solicitation Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Solicitation Management</CardTitle>
          <CardDescription>Manage RFQs, RFPs, and vendor solicitations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/dashboard/procurement/solicitation-management/rfq"
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors group"
            >
              <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold group-hover:text-primary transition-colors">Request for Quotation (RFQ)</h4>
                <p className="text-xs text-muted-foreground">Manage price quotes from vendors</p>
              </div>
            </Link>

            <Link
              href="/dashboard/procurement/solicitation-management/rfp"
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors group"
            >
              <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold group-hover:text-primary transition-colors">Request for Proposal (RFP)</h4>
                <p className="text-xs text-muted-foreground">Manage detailed vendor proposals</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
