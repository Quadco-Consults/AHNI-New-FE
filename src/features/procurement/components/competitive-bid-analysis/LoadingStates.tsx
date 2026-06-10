import { Icon } from '@iconify/react';

interface LoadingStateProps {
  message?: string;
}

/**
 * Contextual loading state for CBA pages
 */
export const CBALoadingState = ({ message = "Loading..." }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
        {/* Spinning circle */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

        {/* Icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon icon="mdi:file-document-outline" className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
};

/**
 * Loading skeleton for evaluation cards
 */
export const EvaluationCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

/**
 * Loading skeleton for consensus results
 */
export const ConsensusResultsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
