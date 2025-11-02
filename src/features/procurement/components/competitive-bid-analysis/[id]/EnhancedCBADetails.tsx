"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { LoadingSpinner } from "components/Loading";
import BreadcrumbCard from "components/Breadcrumb";
import GoBack from "components/GoBack";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import {
  useGetMemberParticipation,
  useCurrentUser
} from "@/features/procurement/controllers/committeeEvaluationController";
import CommitteeParticipationBanner from "./committee-evaluation/CommitteeParticipationBanner";
import MemberEvaluationDashboard from "./committee-evaluation/MemberEvaluationDashboard";
import ConsensusAnalysis from "./committee-evaluation/ConsensusAnalysis";

// Import the original CBA details component
import CompetitiveBidAnalysisDetail from "./index";

const EnhancedCBADetails = () => {
  const { id } = useParams() as { id: string };
  const currentUser = useCurrentUser();

  const { data: cbaData, isLoading: cbaLoading } = CbaAPI.useGetSingleCba(id);
  const { data: memberParticipation, isLoading: participationLoading } = useGetMemberParticipation(id);

  // Check if this is a committee-based CBA
  const isCommitteeCBA = cbaData?.data?.cba_type === 'COMMITTEE';

  // Check if all committee members have submitted their evaluations
  const allMembersSubmitted = useMemo(() => {
    if (!cbaData?.data?.committee_members || !memberParticipation) return false;

    return cbaData.data.committee_members.every(member =>
      memberParticipation.submitted_members.includes(member.id)
    );
  }, [cbaData, memberParticipation]);

  // Check if current user is a committee member
  const isCommitteeMember = useMemo(() => {
    if (!isCommitteeCBA || !cbaData?.data?.committee_members) return false;

    return cbaData.data.committee_members.some(member => member.id === currentUser.id);
  }, [isCommitteeCBA, cbaData, currentUser.id]);

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Competitive Bid Analysis", icon: true },
    { name: "Details", icon: false },
  ];

  if (cbaLoading) {
    return <LoadingSpinner />;
  }

  // For non-committee CBAs, show the original component
  if (!isCommitteeCBA) {
    return <CompetitiveBidAnalysisDetail />;
  }

  const handleSendReminders = () => {
    // TODO: Implement reminder functionality
    console.log("Sending reminders to pending committee members");
  };

  return (
    <div className="space-y-6">
      <BreadcrumbCard list={breadcrumbs} />
      <GoBack />

      {/* CBA Header Info */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Committee-Based CBA Analysis</h1>
            <p className="text-blue-100">
              CBA ID: {id} | Type: {cbaData?.data?.cba_type}
            </p>
            <p className="text-blue-100 text-sm mt-1">
              {cbaData?.data?.committee_members?.length || 0} committee members assigned
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{memberParticipation?.total_members || 0}</div>
            <div className="text-sm text-blue-200">Total Members</div>
          </div>
        </div>
      </div>

      {/* Committee Participation Status */}
      <CommitteeParticipationBanner
        memberParticipation={memberParticipation}
        allSubmitted={allMembersSubmitted}
        onSendReminders={handleSendReminders}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue={isCommitteeMember ? "my-evaluation" : "committee-overview"} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {isCommitteeMember && (
            <TabsTrigger value="my-evaluation">My Evaluation</TabsTrigger>
          )}
          <TabsTrigger value="committee-overview">Committee Overview</TabsTrigger>
          <TabsTrigger
            value="consensus-analysis"
            disabled={!allMembersSubmitted}
            className="disabled:opacity-50"
          >
            Consensus Analysis
          </TabsTrigger>
          <TabsTrigger
            value="final-results"
            disabled={!allMembersSubmitted}
            className="disabled:opacity-50"
          >
            Final Results
          </TabsTrigger>
        </TabsList>

        {/* Individual Member Evaluation Tab */}
        {isCommitteeMember && (
          <TabsContent value="my-evaluation" className="space-y-6">
            <MemberEvaluationDashboard />
          </TabsContent>
        )}

        {/* Committee Overview Tab */}
        <TabsContent value="committee-overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Committee Members List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Committee Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cbaData?.data?.committee_members?.map((member) => {
                  const memberStatus = memberParticipation?.members?.find(m => m.id === member.id);
                  const isCurrentUser = member.id === currentUser.id;

                  return (
                    <div
                      key={member.id}
                      className={`p-4 border rounded-lg ${
                        isCurrentUser
                          ? 'border-blue-300 bg-blue-50'
                          : memberStatus?.submitted
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {member.first_name} {member.last_name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                You
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600">{member.designation}</p>
                        </div>
                        <div className="text-right">
                          {memberStatus?.submitted ? (
                            <div className="text-green-600 text-sm font-semibold">
                              ✓ Submitted
                            </div>
                          ) : (
                            <div className="text-yellow-600 text-sm font-semibold">
                              ⏳ Pending
                            </div>
                          )}
                          {memberStatus?.submitted_at && (
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(memberStatus.submitted_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
              <div className="space-y-3">
                <div className="bg-white p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {memberParticipation?.submitted_members?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Evaluations Submitted</div>
                </div>
                <div className="bg-white p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {memberParticipation?.pending_members?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Pending Evaluations</div>
                </div>
                <div className="bg-white p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(((memberParticipation?.submitted_members?.length || 0) / (memberParticipation?.total_members || 1)) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Consensus Analysis Tab */}
        <TabsContent value="consensus-analysis" className="space-y-6">
          {allMembersSubmitted ? (
            <ConsensusAnalysis cbaId={id} />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                Consensus analysis will be available once all committee members submit their evaluations.
              </div>
              <div className="text-sm text-gray-500">
                Currently waiting for {memberParticipation?.pending_members?.length || 0} more evaluation(s).
              </div>
            </div>
          )}
        </TabsContent>

        {/* Final Results Tab */}
        <TabsContent value="final-results" className="space-y-6">
          {allMembersSubmitted ? (
            <div className="space-y-6">
              {/* This would integrate with the existing CBA analysis results */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Final CBA Results</h3>
                <p className="text-gray-600 mb-4">
                  Based on committee consensus analysis, the following results have been determined:
                </p>

                {/* This would show the original CBA analysis component but with consensus data */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    Integration with existing CBA analysis results will show here.
                    This will display the final vendor selection based on committee consensus.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                Final results will be available once consensus analysis is completed.
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCBADetails;