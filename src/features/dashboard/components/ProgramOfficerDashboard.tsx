"use client";

import { useState, useEffect, useMemo } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUnifiedPermissions } from "@/hooks/useUnifiedPermissions";
import { useProgramOfficerPermissions } from "@/hooks/useProgramOfficerPermissions";
import { formatNumberCurrency } from "@/utils/utls";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  DollarSign,
  FileText,
  Calendar,
  TrendingUp,
  Activity,
  Eye,
  Download
} from "lucide-react";

// Program Officer specific data (mock data for now, replace with real API calls)
const programOfficerData = {
  pendingApprovals: [
    {
      id: "approval_001",
      type: "Travel Request",
      requester: "John Doe",
      amount: "$2,500",
      project: "Health Program - Adamawa",
      daysWaiting: 3,
      priority: "high"
    },
    {
      id: "approval_002",
      type: "Purchase Request",
      requester: "Jane Smith",
      amount: "$8,500",
      project: "Education Program - Yola",
      daysWaiting: 1,
      priority: "medium"
    },
    {
      id: "approval_003",
      type: "Activity Memo",
      requester: "Mike Johnson",
      amount: "$1,200",
      project: "Health Program - Adamawa",
      daysWaiting: 7,
      priority: "high"
    }
  ],

  myProjects: [
    {
      id: "proj_001",
      name: "Health Program - Adamawa State",
      progress: 75,
      budget: 250000,
      spent: 187500,
      teamSize: 12,
      nextMilestone: "Quarterly Review",
      daysToMilestone: 5,
      status: "on_track"
    },
    {
      id: "proj_002",
      name: "Education Program - Yola",
      progress: 45,
      budget: 180000,
      spent: 81000,
      teamSize: 8,
      nextMilestone: "Mid-term Evaluation",
      daysToMilestone: 12,
      status: "at_risk"
    }
  ],

  teamRequests: [
    {
      id: "req_001",
      type: "Leave Request",
      employee: "Sarah Ahmed",
      dates: "Dec 20-25, 2024",
      status: "pending",
      submitted: "2 days ago"
    },
    {
      id: "req_002",
      type: "Travel Authorization",
      employee: "David Musa",
      destination: "Jalingo Field Office",
      status: "pending",
      submitted: "1 day ago"
    }
  ],

  budgetAlerts: [
    {
      id: "budget_001",
      project: "Health Program - Adamawa",
      type: "Overspend Warning",
      percentage: 85,
      message: "Approaching 85% budget utilization",
      severity: "warning"
    },
    {
      id: "budget_002",
      project: "Education Program - Yola",
      type: "Milestone Due",
      message: "Budget review due in 3 days",
      severity: "info"
    }
  ],

  upcomingActivities: [
    {
      id: "activity_001",
      title: "Stakeholder Meeting - Adamawa",
      date: "Dec 15, 2024",
      time: "10:00 AM",
      location: "Yola Office",
      attendees: 8
    },
    {
      id: "activity_002",
      title: "Site Visit - Health Centers",
      date: "Dec 18, 2024",
      time: "8:00 AM",
      location: "Various Locations",
      attendees: 4
    },
    {
      id: "activity_003",
      title: "Monthly Review Meeting",
      date: "Dec 20, 2024",
      time: "2:00 PM",
      location: "Main Office",
      attendees: 15
    }
  ]
};

export default function ProgramOfficerDashboard() {
  const { user, isAdmin } = useUnifiedPermissions();
  const programPermissions = useProgramOfficerPermissions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_track": return "text-green-600";
      case "at_risk": return "text-yellow-600";
      case "delayed": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name || 'Program Officer'}
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what needs your attention today
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium">{new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Action Required Section - Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Pending Your Approval ({programOfficerData.pendingApprovals.length})
            </h2>
            <Badge className="bg-orange-100 text-orange-800">
              Action Required
            </Badge>
          </div>
          <div className="space-y-3">
            {programOfficerData.pendingApprovals.map((approval) => (
              <div key={approval.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{approval.type}</p>
                    <Badge className={getPriorityColor(approval.priority)}>
                      {approval.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{approval.requester} • {approval.project}</p>
                  <p className="text-sm text-gray-500">Amount: {approval.amount} • {approval.daysWaiting} days waiting</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Budget Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              Budget Alerts
            </h2>
          </div>
          <div className="space-y-3">
            {programOfficerData.budgetAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg ${
                alert.severity === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{alert.project}</p>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    {alert.percentage && (
                      <div className="mt-2">
                        <Progress value={alert.percentage} className="w-32" />
                        <p className="text-xs text-gray-500 mt-1">{alert.percentage}% utilized</p>
                      </div>
                    )}
                  </div>
                  <Badge className={alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}>
                    {alert.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* My Projects Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            My Projects ({programOfficerData.myProjects.length})
          </h2>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {programOfficerData.myProjects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <Badge className={`mt-1 ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                </div>
                <Button size="sm" variant="outline">View Details</Button>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Project Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Budget Used</p>
                  <p className="font-semibold">{formatNumberCurrency(project.spent)}</p>
                  <p className="text-xs text-gray-500">of {formatNumberCurrency(project.budget)}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Team Size</p>
                  <p className="font-semibold flex items-center justify-center gap-1">
                    <Users className="h-4 w-4" />
                    {project.teamSize}
                  </p>
                </div>
              </div>

              {/* Next Milestone */}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Next Milestone</p>
                    <p className="text-sm text-gray-600">{project.nextMilestone}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-100 text-blue-800">
                      {project.daysToMilestone} days
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Team Requests & Upcoming Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Requests */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Team Requests ({programOfficerData.teamRequests.length})
            </h2>
          </div>
          <div className="space-y-3">
            {programOfficerData.teamRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{request.employee}</p>
                  <p className="text-sm text-gray-600">{request.type}</p>
                  <p className="text-sm text-gray-500">
                    {request.dates || request.destination} • {request.submitted}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {request.status}
                  </Badge>
                  <Button size="sm">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Activities */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              Upcoming Activities
            </h2>
          </div>
          <div className="space-y-3">
            {programOfficerData.upcomingActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                <div className="bg-indigo-100 rounded-full p-2">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.date} at {activity.time}</p>
                  <p className="text-sm text-gray-500">
                    {activity.location} • {activity.attendees} attendees
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-16 flex-col gap-2" variant="outline">
            <FileText className="h-5 w-5" />
            <span className="text-sm">Create Fund Request</span>
          </Button>
          <Button className="h-16 flex-col gap-2" variant="outline">
            <Calendar className="h-5 w-5" />
            <span className="text-sm">Schedule Site Visit</span>
          </Button>
          <Button className="h-16 flex-col gap-2" variant="outline">
            <Users className="h-5 w-5" />
            <span className="text-sm">Team Management</span>
          </Button>
          <Button className="h-16 flex-col gap-2" variant="outline">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm">View Reports</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}