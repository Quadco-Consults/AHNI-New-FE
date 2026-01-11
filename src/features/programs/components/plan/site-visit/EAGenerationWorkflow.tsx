"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Zap,
  Eye,
  RefreshCw,
} from "lucide-react";

import {
  SiteVisitStatus,
  SiteVisitStatusLabels,
  ISiteVisit,
  ISiteVisitTeamMember,
} from "@/features/programs/types/site-visit";

import {
  useGenerateEAsFromSiteVisit,
  useGetSiteVisitTeamMembers,
  useGenerateTeamMemberEA,
} from "@/features/programs/controllers/siteVisitController";

interface EAGenerationWorkflowProps {
  siteVisit: ISiteVisit;
  canGenerateEA?: boolean;
  onEAGenerated?: () => void;
}

const EAGenerationWorkflow = ({
  siteVisit,
  canGenerateEA = false,
  onEAGenerated,
}: EAGenerationWorkflowProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Fetch team members to get EA status
  const {
    data: teamMembersData,
    isLoading: isTeamLoading,
    error: teamError,
  } = useGetSiteVisitTeamMembers(siteVisit.id);

  // Mutations
  const generateAllEAsMutation = useGenerateEAsFromSiteVisit(siteVisit.id);
  const generateMemberEAMutation = useGenerateTeamMemberEA(selectedMemberId || "");

  const teamMembers = teamMembersData?.data?.results || [];

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getEAStatus = () => {
    if (teamMembers.length === 0) return { status: 'none', label: 'No Team Members', color: 'text-gray-500' };

    const generatedCount = teamMembers.filter(m => m.ea_generated).length;
    const totalCount = teamMembers.length;

    if (generatedCount === 0) {
      return { status: 'none', label: 'Not Generated', color: 'text-gray-500' };
    } else if (generatedCount === totalCount) {
      return { status: 'complete', label: 'All Generated', color: 'text-green-600' };
    } else {
      return { status: 'partial', label: `${generatedCount}/${totalCount} Generated`, color: 'text-orange-600' };
    }
  };

  const canGenerateEAs = () => {
    return (
      canGenerateEA &&
      (siteVisit.status === SiteVisitStatus.APPROVED ||
       siteVisit.status === SiteVisitStatus.EA_GENERATED) &&
      teamMembers.length > 0
    );
  };

  const handleGenerateAllEAs = async () => {
    if (!canGenerateEAs()) {
      toast.error("Cannot generate EAs at this time");
      return;
    }

    const confirmMessage = `Generate Expense Authorizations for all ${teamMembers.length} team members?`;
    if (!confirm(confirmMessage)) return;

    try {
      await generateAllEAsMutation.mutateAsync();
      toast.success("All Expense Authorizations generated successfully");
      if (onEAGenerated) onEAGenerated();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate EAs");
    }
  };

  const handleGenerateMemberEA = async (memberId: string, memberName: string) => {
    const confirmMessage = `Generate Expense Authorization for ${memberName}?`;
    if (!confirm(confirmMessage)) return;

    try {
      setSelectedMemberId(memberId);
      await generateMemberEAMutation.mutateAsync();
      toast.success(`EA generated successfully for ${memberName}`);
      setSelectedMemberId(null);
      if (onEAGenerated) onEAGenerated();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate EA");
      setSelectedMemberId(null);
    }
  };

  const eaStatus = getEAStatus();
  const totalEstimatedCost = teamMembers.reduce((sum, member) => sum + (member.total_estimated_cost || 0), 0);

  if (isTeamLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Expense Authorization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (teamError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Expense Authorization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <AlertCircle className="mx-auto h-12 w-12 mb-4" />
            <p>Error loading EA information</p>
            <p className="text-sm mt-1">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* EA Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Expense Authorization
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant={eaStatus.status === 'complete' ? 'default' : 'outline'}
                className={eaStatus.color}
              >
                {eaStatus.label}
              </Badge>
              {canGenerateEAs() && eaStatus.status !== 'complete' && (
                <Button
                  onClick={handleGenerateAllEAs}
                  disabled={generateAllEAsMutation.isPending}
                  size="sm"
                >
                  {generateAllEAsMutation.isPending ? (
                    <>
                      <LoadingSpinner />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate All EAs
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Site Visit Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Location</span>
              </div>
              <div className="text-sm">{siteVisit.location_name || 'N/A'}</div>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Duration</span>
              </div>
              <div className="text-sm">
                {formatDate(siteVisit.start_date)} - {formatDate(siteVisit.end_date)}
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Team Size</span>
              </div>
              <div className="text-sm">{teamMembers.length} members</div>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">Total Cost</span>
              </div>
              <div className="text-sm font-semibold">{formatCurrency(totalEstimatedCost)}</div>
            </div>
          </div>

          {/* EA Generation Status */}
          {siteVisit.status !== SiteVisitStatus.APPROVED && siteVisit.status !== SiteVisitStatus.EA_GENERATED ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">EA Generation Not Available</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Expense Authorizations can only be generated after the site visit has been fully approved.
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Current Status: <Badge variant="outline">{SiteVisitStatusLabels[siteVisit.status]}</Badge>
                  </p>
                </div>
              </div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">No Team Members</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Add team members to this site visit before generating Expense Authorizations.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Prerequisites Check */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Site Visit Approved</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Team Members Added</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Ready for EA Generation</span>
                </div>
              </div>

              {/* Team Members EA Status */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Team Members & EA Status</h4>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium">
                            {member.user_name || `User ID: ${member.user}`}
                          </span>
                          {member.visit_number && (
                            <Badge variant="outline" className="font-mono text-xs">
                              #{member.visit_number}
                            </Badge>
                          )}
                        </div>

                        <div className="text-sm text-gray-600">
                          {member.total_estimated_cost && (
                            <span>Total Cost: {formatCurrency(member.total_estimated_cost)}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* EA Status */}
                        {member.ea_generated ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm">EA Generated</span>
                            {member.ea_number && (
                              <Badge variant="outline" className="font-mono text-xs">
                                {member.ea_number}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500">
                            <XCircle className="h-4 w-4" />
                            <span className="text-sm">EA Pending</span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        {canGenerateEAs() && !member.ea_generated && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateMemberEA(member.id, member.user_name || 'Member')}
                            disabled={
                              generateMemberEAMutation.isPending && selectedMemberId === member.id
                            }
                          >
                            {generateMemberEAMutation.isPending && selectedMemberId === member.id ? (
                              <LoadingSpinner />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                            Generate EA
                          </Button>
                        )}

                        {member.ea_generated && member.expense_authorization && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // TODO: Implement EA download/view functionality
                              toast.info("EA download functionality will be implemented");
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            View EA
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EA Generation Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {teamMembers.filter(m => m.ea_generated).length}
                  </div>
                  <div className="text-sm text-blue-600">EAs Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {teamMembers.filter(m => !m.ea_generated).length}
                  </div>
                  <div className="text-sm text-orange-600">EAs Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      teamMembers
                        .filter(m => m.ea_generated)
                        .reduce((sum, m) => sum + (m.total_estimated_cost || 0), 0)
                    )}
                  </div>
                  <div className="text-sm text-green-600">Total Authorized</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">EA Generation Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</div>
              <p>Ensure the site visit has been fully approved through all approval levels.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</div>
              <p>Add all team members with their roles and estimated costs.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</div>
              <p>Generate Expense Authorizations either individually or for all team members at once.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">4</div>
              <p>EAs will be automatically linked to the travel rate system for cost calculations.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">5</div>
              <p>Team members will receive notifications once their EAs are generated.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EAGenerationWorkflow;