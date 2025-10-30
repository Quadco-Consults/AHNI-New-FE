'use client';

import React from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import { SETTINGS_PERMISSIONS } from '@/constants/permissions';
import AccessDeniedPage from '@/components/AccessDeniedPage';

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard
      permission={SETTINGS_PERMISSIONS.SYSTEM_ADMIN}
      fallback={
        <AccessDeniedPage
          feature="Module Management"
          permission={SETTINGS_PERMISSIONS.SYSTEM_ADMIN}
          message="You don't have permission to access the Module Management system. This feature is restricted to system administrators only."
          backUrl="/dashboard"
          showContactAdmin={true}
        />
      }
    >
      {children}
    </PermissionGuard>
  );
}