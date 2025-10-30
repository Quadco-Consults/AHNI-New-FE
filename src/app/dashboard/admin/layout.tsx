'use client';

import React from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import { MODULE_PERMISSIONS, MODULE_CODES } from '@/constants/permissions';
import AccessDeniedPage from '@/components/AccessDeniedPage';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard
      customCheck={() => {
        // Temporarily allow all authenticated users to access admin for role setup
        return true;
      }}
      fallback={
        <AccessDeniedPage
          module="admin"
          message="You don't have permission to access the Admin module. This module is restricted to administrative staff and authorized personnel."
          backUrl="/dashboard"
          showContactAdmin={true}
        />
      }
    >
      {children}
    </PermissionGuard>
  );
}