"use client";

import { Icon } from "@iconify/react";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Progress } from "components/ui/progress";
interface IMemberParticipationSummary {
  total_members: number;
  submitted_members: string[];
  pending_members: string[];
  members: {
    id: string;
    name: string;
    email: string;
    submitted: boolean;
    status: string;
    submitted_at?: string;
  }[];
}

interface CommitteeParticipationBannerProps {
  memberParticipation: IMemberParticipationSummary | null;
  allSubmitted: boolean;
  onSendReminders?: () => void;
}

const CommitteeParticipationBanner = ({
  memberParticipation,
  allSubmitted,
  onSendReminders
}: CommitteeParticipationBannerProps) => {
  if (!memberParticipation) {
    return (
      <Card className="p-4 bg-gray-50 border-gray-200">
        <div className="flex items-center justify-center text-gray-500">
          <Icon icon="eos-icons:loading" className="w-5 h-5 mr-2" />
          Loading committee participation status...
        </div>
      </Card>
    );
  }

  const submittedCount = memberParticipation.submitted_members?.length || 0;
  const totalCount = memberParticipation.total_members || 0;
  const progressPercentage = totalCount > 0 ? (submittedCount / totalCount) * 100 : 0;

  return (
    <Card className={`p-6 ${allSubmitted ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 flex items-center">
            <Icon icon="carbon:group" className="w-5 h-5 mr-2" />
            Committee Evaluation Status
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {submittedCount} of {totalCount} members have submitted their evaluations
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant={allSubmitted ? "success" : "darkYellow"} className="text-sm">
            {allSubmitted ? (
              <>
                <Icon icon="mdi:check-circle" className="w-4 h-4 mr-1" />
                All Members Submitted
              </>
            ) : (
              <>
                <Icon icon="mdi:clock-outline" className="w-4 h-4 mr-1" />
                Pending Submissions
              </>
            )}
          </Badge>

          {!allSubmitted && onSendReminders && (
            <Button size="sm" variant="outline" onClick={onSendReminders}>
              <Icon icon="mdi:email-outline" className="w-4 h-4 mr-1" />
              Send Reminders
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
      </div>

      {/* Member Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {memberParticipation.members?.map((member) => (
          <div
            key={member.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border ${
              member.submitted
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Icon
              icon={member.submitted ? "mdi:check-circle" : "mdi:clock-outline"}
              className={`w-5 h-5 ${
                member.submitted ? "text-green-600" : "text-yellow-600"
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 truncate">
                {member.name}
              </div>
              <div className="text-xs text-gray-600 truncate">
                {member.designation}
              </div>
              {member.submitted && member.submitted_at && (
                <div className="text-xs text-green-600 mt-1">
                  {new Date(member.submitted_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      {totalCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold text-green-600">{submittedCount}</div>
              <div className="text-gray-600">Submitted</div>
            </div>
            <div>
              <div className="font-semibold text-yellow-600">
                {memberParticipation.pending_members?.length || 0}
              </div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div>
              <div className="font-semibold text-blue-600">{totalCount}</div>
              <div className="text-gray-600">Total Members</div>
            </div>
          </div>
        </div>
      )}

      {/* Next Steps */}
      {!allSubmitted && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon icon="mdi:information-outline" className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <div className="font-semibold">Next Steps:</div>
              <div className="mt-1">
                Consensus analysis will be available once all committee members submit their evaluations.
                {memberParticipation.pending_members && memberParticipation.pending_members.length > 0 && (
                  <span className="block mt-1">
                    Waiting for: {memberParticipation.pending_members.length} member{memberParticipation.pending_members.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {allSubmitted && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-600" />
            <div className="text-sm text-green-800 font-semibold">
              All evaluations submitted! Consensus analysis is now available.
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CommitteeParticipationBanner;