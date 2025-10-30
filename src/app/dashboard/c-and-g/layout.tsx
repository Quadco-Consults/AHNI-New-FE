'use client';

import React from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import { MODULE_PERMISSIONS, MODULE_CODES } from '@/constants/permissions';
import AccessDeniedPage from '@/components/AccessDeniedPage';

export default function ContractsAndGrantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard
      module={MODULE_CODES.CONTRACTS}
      fallback={
        <AccessDeniedPage
          module="contracts"
          message="You don't have permission to access the Contracts & Grants module. This module is restricted to C&G department staff and authorized personnel."
          backUrl="/dashboard"
          showContactAdmin={true}
        />
      }
    >
      {children}
    </PermissionGuard>
  );
}