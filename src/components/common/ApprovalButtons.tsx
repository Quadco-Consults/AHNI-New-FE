'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Shield, Eye } from 'lucide-react';
import { useApprovalPermissions } from '@/hooks/usePermissions';
import PermissionGate from './PermissionGate';
import { UIPermissionCategory } from '@/utils/positionRolePermissions';

interface ApprovalButtonsProps {
  onReview?: () => void;
  onAuthorize?: () => void;
  onApprove?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'lg' | 'default';
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
}

/**
 * ApprovalButtons component that automatically shows/hides buttons based on user permissions
 *
 * This is the perfect example for the Admin Officer scenario:
 * - Admin Officer: Will see NO buttons (no approval permissions)
 * - HR Manager: Will see Approve button (has can_approve permission)
 * - Finance Manager: Will see Authorize button (has can_authorize permission)
 * - Director: Will see all buttons (has all approval permissions)
 */
export default function ApprovalButtons({
  onReview,
  onAuthorize,
  onApprove,
  disabled = false,
  size = 'default',
  variant = 'default'
}: ApprovalButtonsProps) {
  const { canReview, canAuthorize, canApprove, hasAnyApprovalPermission, isLoading } = useApprovalPermissions();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex space-x-2">
        <div className="h-10 w-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 w-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 w-20 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  // If user has no approval permissions, don't render anything
  if (!hasAnyApprovalPermission) {
    return null;
  }

  return (
    <div className="flex space-x-2">
      {/* Review Button - Only shows if user can review */}
      <PermissionGate permission={UIPermissionCategory.REVIEW_REQUESTS}>
        <Button
          onClick={onReview}
          disabled={disabled}
          size={size}
          variant={variant}
          className="flex items-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>Review</span>
        </Button>
      </PermissionGate>

      {/* Authorize Button - Only shows if user can authorize */}
      <PermissionGate permission={UIPermissionCategory.AUTHORIZE_REQUESTS}>
        <Button
          onClick={onAuthorize}
          disabled={disabled}
          size={size}
          variant={variant}
          className="flex items-center space-x-1"
        >
          <Shield className="w-4 h-4" />
          <span>Authorize</span>
        </Button>
      </PermissionGate>

      {/* Approve Button - Only shows if user can approve */}
      <PermissionGate permission={UIPermissionCategory.APPROVE_REQUESTS}>
        <Button
          onClick={onApprove}
          disabled={disabled}
          size={size}
          variant={variant}
          className="flex items-center space-x-1"
        >
          <Check className="w-4 h-4" />
          <span>Approve</span>
        </Button>
      </PermissionGate>
    </div>
  );
}

/**
 * Alternative implementation using the hook directly instead of PermissionGate
 */
export function ApprovalButtonsWithHooks({
  onReview,
  onAuthorize,
  onApprove,
  disabled = false,
  size = 'default',
  variant = 'default'
}: ApprovalButtonsProps) {
  const { canReview, canAuthorize, canApprove, hasAnyApprovalPermission, isLoading } = useApprovalPermissions();

  if (isLoading) {
    return <div>Loading approval options...</div>;
  }

  if (!hasAnyApprovalPermission) {
    return null; // Admin Officer will get this - no buttons shown
  }

  return (
    <div className="flex space-x-2">
      {canReview && (
        <Button
          onClick={onReview}
          disabled={disabled}
          size={size}
          variant={variant}
          className="flex items-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>Review</span>
        </Button>
      )}

      {canAuthorize && (
        <Button
          onClick={onAuthorize}
          disabled={disabled}
          size={size}
          variant={variant}
          className="flex items-center space-x-1"
        >
          <Shield className="w-4 h-4" />
          <span>Authorize</span>
        </Button>
      )}

      {canApprove && (
        <Button
          onClick={onApprove}
          disabled={disabled}
          size={size}
          variant={variant}
          className="flex items-center space-x-1"
        >
          <Check className="w-4 h-4" />
          <span>Approve</span>
        </Button>
      )}
    </div>
  );
}