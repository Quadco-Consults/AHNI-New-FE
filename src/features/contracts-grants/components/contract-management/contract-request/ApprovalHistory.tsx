import { IApprovalComment } from "@/features/contracts-grants/types/contract-management/contract-request";

interface ApprovalHistoryProps {
  comments?: IApprovalComment[];
}

export default function ApprovalHistory({ comments }: ApprovalHistoryProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className="space-y-5">
        <h3 className="text-xl font-semibold">Approval History</h3>
        <p className="text-gray-500 italic">No approval history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-semibold">Approval History</h3>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r"
          >
            {/* User and Action */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-900">
                  {comment.created_by.first_name} {comment.created_by.last_name}
                </p>
                <p className="text-sm text-gray-600">
                  {comment.created_by.email}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                {new Date(comment.created_datetime).toLocaleString()}
              </p>
            </div>

            {/* Status Change */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded">
                {comment.old_status_display || comment.old_status}
              </span>
              <span className="text-gray-400">→</span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-200 text-blue-700 rounded">
                {comment.new_status_display || comment.new_status}
              </span>
            </div>

            {/* Comment */}
            {comment.comment && (
              <div className="mt-2">
                <p className="text-sm text-gray-700 italic">
                  &quot;{comment.comment}&quot;
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
