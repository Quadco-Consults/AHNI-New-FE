import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

// Skeleton for tables
const TableSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-200 rounded mb-4"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-8 bg-gray-100 rounded mb-2"></div>
    ))}
  </div>
);

// Factory function for dynamic imports with consistent loading states
export const createDynamicComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    loading?: ComponentType;
    ssr?: boolean;
  } = {}
) => {
  return dynamic(importFn, {
    loading: options.loading || LoadingSpinner,
    ssr: options.ssr ?? true,
  });
};

// Pre-configured dynamic imports for common patterns
export const createTableComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return dynamic(importFn, {
    loading: TableSkeleton,
    ssr: false, // Tables often need client-side data
  });
};

export const createAdminComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return dynamic(importFn, {
    loading: LoadingSpinner,
    ssr: false, // Admin components don't need SSR
  });
};

export const createModalComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return dynamic(importFn, {
    loading: () => null, // Modals don't need loading states
    ssr: false, // Modals are always client-side
  });
};