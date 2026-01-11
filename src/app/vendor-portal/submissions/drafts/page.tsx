"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Clock, AlertCircle, Trash2, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DraftSubmissionsPage() {
  const router = useRouter();

  // Mock draft submissions - this would come from API
  const draftSubmissions = [
    {
      id: "1",
      rfq_title: "Medical Equipment Procurement",
      rfq_id: "RFQ-2024-001",
      saved_at: "2024-12-05T14:30:00Z",
      completion_percentage: 75,
      items_completed: 8,
      total_items: 12,
      closing_date: "2024-12-15T23:59:59Z"
    },
    {
      id: "2",
      rfq_title: "Office Supplies Tender",
      rfq_id: "RFQ-2024-002",
      saved_at: "2024-12-04T16:45:00Z",
      completion_percentage: 40,
      items_completed: 3,
      total_items: 8,
      closing_date: "2024-12-20T23:59:59Z"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysRemaining = (closingDate: string) => {
    const now = new Date();
    const closing = new Date(closingDate);
    const diffTime = closing.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Draft Submissions</h1>
        <p className="text-gray-600 mt-1">
          Continue working on your saved bid submissions
        </p>
      </div>

      {/* Alert */}
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Draft submissions are automatically saved as you work. Remember to submit before the deadline.
        </AlertDescription>
      </Alert>

      {/* Draft Submissions List */}
      <div className="space-y-4">
        {draftSubmissions.length > 0 ? (
          draftSubmissions.map((draft) => {
            const daysRemaining = getDaysRemaining(draft.closing_date);
            const isUrgent = daysRemaining <= 3;

            return (
              <Card key={draft.id} className={`hover:shadow-md transition-shadow ${
                isUrgent ? 'border-orange-200 bg-orange-50' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {draft.rfq_title}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          Draft
                        </Badge>
                        {isUrgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent - {daysRemaining} days left
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        RFQ ID: {draft.rfq_id}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Completion Progress
                          </span>
                          <span className="text-sm text-gray-500">
                            {draft.items_completed} of {draft.total_items} items completed
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              draft.completion_percentage >= 80 ? 'bg-green-500' :
                              draft.completion_percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${draft.completion_percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {draft.completion_percentage}% complete
                        </p>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last saved: {formatDate(draft.saved_at)}
                        </span>
                        <span className={`flex items-center gap-1 ${
                          isUrgent ? 'text-orange-600 font-medium' : ''
                        }`}>
                          <AlertCircle className="h-3 w-3" />
                          Closes: {formatDate(draft.closing_date)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => router.push(`/vendor-portal/rfqs/${draft.rfq_id}/submit`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Continue
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete Draft
                      </Button>
                    </div>
                  </div>

                  {isUrgent && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This RFQ closes in {daysRemaining} day(s). Please complete and submit soon to avoid missing the deadline.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Draft Submissions</h3>
              <p className="text-gray-500 mb-4">
                You don't have any saved drafts. Start bidding on available RFQs to create drafts.
              </p>
              <Button onClick={() => router.push('/vendor-portal/rfqs')}>
                View Available RFQs
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Statistics */}
      {draftSubmissions.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Draft Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{draftSubmissions.length}</p>
                <p className="text-sm text-blue-800">Total Drafts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {draftSubmissions.filter(d => d.completion_percentage >= 80).length}
                </p>
                <p className="text-sm text-green-800">Nearly Complete</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {draftSubmissions.filter(d => getDaysRemaining(d.closing_date) <= 3).length}
                </p>
                <p className="text-sm text-orange-800">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}