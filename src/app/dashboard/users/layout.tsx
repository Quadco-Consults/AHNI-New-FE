'use client';

import React from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import { SETTINGS_PERMISSIONS } from '@/constants/permissions';
import AccessDeniedPage from '@/components/AccessDeniedPage';

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard
      permission={SETTINGS_PERMISSIONS.VIEW_USERS}
      fallback={
        <AccessDeniedPage
          feature="User Management"
          permission={SETTINGS_PERMISSIONS.VIEW_USERS}
          message="You don't have permission to access the User Management system. This feature is restricted to administrators and authorized personnel only."
          backUrl="/dashboard"
          showContactAdmin={true}
        />
      }
    >
      {children}
    </PermissionGuard>
  );
}