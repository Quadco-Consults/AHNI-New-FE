"use client";

import React from "react";
import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Progress } from "components/ui/progress";
import { 
  CalendarCheck, 
  CalendarX, 
  Clock, 
  Calendar,
  TrendingUp,
  Info
} from "lucide-react";
import { LeaveBalance } from "../../types/leave";

interface LeaveBalanceCardProps {
  balance: LeaveBalance;
  showDetails?: boolean;
  className?: string;
}

const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({
  balance,
  showDetails = true,
  className = ""
}) => {
  if (!balance || !balance.leaveType) {
    return null; // Don't render if balance is invalid
  }

  // Support both normalized field names and various API formats
  const entitled = balance.entitled || balance.allocated || 0;
  const used = balance.used || 0;
  const available = balance.available || balance.remaining || (entitled - used - balance.pending || 0);
  const pending = balance.pending || 0;

  const utilizationPercentage = entitled > 0 ? (used / entitled) * 100 : 0;
  const pendingPercentage = entitled > 0 ? (pending / entitled) * 100 : 0;

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: balance.leaveType?.color || '#999' }}
          />
          <div>
            <h3 className="font-semibold text-lg">{balance.leaveType?.name || 'Unknown'}</h3>
            <p className="text-sm text-gray-600">{balance.leaveType?.description || ''}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {balance.year || new Date().getFullYear()}
        </Badge>
      </div>

      {/* Main Balance Display */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{available}</div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{entitled}</div>
          <div className="text-sm text-gray-600">Entitled</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span>Utilization</span>
          <span>{utilizationPercentage.toFixed(1)}%</span>
        </div>
        <Progress 
          value={utilizationPercentage} 
          className="h-2"
          style={{ 
            '--progress-background': balance.leaveType.color,
            '--progress-foreground': balance.leaveType.color 
          } as React.CSSProperties}
        />
      </div>

      {showDetails && (
        <>
          {/* Detailed Breakdown */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <CalendarX className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-600">{used}</span>
              </div>
              <span className="text-xs text-gray-600">Used</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-600">{pending}</span>
              </div>
              <span className="text-xs text-gray-600">Pending</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600">{balance.scheduled || 0}</span>
              </div>
              <span className="text-xs text-gray-600">Scheduled</span>
            </div>

            {(balance.carriedForward || 0) > 0 && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-purple-600">{balance.carriedForward || 0}</span>
                </div>
                <span className="text-xs text-gray-600">Carried Forward</span>
              </div>
            )}
          </div>

          {/* Additional Info */}
          {(balance.leaveType.maxConsecutiveDays || balance.leaveType.allowCarryForward) && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Policy Info</span>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                {balance.leaveType.maxConsecutiveDays && (
                  <div>Max consecutive: {balance.leaveType.maxConsecutiveDays} days</div>
                )}
                {balance.leaveType.allowCarryForward && (
                  <div>
                    Carry forward: {balance.leaveType.carryForwardLimit || 'Unlimited'} days
                  </div>
                )}
                {balance.leaveType.advanceNoticeDays > 0 && (
                  <div>Advance notice: {balance.leaveType.advanceNoticeDays} days</div>
                )}
              </div>
            </div>
          )}

          {/* Warning Messages */}
          {available < 5 && available > 0 && (
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
              <div className="flex items-center gap-1">
                <Info className="w-3 h-3" />
                <span>Low balance: Only {available} days remaining</span>
              </div>
            </div>
          )}

          {available <= 0 && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
              <div className="flex items-center gap-1">
                <CalendarX className="w-3 h-3" />
                <span>No leave balance remaining</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Last Updated */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Last updated: {new Date(balance.lastUpdated).toLocaleDateString("en-US")}
      </div>
    </Card>
  );
};

export default LeaveBalanceCard;