"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

interface ClientOnlyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ClientOnlyComponent = ({ children, fallback }: ClientOnlyWrapperProps) => {
  return <>{children}</>;
};

// Disable SSR for this component
const ClientOnlyWrapper = dynamic(() => Promise.resolve(ClientOnlyComponent), {
  ssr: false,
  loading: () => <div>{typeof window !== 'undefined' ? 'Loading...' : ''}</div>
});

export default ClientOnlyWrapper;