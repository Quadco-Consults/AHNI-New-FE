"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

export interface SimpleTarget {
  id?: string;
  indicator_code: string;
  indicator_name: string;
  target: number;
  achievement: number;
  percentage: number;
}

interface SimpleTargetsTableProps {
  targets: SimpleTarget[];
  onTargetsChange: (targets: SimpleTarget[]) => void;
  isEditable?: boolean;
}

// Sample performance indicators
const PERFORMANCE_INDICATORS = [
  { code: 'TX_CURR', name: 'Number of adults and children currently receiving antiretroviral therapy (ART)' },
  { code: 'TX_NEW', name: 'Number of adults and children newly enrolled on antiretroviral therapy (ART)' },
  { code: 'HTS_TST', name: 'Number of individuals who received HIV testing services (HTS)' },
  { code: 'PMTCT_STAT', name: 'Number of pregnant women with known HIV status' },
  { code: 'OVC_SERV', name: 'Number of beneficiaries served by PEPFAR OVC programs' },
  { code: 'TB_STAT', name: 'Number of new and relapsed TB cases with documented HIV status' },
  { code: 'TB_ART', name: 'Number of HIV-positive new and relapsed TB cases who received ART' },
  { code: 'CUSTOM', name: 'Custom Indicator' },
];

export default function SimpleTargetsTable({ targets, onTargetsChange, isEditable = true }: SimpleTargetsTableProps) {

  const handleAddTarget = () => {
    const newTarget: SimpleTarget = {
      id: `temp_${Date.now()}`,
      indicator_code: '',
      indicator_name: '',
      target: 0,
      achievement: 0,
      percentage: 0,
    };
    onTargetsChange([...targets, newTarget]);
  };

  const handleRemoveTarget = (targetId: string) => {
    onTargetsChange(targets.filter(t => t.id !== targetId));
    toast.success("Target removed");
  };

  const handleTargetChange = (targetId: string, field: keyof SimpleTarget, value: string | number) => {
    const updatedTargets = targets.map(target => {
      if (target.id === targetId) {
        const updatedTarget = { ...target, [field]: value };

        // Handle indicator selection
        if (field === 'indicator_code') {
          const indicator = PERFORMANCE_INDICATORS.find(ind => ind.code === value);
          updatedTarget.indicator_name = indicator?.name || '';
        }

        // Auto-calculate percentage when target or achievement changes
        if (field === 'target' || field === 'achievement') {
          const targetValue = field === 'target' ? Number(value) : target.target;
          const achievementValue = field === 'achievement' ? Number(value) : target.achievement;

          if (targetValue > 0) {
            updatedTarget.percentage = Math.round((achievementValue / targetValue) * 100);
          } else {
            updatedTarget.percentage = 0;
          }
        }

        return updatedTarget;
      }
      return target;
    });

    onTargetsChange(updatedTargets);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <Label className="font-semibold text-lg">Performance Targets</Label>
          <p className="text-sm text-gray-600 mt-1">
            Set measurable targets and track achievement against them.
          </p>
        </div>

        {isEditable && (
          <Button
            type="button"
            variant="outline"
            className="text-blue-600 border-blue-600"
            onClick={handleAddTarget}
          >
            <Plus className="mr-2" size={12} />
            Add Target
          </Button>
        )}
      </div>

      {/* Simple Table Format */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                Indicators/Data Element (A)
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                Target (B)
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                Achievement (C)
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                Percentage Achievement (D=C/B*100)
              </th>
              {isEditable && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-16">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {targets.length === 0 ? (
              <tr>
                <td
                  colSpan={isEditable ? 5 : 4}
                  className="px-4 py-8 text-center text-gray-500 text-sm"
                >
                  No targets added yet. Click "Add Target" to get started.
                </td>
              </tr>
            ) : (
              targets.map((target) => (
                <tr key={target.id} className="hover:bg-gray-50">
                  {/* Indicators/Data Element (A) */}
                  <td className="px-4 py-3 border-r border-gray-200">
                    {isEditable ? (
                      <div className="space-y-2">
                        <select
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          value={target.indicator_code}
                          onChange={(e) => handleTargetChange(target.id!, 'indicator_code', e.target.value)}
                        >
                          <option value="">Select Indicator...</option>
                          {PERFORMANCE_INDICATORS.map(ind => (
                            <option key={ind.code} value={ind.code}>
                              {ind.code}
                            </option>
                          ))}
                        </select>

                        {target.indicator_code === 'CUSTOM' && (
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            placeholder="Enter custom indicator name"
                            value={target.indicator_name}
                            onChange={(e) => handleTargetChange(target.id!, 'indicator_name', e.target.value)}
                          />
                        )}

                        {target.indicator_code && target.indicator_code !== 'CUSTOM' && (
                          <p className="text-xs text-gray-600 leading-tight">
                            {target.indicator_name}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold text-blue-600">{target.indicator_code}</div>
                        <div className="text-sm text-gray-600 mt-1">{target.indicator_name}</div>
                      </div>
                    )}
                  </td>

                  {/* Target (B) */}
                  <td className="px-4 py-3 border-r border-gray-200">
                    {isEditable ? (
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        placeholder="Enter target"
                        value={target.target || ''}
                        onChange={(e) => handleTargetChange(target.id!, 'target', Number(e.target.value))}
                      />
                    ) : (
                      <div className="font-medium">{target.target.toLocaleString()}</div>
                    )}
                  </td>

                  {/* Achievement (C) */}
                  <td className="px-4 py-3 border-r border-gray-200">
                    {isEditable ? (
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        placeholder="Enter achievement"
                        value={target.achievement || ''}
                        onChange={(e) => handleTargetChange(target.id!, 'achievement', Number(e.target.value))}
                      />
                    ) : (
                      <div className="font-medium">{target.achievement.toLocaleString()}</div>
                    )}
                  </td>

                  {/* Percentage Achievement (D=C/B*100) */}
                  <td className="px-4 py-3 border-r border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`font-semibold ${
                          target.percentage >= 100 ? 'text-green-600' :
                          target.percentage >= 80 ? 'text-blue-600' :
                          target.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}
                      >
                        {target.percentage}%
                      </span>

                      {/* Progress bar */}
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            target.percentage >= 100 ? 'bg-green-500' :
                            target.percentage >= 80 ? 'bg-blue-500' :
                            target.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(target.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  {isEditable && (
                    <td className="px-4 py-3 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveTarget(target.id!)}
                      >
                        <X size={14} />
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      {targets.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{targets.length}</div>
              <div className="text-gray-600">Total Targets</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {targets.filter(t => t.percentage >= 100).length}
              </div>
              <div className="text-gray-600">Achieved (100%+)</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">
                {targets.filter(t => t.percentage >= 80 && t.percentage < 100).length}
              </div>
              <div className="text-gray-600">On Track (80-99%)</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">
                {targets.filter(t => t.percentage < 80).length}
              </div>
              <div className="text-gray-600">Off Track (&lt;80%)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}