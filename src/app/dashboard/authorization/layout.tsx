'use client';

import React from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import { SETTINGS_PERMISSIONS } from '@/constants/permissions';
import AccessDeniedPage from '@/components/AccessDeniedPage';

export default function AuthorizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard
      anyPermissions={[
        SETTINGS_PERMISSIONS.VIEW_ROLES,
        SETTINGS_PERMISSIONS.VIEW_PERMISSIONS,
        SETTINGS_PERMISSIONS.MANAGE_PERMISSIONS
      ]}
      fallback={
        <AccessDeniedPage
          feature="Authorization Management"
          message="You don't have permission to access the Authorization Management system. This feature requires role or permission management privileges."
          backUrl="/dashboard"
          showContactAdmin={true}
        />
      }
    >
      {children}
    </PermissionGuard>
  );
}