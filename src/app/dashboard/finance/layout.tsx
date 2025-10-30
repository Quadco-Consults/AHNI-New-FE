'use client';

import React from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import { MODULE_PERMISSIONS, MODULE_CODES } from '@/constants/permissions';
import AccessDeniedPage from '@/components/AccessDeniedPage';

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard
      module={MODULE_CODES.FINANCE}
      fallback={
        <AccessDeniedPage
          module="finance"
          message="You don't have permission to access the Finance module. This module is restricted to finance department staff and authorized personnel."
          backUrl="/dashboard"
          showContactAdmin={true}
        />
      }
    >
      {children}
    </PermissionGuard>
  );
}