'use client';

import React from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import { MODULE_PERMISSIONS, MODULE_CODES } from '@/constants/permissions';
import AccessDeniedPage from '@/components/AccessDeniedPage';

export default function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard
      module={MODULE_CODES.HR}
      fallback={
        <AccessDeniedPage
          module="hr"
          message="You don't have permission to access the HR module. This module is restricted to HR department staff and authorized personnel."
          backUrl="/dashboard"
          showContactAdmin={true}
        />
      }
    >
      {children}
    </PermissionGuard>
  );
}