import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Generic empty state component for CBA
 */
export const CBAEmptyState = ({
  title,
  description,
  icon = "mdi:folder-open-outline",
  actionLabel,
  onAction
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="bg-gray-100 rounded-full p-6 mb-6">
        <Icon icon={icon} className="w-16 h-16 text-gray-400" />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-gray-600 text-center max-w-md mb-6">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Icon icon="mdi:plus" className="w-5 h-5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

/**
 * Empty state for when no committee evaluations exist
 */
export const NoEvaluationsEmptyState = ({ isCommitteeMember, cbaId }: { isCommitteeMember: boolean; cbaId: string }) => {
  const router = useRouter();

  const handleNavigateToEvaluation = () => {
    router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/vendor-analysis`);
  };

  if (isCommitteeMember) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="bg-yellow-100 rounded-full p-4 mb-4">
            <Icon icon="mdi:clipboard-list-outline" className="w-12 h-12 text-yellow-600" />
          </div>

          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            No Evaluations Submitted Yet
          </h3>

          <p className="text-yellow-800 mb-6">
            You haven't submitted your evaluation yet. Navigate to the Vendor Analysis page to submit your evaluation.
          </p>

          <button
            onClick={handleNavigateToEvaluation}
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium flex items-center gap-2"
          >
            <Icon icon="mdi:clipboard-edit" className="w-5 h-5" />
            Go to Vendor Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <Icon icon="mdi:account-group-outline" className="w-12 h-12 text-gray-400" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Waiting for Committee Evaluations
        </h3>

        <p className="text-gray-600">
          Committee members haven't submitted their evaluations yet. Check back later to view the consensus results.
        </p>
      </div>
    </div>
  );
};

/**
 * Empty state for when consensus hasn't been reached
 */
export const NoConsensusEmptyState = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center">
        <div className="bg-blue-100 rounded-full p-4 mb-4">
          <Icon icon="mdi:account-multiple-check" className="w-12 h-12 text-blue-600" />
        </div>

        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Consensus Not Yet Reached
        </h3>

        <p className="text-blue-800 mb-4">
          Waiting for more committee members to submit their evaluations to calculate consensus.
        </p>

        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">
            <Icon icon="mdi:information" className="inline w-4 h-4 mr-1" />
            Consensus requires at least 60% agreement among committee members.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Empty state for when no vendors have submitted bids
 */
export const NoVendorsEmptyState = () => {
  return (
    <CBAEmptyState
      title="No Vendor Submissions"
      description="No vendors have submitted bids for this solicitation yet. Once vendors submit their bids, you'll be able to analyze and evaluate them here."
      icon="mdi:store-outline"
    />
  );
};

/**
 * Empty state for when user is not a committee member
 */
export const NotCommitteeMemberEmptyState = () => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center">
        <div className="bg-red-100 rounded-full p-4 mb-4">
          <Icon icon="mdi:shield-lock-outline" className="w-12 h-12 text-red-600" />
        </div>

        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Access Restricted
        </h3>

        <p className="text-red-800">
          You are not a member of the evaluation committee for this CBA. Only assigned committee members can submit evaluations.
        </p>
      </div>
    </div>
  );
};

/**
 * Empty state for when no bid data is available on check-approval page
 */
export const NoBidDataEmptyState = ({
  hasCompanies,
  hasItems,
  cbaId,
  solicitationId,
  manualBidData,
  vendorSubmissionData,
  manualError,
  vendorError,
  onBackToCBA,
  onRefresh
}: {
  hasCompanies: boolean;
  hasItems: boolean;
  cbaId: string;
  solicitationId: string;
  manualBidData: any;
  vendorSubmissionData: any;
  manualError: any;
  vendorError: any;
  onBackToCBA: () => void;
  onRefresh: () => void;
}) => {
  const getMessage = () => {
    if (!hasCompanies && !hasItems) {
      return "There are no vendor bids or items to display for this analysis.";
    }
    if (!hasCompanies) {
      return "No vendors have submitted bids for this solicitation yet.";
    }
    return "No items found in the vendor bids.";
  };

  return (
    <div className="bg-blue-50 border border-blue-300 rounded-lg p-8 mb-6 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon icon="mdi:file-document-outline" className="text-blue-600 w-8 h-8" />
      </div>

      <h3 className="text-blue-900 font-semibold mb-2 text-lg">No Bid Data Available</h3>

      <p className="text-blue-700 mb-4">{getMessage()}</p>

      <div className="flex gap-3 justify-center">
        <button
          onClick={onBackToCBA}
          className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Back to CBA Details
        </button>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Optional debug section - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 text-left">
          <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
            Show technical details
          </summary>
          <div className="mt-3 bg-white rounded p-4 text-xs">
            <div className="space-y-2">
              <div><strong>Solicitation ID:</strong> {solicitationId}</div>
              <div><strong>CBA ID:</strong> {cbaId}</div>
              <div><strong>Manual Bid Data:</strong> {manualBidData ? '✅ Available' : '❌ Not Available'}</div>
              <div><strong>Vendor Submission Data:</strong> {vendorSubmissionData ? '✅ Available' : '❌ Not Available'}</div>
              {(manualError || vendorError) && (
                <div className="text-red-600 mt-2">
                  <strong>Errors:</strong>
                  {manualError && <div>• Manual Bid: {String(manualError)}</div>}
                  {vendorError && <div>• Vendor Submission: {String(vendorError)}</div>}
                </div>
              )}
            </div>
          </div>
        </details>
      )}
    </div>
  );
};
