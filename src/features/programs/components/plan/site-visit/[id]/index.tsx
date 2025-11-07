"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "components/ui/button";
import { LoadingSpinner } from "components/Loading";
import BreadcrumbCard from "components/Breadcrumb";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Edit
} from "lucide-react";

import {
  SiteVisitStatus,
  SiteVisitStatusLabels,
  SiteVisitType,
  SiteVisitTypeLabels,
  TeamMemberRoleLabels,
  ISiteVisitData,
} from "@/features/programs/types/site-visit";

import { useGetSingleSiteVisit } from "@/features/programs/controllers/siteVisitController";

import SiteVisitApprovalStatus from "../SiteVisitApprovalStatus";

const SiteVisitDetail = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // Fetch site visit data
  const { data: siteVisitResponse, isFetching, error } = useGetSingleSiteVisit(id, !!id);
  const siteVisit = siteVisitResponse?.data;

  // Debug logging for site visit detail
  console.log("🔍 Site Visit Response:", siteVisitResponse);
  console.log("🔍 Site Visit Data:", siteVisit);

  const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Site Visit", icon: false },
    { name: siteVisit?.title || "Details", icon: false },
  ];

  const getStatusBadge = (status: SiteVisitStatus) => {
    const statusConfig = {
      [SiteVisitStatus.DRAFT]: "bg-gray-100 text-gray-800",
      [SiteVisitStatus.SUBMITTED]: "bg-blue-100 text-blue-800",
      [SiteVisitStatus.UNDER_REVIEW]: "bg-yellow-100 text-yellow-800",
      [SiteVisitStatus.REVIEWED]: "bg-purple-100 text-purple-800",
      [SiteVisitStatus.AUTHORIZED]: "bg-indigo-100 text-indigo-800",
      [SiteVisitStatus.APPROVED]: "bg-green-100 text-green-800",
      [SiteVisitStatus.REJECTED]: "bg-red-100 text-red-800",
      [SiteVisitStatus.EA_CREATED]: "bg-emerald-100 text-emerald-800",
    };

    return (
      <Badge className={statusConfig[status]}>
        {SiteVisitStatusLabels[status]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/programs/plan/site-visit/${id}/edit`);
  };

  const handleDownloadReport = () => {
    // TODO: Implement download functionality
    console.log("Download site visit report");
  };

  if (isFetching) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !siteVisit) {
    return (
      <div className="p-6">
        <BreadcrumbCard list={breadcrumbs} />
        <div className="text-center py-8 text-red-600">
          <p>Error loading site visit details</p>
          <p className="text-sm mt-1">The site visit may not exist or you may not have permission to view it</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <BreadcrumbCard list={breadcrumbs} />

      <div className="mt-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{siteVisit.title}</h1>
              {getStatusBadge(siteVisit.status)}
            </div>
            <p className="text-gray-600">{SiteVisitTypeLabels[siteVisit.site_visit_type]}</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadReport}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download
            </Button>
            {(siteVisit.status === SiteVisitStatus.DRAFT ||
              siteVisit.status === SiteVisitStatus.SUBMITTED) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit size={16} />
                Edit
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="ea">Expense Authorization</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Location Information */}
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Location</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Location:</strong> {siteVisit.location_name || siteVisit.location}</div>
                  <div><strong>State:</strong> {siteVisit.state || 'Not specified'}</div>
                  {siteVisit.lga && <div><strong>LGA:</strong> {siteVisit.lga}</div>}
                  {siteVisit.facility && (
                    <div><strong>Facility:</strong> {siteVisit.facility?.name || siteVisit.facility_name}</div>
                  )}
                </div>
              </Card>

              {/* Dates */}
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Dates</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Start:</strong> {formatDate(siteVisit.start_date || siteVisit.proposed_start_date)}</div>
                  <div><strong>End:</strong> {formatDate(siteVisit.end_date || siteVisit.proposed_end_date)}</div>
                  {siteVisit.actual_start_date && (
                    <div><strong>Actual Start:</strong> {formatDate(siteVisit.actual_start_date)}</div>
                  )}
                  {siteVisit.actual_end_date && (
                    <div><strong>Actual End:</strong> {formatDate(siteVisit.actual_end_date)}</div>
                  )}
                </div>
              </Card>

              {/* Team Info */}
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold">Team</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Members:</strong> {siteVisit.team_members?.length || siteVisit.team_members_count || 0}</div>
                  <div><strong>Created by:</strong> {siteVisit.creator_name || siteVisit.created_by?.first_name + ' ' + siteVisit.created_by?.last_name || 'Unknown'}</div>
                  <div><strong>Created:</strong> {formatDate(siteVisit.created_datetime)}</div>
                </div>
              </Card>
            </div>

            {/* Purpose and Outcome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Purpose</h3>
                <p className="text-sm text-gray-700">{siteVisit.purpose || siteVisit.travel_reason || 'No purpose specified'}</p>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Expected Outcome</h3>
                <p className="text-sm text-gray-700">{siteVisit.expected_outcome || siteVisit.expected_outcomes || 'No expected outcome specified'}</p>
              </Card>
            </div>

            {siteVisit.additional_comments && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Additional Comments</h3>
                <p className="text-sm text-gray-700">{siteVisit.additional_comments}</p>
              </Card>
            )}
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Site Visit Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Site Visit Type</label>
                    <p className="mt-1">{SiteVisitTypeLabels[siteVisit.site_visit_type] || SiteVisitTypeLabels[siteVisit.visit_type] || siteVisit.site_visit_type_display || siteVisit.visit_type_display || 'Unknown Type'}</p>
                  </div>

                  {(siteVisit.other_type_description || siteVisit.other_visit_type) && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Other Type Description</label>
                      <p className="mt-1">{siteVisit.other_type_description || siteVisit.other_visit_type}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="mt-1">{siteVisit.location_name || siteVisit.location}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">State / LGA</label>
                    <p className="mt-1">{siteVisit.state || 'Not specified'} {siteVisit.lga && `/ ${siteVisit.lga}`}</p>
                  </div>

                  {(siteVisit.project || siteVisit.project_title) && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Related Project</label>
                      <p className="mt-1">{siteVisit.project_title || siteVisit.project}</p>
                    </div>
                  )}

                  {siteVisit.purpose && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Purpose</label>
                      <p className="mt-1">{siteVisit.purpose || siteVisit.travel_reason}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(siteVisit.status)}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Proposed Dates</label>
                    <p className="mt-1">
                      {formatDate(siteVisit.start_date || siteVisit.proposed_start_date)} - {formatDate(siteVisit.end_date || siteVisit.proposed_end_date)}
                    </p>
                  </div>

                  {(siteVisit.actual_start_date || siteVisit.actual_end_date) && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Actual Dates</label>
                      <p className="mt-1">
                        {siteVisit.actual_start_date ? formatDate(siteVisit.actual_start_date) : 'TBD'} -
                        {siteVisit.actual_end_date ? formatDate(siteVisit.actual_end_date) : 'TBD'}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="mt-1">{formatDate(siteVisit.created_datetime)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="mt-1">{formatDate(siteVisit.updated_datetime)}</p>
                  </div>

                  {siteVisit.estimated_budget && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Estimated Budget</label>
                      <p className="mt-1">₦{siteVisit.estimated_budget?.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {(siteVisit.special_requirements || siteVisit.additional_comments) && (
                <div className="mt-6 pt-6 border-t">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Special Requirements / Additional Comments</label>
                    <p className="mt-1 text-sm text-gray-700">{siteVisit.special_requirements || siteVisit.additional_comments}</p>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Team Members Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Team Members</h3>

              {!siteVisit?.team_members || siteVisit.team_members.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No team members assigned</p>
                </div>
              ) : (
              <div className="space-y-4">
                {siteVisit.team_members.map((member, index) => {
                  console.log(`🔍 Team Member ${index}:`, member);

                  // Extract user info from various possible structures
                  const firstName = member.user?.first_name || member.first_name || member.user_name?.split(' ')[0] || '';
                  const lastName = member.user?.last_name || member.last_name || member.user_name?.split(' ')[1] || '';
                  const email = member.user?.email || member.email || '';
                  const fullName = member.user_name || `${firstName} ${lastName}`.trim();
                  const roleLabel = member.role ? (TeamMemberRoleLabels[member.role] || member.role) : 'Team Member';

                  // Generate initials
                  const initials = firstName[0] && lastName[0] ?
                    `${firstName[0]}${lastName[0]}` :
                    fullName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'TM';

                  return (
                  <div key={member.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {initials.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {fullName || 'Unknown Member'}
                        </h4>
                        <p className="text-sm text-gray-600">{email || 'No email provided'}</p>
                        <p className="text-xs text-gray-500">{roleLabel}</p>
                        {member.per_day_allowance && (
                          <p className="text-xs text-green-600">
                            Daily Allowance: ₦{member.per_day_allowance?.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {member.added_datetime || member.created_datetime ?
                        `Added ${formatDate(member.added_datetime || member.created_datetime)}` :
                        'Date not available'
                      }
                    </div>
                  </div>
                  );
                })}
              </div>
              )}
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            <SiteVisitApprovalStatus siteVisit={siteVisit} />
          </TabsContent>

          {/* EA (Expense Authorization) Tab */}
          <TabsContent value="ea" className="space-y-6">
            {/* EA Status Overview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Expense Authorization Status</h3>

              {siteVisit.status === 'APPROVED' || siteVisit.ea_reference ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">EA Generation Available</p>
                      <p className="text-sm text-green-700">Site visit has been approved and is eligible for EA generation</p>
                    </div>
                  </div>

                  {siteVisit.ea_reference && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">EA Reference Number</label>
                        <p className="mt-1 font-medium text-lg">{siteVisit.ea_reference}</p>
                      </div>

                      {siteVisit.ea_created_date && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">EA Created Date</label>
                          <p className="mt-1">{formatDate(siteVisit.ea_created_date)}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">EA Generation Pending</p>
                    <p className="text-sm text-yellow-700">
                      Site visit must be fully approved before EA can be generated
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Team Members EA Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Team Members EA Status</h3>

              {siteVisit.team_members && siteVisit.team_members.length > 0 ? (
                <div className="space-y-4">
                  {siteVisit.team_members.map((member, index) => (
                    <div key={member.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {(member.user_name?.split(' ').map(n => n[0]).join('') || 'TM').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{member.user_name || 'Unknown Member'}</h4>
                          <p className="text-sm text-gray-600">{member.user_email || 'No email'}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        {member.ea_generated ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle size={16} />
                            <div>
                              <p className="text-sm font-medium">EA Generated</p>
                              {member.ea_number && (
                                <p className="text-xs">#{member.ea_number}</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock size={16} />
                            <span className="text-sm">EA Pending</span>
                          </div>
                        )}

                        {(member.per_day_allowance > 0 || member.transport_cost > 0 || member.accommodation_cost > 0) && (
                          <div className="text-xs text-gray-600 mt-1">
                            <p>Daily: ₦{parseFloat(member.per_day_allowance || '0').toLocaleString()}</p>
                            <p>Transport: ₦{parseFloat(member.transport_cost || '0').toLocaleString()}</p>
                            <p>Accommodation: ₦{parseFloat(member.accommodation_cost || '0').toLocaleString()}</p>
                            <p className="font-medium">Total: ₦{member.total_estimated_cost?.toLocaleString() || '0'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No team members found</p>
              )}
            </Card>

            {/* EA Actions */}
            {siteVisit.status === 'APPROVED' && !siteVisit.ea_reference && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">EA Actions</h3>
                <div className="flex items-center gap-4">
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => {
                      // TODO: Implement EA generation
                      console.log('Generate EA for site visit:', siteVisit.id);
                    }}
                  >
                    <FileText size={16} />
                    Generate EA for Site Visit
                  </Button>
                  <p className="text-sm text-gray-600">
                    This will create expense authorizations for all team members
                  </p>
                </div>
              </Card>
            )}

            {/* EA Summary */}
            {siteVisit.team_members && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Cost Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Team Members</p>
                    <p className="text-xl font-bold text-blue-600">{siteVisit.team_members.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">EAs Generated</p>
                    <p className="text-xl font-bold text-green-600">
                      {siteVisit.team_members.filter(m => m.ea_generated).length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Estimated Cost</p>
                    <p className="text-xl font-bold text-yellow-600">
                      ₦{siteVisit.team_members.reduce((sum, member) => sum + (member.total_estimated_cost || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-xl font-bold text-purple-600">{siteVisit.duration_days || 1} days</p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SiteVisitDetail;