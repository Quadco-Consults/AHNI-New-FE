"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SamplePreviewRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Get the request ID from the URL parameters
    const requestId = searchParams.get('request');
    const id = searchParams.get('id');

    if (requestId) {
      // Redirect to the details page
      router.replace(`/dashboard/procurement/purchase-request/${requestId}/details`);
    } else if (id) {
      // Fallback to using the id parameter
      router.replace(`/dashboard/procurement/purchase-request/${id}/details`);
    } else {
      // If no ID is provided, redirect to the main purchase request list
      router.replace('/dashboard/procurement/purchase-request');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to purchase request details...</p>
      </div>
    </div>
  );
}