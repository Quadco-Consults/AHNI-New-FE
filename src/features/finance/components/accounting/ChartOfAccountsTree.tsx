"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, FolderOpen, File } from "lucide-react";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Card } from "components/ui/card";
import { cn } from "lib/utils";
import { ChartOfAccount } from "../../types/accounting.types";

interface ChartOfAccountsTreeProps {
  accounts: ChartOfAccount[];
  onAddAccount: (parentId?: string) => void;
  onEditAccount: (account: ChartOfAccount) => void;
  onDeleteAccount: (account: ChartOfAccount) => void;
  loading?: boolean;
}

interface TreeNodeProps {
  account: ChartOfAccount;
  children: ChartOfAccount[];
  level: number;
  onAddAccount: (parentId?: string) => void;
  onEditAccount: (account: ChartOfAccount) => void;
  onDeleteAccount: (account: ChartOfAccount) => void;
}

const accountTypeColors = {
  ASSETS: "bg-blue-100 text-blue-800",
  LIABILITIES: "bg-red-100 text-red-800",
  EQUITY: "bg-purple-100 text-purple-800",
  REVENUE: "bg-green-100 text-green-800",
  EXPENSES: "bg-orange-100 text-orange-800",
};

function TreeNode({ account, children, level, onAddAccount, onEditAccount, onDeleteAccount }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first two levels
  const hasChildren = children.length > 0;
  const indent = level * 24;

  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group transition-colors",
          !account.is_active && "opacity-60"
        )}
        style={{ paddingLeft: `${indent + 12}px` }}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            ) : (
              <div className="w-6" />
            )}

            {account.is_header ? (
              <FolderOpen className="w-4 h-4 text-gray-500" />
            ) : (
              <File className="w-4 h-4 text-gray-500" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm text-gray-600">
                {account.account_code}
              </span>
              <span className="font-medium truncate">
                {account.account_name}
              </span>
              <Badge
                className={cn("text-xs", accountTypeColors[account.account_type])}
              >
                {account.account_type}
              </Badge>
              {!account.is_active && (
                <Badge variant="outline" className="text-xs">
                  Inactive
                </Badge>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="font-mono text-sm">
              ${account.balance.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => onAddAccount(account.id)}
            title="Add Sub-Account"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => onEditAccount(account)}
            title="Edit Account"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 text-red-600 hover:text-red-700"
            onClick={() => onDeleteAccount(account)}
            title="Delete Account"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {children.map((child) => {
            const grandChildren = getChildAccounts(child.id, getAllAccounts(account, children));
            return (
              <TreeNode
                key={child.id}
                account={child}
                children={grandChildren}
                level={level + 1}
                onAddAccount={onAddAccount}
                onEditAccount={onEditAccount}
                onDeleteAccount={onDeleteAccount}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function getChildAccounts(parentId: string, allAccounts: ChartOfAccount[]): ChartOfAccount[] {
  return allAccounts.filter(account => {
    const parent = account.parent_account;
    return typeof parent === 'string' ? parent === parentId : parent?.id === parentId;
  });
}

function getAllAccounts(rootAccount: ChartOfAccount, children: ChartOfAccount[]): ChartOfAccount[] {
  const result = [rootAccount, ...children];
  children.forEach(child => {
    const grandChildren = getChildAccounts(child.id, children);
    result.push(...getAllAccounts(child, grandChildren));
  });
  return result;
}

export default function ChartOfAccountsTree({
  accounts,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
  loading
}: ChartOfAccountsTreeProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-2">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Build tree structure
  const rootAccounts = accounts.filter(account => !account.parent_account);

  // Group accounts by type for better organization
  const accountsByType = rootAccounts.reduce((acc, account) => {
    if (!acc[account.account_type]) {
      acc[account.account_type] = [];
    }
    acc[account.account_type].push(account);
    return acc;
  }, {} as Record<string, ChartOfAccount[]>);

  const accountTypes = ['ASSETS', 'LIABILITIES', 'EQUITY', 'REVENUE', 'EXPENSES'] as const;

  if (accounts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <FolderOpen className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold">No Accounts Found</h3>
          <p className="text-gray-600">
            Get started by creating your first chart of accounts entry.
          </p>
          <Button onClick={() => onAddAccount()}>
            <Plus size={16} className="mr-2" />
            Add First Account
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Chart of Accounts</h3>
            <p className="text-sm text-gray-600">
              Hierarchical account structure ({accounts.length} accounts)
            </p>
          </div>
          <Button onClick={() => onAddAccount()}>
            <Plus size={16} className="mr-2" />
            Add Account
          </Button>
        </div>

        <div className="space-y-6">
          {accountTypes.map(type => {
            const typeAccounts = accountsByType[type] || [];
            if (typeAccounts.length === 0) return null;

            return (
              <div key={type} className="space-y-2">
                <div className="flex items-center space-x-2 pb-2 border-b">
                  <Badge className={cn("text-sm font-medium", accountTypeColors[type])}>
                    {type}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    ({typeAccounts.length} accounts)
                  </span>
                </div>

                <div className="space-y-1">
                  {typeAccounts.map(account => {
                    const children = getChildAccounts(account.id, accounts);
                    return (
                      <TreeNode
                        key={account.id}
                        account={account}
                        children={children}
                        level={0}
                        onAddAccount={onAddAccount}
                        onEditAccount={onEditAccount}
                        onDeleteAccount={onDeleteAccount}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            {accountTypes.map(type => {
              const typeAccounts = accountsByType[type] || [];
              const totalBalance = typeAccounts.reduce((sum, account) => sum + account.balance, 0);
              return (
                <div key={type} className="text-center">
                  <div className={cn("text-xs font-medium mb-1", accountTypeColors[type])}>
                    {type}
                  </div>
                  <div className="font-mono font-semibold">
                    ${totalBalance.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}