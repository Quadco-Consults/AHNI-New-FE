'use client';

import React from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import { MODULE_PERMISSIONS, MODULE_CODES } from '@/constants/permissions';
import AccessDeniedPage from '@/components/AccessDeniedPage';

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard
      module={MODULE_CODES.PROGRAMS}
      fallback={
        <AccessDeniedPage
          module="programs"
          message="You don't have permission to access the Programs module. This module is restricted to programs department staff and authorized personnel."
          backUrl="/dashboard"
          showContactAdmin={true}
        />
      }
    >
      {children}
    </PermissionGuard>
  );
}