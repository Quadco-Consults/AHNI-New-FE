"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { FaTimes, FaPlus } from "react-icons/fa";
import { toast } from "sonner";

export interface ProjectTargetDefinition {
  id?: string;
  indicator_code: string;
  indicator_name: string;
  tracking_mode: 'SIMPLE' | 'QUARTERLY';
  fiscal_year: string;
  // Targets only (no achievements during creation)
  annual_target: number;
  // Quarterly targets (if quarterly mode)
  q1_target?: number;
  q2_target?: number;
  q3_target?: number;
  q4_target?: number;
  // Notes about the target
  target_notes?: string;
}

interface TargetDefinitionTableProps {
  targets: ProjectTargetDefinition[];
  onTargetsChange: (targets: ProjectTargetDefinition[]) => void;
  viewMode: 'simple' | 'quarterly';
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

const FISCAL_YEARS = [
  { label: 'FY24 (2023/2024)', value: 'FY24' },
  { label: 'FY25 (2024/2025)', value: 'FY25' },
  { label: 'FY26 (2025/2026)', value: 'FY26' },
];

export default function TargetDefinitionTable({ targets, onTargetsChange, viewMode }: TargetDefinitionTableProps) {

  const handleAddTarget = () => {
    const newTarget: ProjectTargetDefinition = {
      id: `temp_${Date.now()}`,
      indicator_code: '',
      indicator_name: '',
      tracking_mode: viewMode === 'quarterly' ? 'QUARTERLY' : 'SIMPLE',
      fiscal_year: 'FY25',
      annual_target: 0,
      target_notes: '',
      // Initialize quarterly targets if quarterly mode
      ...(viewMode === 'quarterly' && {
        q1_target: 0,
        q2_target: 0,
        q3_target: 0,
        q4_target: 0,
      })
    };
    onTargetsChange([...targets, newTarget]);
  };

  const handleRemoveTarget = (targetId: string) => {
    onTargetsChange(targets.filter(t => t.id !== targetId));
    toast.success("Target removed");
  };

  const handleTargetChange = (targetId: string, field: keyof ProjectTargetDefinition, value: string | number) => {
    const updatedTargets = targets.map(target => {
      if (target.id === targetId) {
        const updatedTarget = { ...target, [field]: value };

        // Handle indicator selection
        if (field === 'indicator_code') {
          const indicator = PERFORMANCE_INDICATORS.find(ind => ind.code === value);
          updatedTarget.indicator_name = indicator?.name || '';
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
        <Button
          type="button"
          variant="outline"
          className="text-blue-600 border-blue-600"
          onClick={handleAddTarget}
        >
          <FaPlus className="mr-2" size={12} />
          Add Target
        </Button>
      </div>

      {/* Target Definition Table */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[200px]">
                Indicator
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[80px]">
                Fiscal Year
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[120px]">
                Annual Target
              </th>

              {viewMode === 'quarterly' && (
                <>
                  <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[80px]">
                    Q1 Target
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[80px]">
                    Q2 Target
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[80px]">
                    Q3 Target
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[80px]">
                    Q4 Target
                  </th>
                </>
              )}

              <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[150px]">
                Target Notes
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-900 w-16">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {targets.length === 0 ? (
              <tr>
                <td
                  colSpan={viewMode === 'quarterly' ? 8 : 5}
                  className="px-4 py-8 text-center text-gray-500 text-sm"
                >
                  No targets defined yet. Click "Add Target" to set your project goals.
                </td>
              </tr>
            ) : (
              targets.map((target) => (
                <tr key={target.id} className="hover:bg-gray-50">
                  {/* Indicator */}
                  <td className="px-3 py-3 border-r border-gray-200">
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
                  </td>

                  {/* Fiscal Year */}
                  <td className="px-3 py-3 border-r border-gray-200">
                    <select
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      value={target.fiscal_year}
                      onChange={(e) => handleTargetChange(target.id!, 'fiscal_year', e.target.value)}
                    >
                      {FISCAL_YEARS.map(fy => (
                        <option key={fy.value} value={fy.value}>{fy.label}</option>
                      ))}
                    </select>
                  </td>

                  {/* Annual Target */}
                  <td className="px-3 py-3 border-r border-gray-200">
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="Enter annual target"
                      value={target.annual_target || ''}
                      onChange={(e) => handleTargetChange(target.id!, 'annual_target', Number(e.target.value))}
                    />
                  </td>

                  {/* Quarterly Targets */}
                  {viewMode === 'quarterly' && (
                    <>
                      <td className="px-3 py-3 border-r border-gray-200">
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          placeholder="Q1"
                          value={target.q1_target || ''}
                          onChange={(e) => handleTargetChange(target.id!, 'q1_target', Number(e.target.value))}
                        />
                      </td>
                      <td className="px-3 py-3 border-r border-gray-200">
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          placeholder="Q2"
                          value={target.q2_target || ''}
                          onChange={(e) => handleTargetChange(target.id!, 'q2_target', Number(e.target.value))}
                        />
                      </td>
                      <td className="px-3 py-3 border-r border-gray-200">
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          placeholder="Q3"
                          value={target.q3_target || ''}
                          onChange={(e) => handleTargetChange(target.id!, 'q3_target', Number(e.target.value))}
                        />
                      </td>
                      <td className="px-3 py-3 border-r border-gray-200">
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          placeholder="Q4"
                          value={target.q4_target || ''}
                          onChange={(e) => handleTargetChange(target.id!, 'q4_target', Number(e.target.value))}
                        />
                      </td>
                    </>
                  )}

                  {/* Target Notes */}
                  <td className="px-3 py-3 border-r border-gray-200">
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                      rows={2}
                      value={target.target_notes || ''}
                      onChange={(e) => handleTargetChange(target.id!, 'target_notes', e.target.value)}
                      placeholder="Notes about this target..."
                    />
                  </td>

                  {/* Action */}
                  <td className="px-3 py-3 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveTarget(target.id!)}
                    >
                      <FaTimes size={14} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Target Summary */}
      {targets.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-blue-900">{targets.length}</div>
              <div className="text-blue-700">Targets Defined</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-900">
                {targets.filter(t => t.tracking_mode === 'SIMPLE').length}
              </div>
              <div className="text-blue-700">Simple Tracking</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-900">
                {targets.filter(t => t.tracking_mode === 'QUARTERLY').length}
              </div>
              <div className="text-blue-700">Quarterly Tracking</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-blue-600">
            💡 These targets will be used for progress tracking once the project starts. Achievements will be recorded during project execution.
          </div>
        </div>
      )}
    </div>
  );
}