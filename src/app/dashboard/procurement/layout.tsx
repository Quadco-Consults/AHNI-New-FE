'use client';

import React from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import { MODULE_PERMISSIONS, MODULE_CODES } from '@/constants/permissions';
import AccessDeniedPage from '@/components/AccessDeniedPage';

export default function ProcurementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard
      module={MODULE_CODES.PROCUREMENT}
      fallback={
        <AccessDeniedPage
          module="procurement"
          message="You don't have permission to access the Procurement module. This module is restricted to procurement department staff and authorized personnel."
          backUrl="/dashboard"
          showContactAdmin={true}
        />
      }
    >
      {children}
    </PermissionGuard>
  );
}