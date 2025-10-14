"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  UserCheck,
  ClipboardList,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2
} from "lucide-react";
import Link from "next/link";
import { useGetAllGrants } from "@/features/contracts-grants/controllers/grantController";
import { useGetAllSubGrants } from "@/features/contracts-grants/controllers/subGrantController";
import { useGetAllContractRequests } from "@/features/contracts-grants/controllers/contractController";
import { useGetAllConsultantAdvertisements } from "@/features/contracts-grants/controllers/consultantAdvertisementController";

export default function CandGOverviewPage() {
  // Fetch data
  const { data: grantsData } = useGetAllGrants({});
  const { data: subGrantsData } = useGetAllSubGrants({});
  const { data: contractsData } = useGetAllContractRequests({});
  const { data: consultantsData } = useGetAllConsultantAdvertisements({});

  // Calculate metrics
  const grants = grantsData?.data?.results || [];
  const subGrants = subGrantsData?.data?.results || [];
  const contracts = contractsData?.data?.results || [];
  const consultants = consultantsData?.data?.results || [];

  const totalGrants = grants.length;
  const totalSubGrants = subGrants.length;
  const totalContracts = contracts.length;
  const totalConsultants = consultants.length;

  // Calculate totals
  const totalGrantAmount = grants.reduce((sum: number, grant: any) =>
    sum + (parseFloat(grant.amount) || 0), 0
  );

  const activeContracts = contracts.filter((c: any) =>
    c.status?.toLowerCase() === 'active' || c.status?.toLowerCase() === 'approved'
  ).length;

  const pendingContracts = contracts.filter((c: any) =>
    c.status?.toLowerCase() === 'pending' || c.status?.toLowerCase() === 'submitted'
  ).length;

  // Quick stats cards
  const statsCards = [
    {
      title: "Total Grants",
      value: totalGrants,
      icon: Award,
      description: "Active grant programs",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/dashboard/c-and-g/grant"
    },
    {
      title: "Sub-Grants",
      value: totalSubGrants,
      icon: TrendingUp,
      description: "Sub-grant opportunities",
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/dashboard/c-and-g/sub-grant"
    },
    {
      title: "Contract Requests",
      value: totalContracts,
      icon: FileText,
      description: `${activeContracts} active, ${pendingContracts} pending`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/dashboard/c-and-g/contract-request"
    },
    {
      title: "Consultants",
      value: totalConsultants,
      icon: Users,
      description: "Active consultancy adverts",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      link: "/dashboard/c-and-g/consultancy"
    }
  ];

  // Financial overview
  const financialCards = [
    {
      title: "Total Grant Value",
      value: `₦${totalGrantAmount.toLocaleString()}`,
      icon: DollarSign,
      description: "Cumulative grant funding",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ];

  // Quick actions
  const quickActions = [
    {
      title: "Contract Management",
      items: [
        { name: "Create Contract Request", link: "/dashboard/c-and-g/contract-request", icon: FileText },
        { name: "Consultant Management", link: "/dashboard/c-and-g/consultancy", icon: Users },
        { name: "Consultancy Reports", link: "/dashboard/c-and-g/consultancy-report", icon: ClipboardList },
        { name: "Service Agreements", link: "/dashboard/c-and-g/agreements", icon: CheckCircle }
      ]
    },
    {
      title: "Grant Management",
      items: [
        { name: "View All Grants", link: "/dashboard/c-and-g/grant", icon: Award },
        { name: "Sub-Grant Adverts", link: "/dashboard/c-and-g/sub-grant", icon: TrendingUp },
        { name: "Award Management", link: "/dashboard/c-and-g/sub-grant/awards", icon: UserCheck },
        { name: "Donor Database", link: "/dashboard/c-and-g/donor-database", icon: Building2 }
      ]
    },
    {
      title: "Assessment & Closeout",
      items: [
        { name: "Pre-Award Assessment", link: "/dashboard/c-and-g/sub-grant/preaward-assessment", icon: ClipboardList },
        { name: "Awarded Beneficiaries", link: "/dashboard/c-and-g/awarded-beneficiaries", icon: UserCheck },
        { name: "Closeout Plans", link: "/dashboard/c-and-g/close-out-plan", icon: CheckCircle },
        { name: "View Reports", link: "/dashboard/c-and-g/reports", icon: BarChart3 }
      ]
    }
  ];

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Contracts & Grants Overview</h1>
        <p className="text-muted-foreground">
          Monitor and manage grants, contracts, and consultancy agreements
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

      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {financialCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}

        {/* Status Cards */}
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activeContracts}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently in progress</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-amber-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{pendingContracts}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
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
              {pendingContracts > 0 && (
                <Link
                  href="/dashboard/c-and-g/contract-request"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium">{pendingContracts} Pending Contracts</p>
                      <p className="text-xs text-muted-foreground">Review and approve</p>
                    </div>
                  </div>
                </Link>
              )}
              {pendingContracts === 0 && (
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
                <span className="text-sm text-muted-foreground">Total Grants</span>
                <span className="text-sm font-semibold">{totalGrants}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Sub-Grants</span>
                <span className="text-sm font-semibold">{totalSubGrants}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Contracts</span>
                <span className="text-sm font-semibold">{totalContracts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Consultants</span>
                <span className="text-sm font-semibold">{totalConsultants}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
