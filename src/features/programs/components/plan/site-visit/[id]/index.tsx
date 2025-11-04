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
            {siteVisit.ea_reference && (
              <TabsTrigger value="ea">EA Details</TabsTrigger>
            )}
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
                  <div><strong>Location:</strong> {siteVisit.location}</div>
                  <div><strong>State:</strong> {siteVisit.state}</div>
                  {siteVisit.lga && <div><strong>LGA:</strong> {siteVisit.lga}</div>}
                  {siteVisit.facility && (
                    <div><strong>Facility:</strong> {siteVisit.facility.name}</div>
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
                  <div><strong>Start:</strong> {formatDate(siteVisit.proposed_start_date)}</div>
                  <div><strong>End:</strong> {formatDate(siteVisit.proposed_end_date)}</div>
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
                  <div><strong>Members:</strong> {siteVisit.team_members.length}</div>
                  <div><strong>Created by:</strong> {siteVisit.created_by.first_name} {siteVisit.created_by.last_name}</div>
                  <div><strong>Created:</strong> {formatDate(siteVisit.created_datetime)}</div>
                </div>
              </Card>
            </div>

            {/* Purpose and Outcome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Reason for Travel</h3>
                <p className="text-sm text-gray-700">{siteVisit.travel_reason}</p>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Expected Outcome</h3>
                <p className="text-sm text-gray-700">{siteVisit.expected_outcome}</p>
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
                    <p className="mt-1">{SiteVisitTypeLabels[siteVisit.site_visit_type]}</p>
                  </div>

                  {siteVisit.other_type_description && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Other Type Description</label>
                      <p className="mt-1">{siteVisit.other_type_description}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="mt-1">{siteVisit.location}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">State / LGA</label>
                    <p className="mt-1">{siteVisit.state} {siteVisit.lga && `/ ${siteVisit.lga}`}</p>
                  </div>

                  {siteVisit.project && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Related Project</label>
                      <p className="mt-1">{siteVisit.project}</p>
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
                      {formatDate(siteVisit.proposed_start_date)} - {formatDate(siteVisit.proposed_end_date)}
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
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Team Members Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Team Members</h3>

              <div className="space-y-4">
                {siteVisit.team_members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {member.user.first_name[0]}{member.user.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {member.user.first_name} {member.user.last_name}
                        </h4>
                        <p className="text-sm text-gray-600">{member.user.email}</p>
                        {member.role && (
                          <p className="text-xs text-gray-500">{member.role}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Added {formatDate(member.added_datetime)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            <SiteVisitApprovalStatus siteVisit={siteVisit} />
          </TabsContent>

          {/* EA Details Tab */}
          {siteVisit.ea_reference && (
            <TabsContent value="ea" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">EA Details</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">EA Reference</label>
                    <p className="mt-1 font-medium">{siteVisit.ea_reference}</p>
                  </div>

                  {siteVisit.ea_created_date && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">EA Created Date</label>
                      <p className="mt-1">{formatDate(siteVisit.ea_created_date)}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={16} />
                    <span className="text-sm">EA has been automatically created</span>
                  </div>
                </div>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default SiteVisitDetail;