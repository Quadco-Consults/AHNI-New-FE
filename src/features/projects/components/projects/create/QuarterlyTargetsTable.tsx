"use client";

import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { FaTimes, FaPlus } from "react-icons/fa";
import { toast } from "sonner";

export interface QuarterlyTarget {
  id?: string;
  indicator_code: string;
  annual_target: number;
  q1_achievement: number;
  q2_achievement: number;
  q3_achievement: number;
  q4_achievement: number;
  cumulative_achievement: number;
  annual_performance_percentage: number;
  on_target: 'Y' | 'N';
  comments: string;
}

interface QuarterlyTargetsTableProps {
  targets: QuarterlyTarget[];
  onTargetsChange: (targets: QuarterlyTarget[]) => void;
  isEditable?: boolean;
}

// Sample performance indicators
const PERFORMANCE_INDICATORS = [
  'TX_CURR', 'TX_NEW', 'TX_PVLS_D', 'TX_PVLS_N', 'HTS_TST', 'HTS_TST_POS',
  'PMTCT_STAT_N', 'PMTCT_ART', 'TB_ART', 'TX_TB', 'TB_PREV_N', 'PrEP_NEW'
];

export default function QuarterlyTargetsTable({ targets, onTargetsChange, isEditable = true }: QuarterlyTargetsTableProps) {

  const handleAddTarget = () => {
    const newTarget: QuarterlyTarget = {
      id: `temp_${Date.now()}`,
      indicator_code: '',
      annual_target: 0,
      q1_achievement: 0,
      q2_achievement: 0,
      q3_achievement: 0,
      q4_achievement: 0,
      cumulative_achievement: 0,
      annual_performance_percentage: 0,
      on_target: 'N',
      comments: '',
    };
    onTargetsChange([...targets, newTarget]);
  };

  const handleRemoveTarget = (targetId: string) => {
    onTargetsChange(targets.filter(t => t.id !== targetId));
    toast.success("Target removed");
  };

  const handleTargetChange = (targetId: string, field: keyof QuarterlyTarget, value: string | number) => {
    const updatedTargets = targets.map(target => {
      if (target.id === targetId) {
        const updatedTarget = { ...target, [field]: value };

        // Auto-calculate cumulative achievement when quarterly values change
        if (field.includes('q') && field.includes('achievement')) {
          const q1 = field === 'q1_achievement' ? Number(value) : target.q1_achievement;
          const q2 = field === 'q2_achievement' ? Number(value) : target.q2_achievement;
          const q3 = field === 'q3_achievement' ? Number(value) : target.q3_achievement;
          const q4 = field === 'q4_achievement' ? Number(value) : target.q4_achievement;

          updatedTarget.cumulative_achievement = q1 + q2 + q3 + q4;

          // Calculate annual performance percentage
          if (target.annual_target > 0) {
            updatedTarget.annual_performance_percentage =
              Number((updatedTarget.cumulative_achievement / target.annual_target).toFixed(2));
          }

          // Determine if on target (80% or higher is considered on target)
          updatedTarget.on_target = updatedTarget.annual_performance_percentage >= 0.8 ? 'Y' : 'N';
        }

        // Recalculate when annual target changes
        if (field === 'annual_target') {
          if (Number(value) > 0) {
            updatedTarget.annual_performance_percentage =
              Number((target.cumulative_achievement / Number(value)).toFixed(2));
            updatedTarget.on_target = updatedTarget.annual_performance_percentage >= 0.8 ? 'Y' : 'N';
          }
        }

        return updatedTarget;
      }
      return target;
    });

    onTargetsChange(updatedTargets);
  };

  const formatPercentage = (decimal: number) => {
    return (decimal * 100).toFixed(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <Label className="font-semibold text-lg">Quarterly Performance Targets</Label>
          <p className="text-sm text-gray-600 mt-1">
            Set quarterly targets and track cumulative achievement across FY25.
          </p>
        </div>

        {isEditable && (
          <Button
            type="button"
            variant="outline"
            className="text-blue-600 border-blue-600"
            onClick={handleAddTarget}
          >
            <FaPlus className="mr-2" size={12} />
            Add Target
          </Button>
        )}
      </div>

      {/* Quarterly Table Format */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[120px]">
                Standard Indicators
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[100px]">
                Annual Target FY25
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[80px]">
                FY25 Q1
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[80px]">
                FY25 Q2
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[80px]">
                FY25 Q3
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[80px]">
                FY25 Q4
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[120px]">
                Cumulative Achievement (at the end of the quarter)
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[100px]">
                Annual Performance Achieved to the End of Reporting Period(%)
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 min-w-[80px]">
                On Target Y/N
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-900 min-w-[150px]">
                Comments
              </th>
              {isEditable && (
                <th className="px-3 py-3 text-center font-semibold text-gray-900 w-16">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {targets.length === 0 ? (
              <tr>
                <td
                  colSpan={isEditable ? 11 : 10}
                  className="px-4 py-8 text-center text-gray-500 text-sm"
                >
                  No quarterly targets added yet. Click "Add Target" to get started.
                </td>
              </tr>
            ) : (
              targets.map((target) => (
                <tr key={target.id} className="hover:bg-gray-50">
                  {/* Standard Indicators */}
                  <td className="px-3 py-3 border-r border-gray-200">
                    {isEditable ? (
                      <select
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={target.indicator_code}
                        onChange={(e) => handleTargetChange(target.id!, 'indicator_code', e.target.value)}
                      >
                        <option value="">Select...</option>
                        {PERFORMANCE_INDICATORS.map(ind => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="font-semibold text-blue-600">{target.indicator_code}</div>
                    )}
                  </td>

                  {/* Annual Target FY25 */}
                  <td className="px-3 py-3 border-r border-gray-200">
                    {isEditable ? (
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={target.annual_target || ''}
                        onChange={(e) => handleTargetChange(target.id!, 'annual_target', Number(e.target.value))}
                      />
                    ) : (
                      <div className="font-medium">{target.annual_target.toLocaleString()}</div>
                    )}
                  </td>

                  {/* FY25 Q1 */}
                  <td className="px-3 py-3 border-r border-gray-200">
                    {isEditable ? (
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={target.q1_achievement || ''}
                        onChange={(e) => handleTargetChange(target.id!, 'q1_achievement', Number(e.target.value))}
                      />
                    ) : (
                      <div>{target.q1_achievement.toLocaleString()}</div>
                    )}
                  </td>

                  {/* FY25 Q2 */}
                  <td className="px-3 py-3 border-r border-gray-200">
                    {isEditable ? (
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={target.q2_achievement || ''}
                        onChange={(e) => handleTargetChange(target.id!, 'q2_achievement', Number(e.target.value))}
                      />
                    ) : (
                      <div>{target.q2_achievement.toLocaleString()}</div>
                    )}
                  </td>

                  {/* FY25 Q3 */}
                  <td className="px-3 py-3 border-r border-gray-200">
                    {isEditable ? (
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={target.q3_achievement || ''}
                        onChange={(e) => handleTargetChange(target.id!, 'q3_achievement', Number(e.target.value))}
                      />
                    ) : (
                      <div>{target.q3_achievement.toLocaleString()}</div>
                    )}
                  </td>

                  {/* FY25 Q4 */}
                  <td className="px-3 py-3 border-r border-gray-200">
                    {isEditable ? (
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={target.q4_achievement || ''}
                        onChange={(e) => handleTargetChange(target.id!, 'q4_achievement', Number(e.target.value))}
                      />
                    ) : (
                      <div>{target.q4_achievement.toLocaleString()}</div>
                    )}
                  </td>

                  {/* Cumulative Achievement */}
                  <td className="px-3 py-3 border-r border-gray-200">
                    <div className="font-semibold text-blue-600">
                      {target.cumulative_achievement.toLocaleString()}
                    </div>
                  </td>

                  {/* Annual Performance Percentage */}
                  <td className="px-3 py-3 border-r border-gray-200">
                    <div
                      className={`font-semibold ${
                        target.annual_performance_percentage >= 1.0 ? 'text-green-600' :
                        target.annual_performance_percentage >= 0.8 ? 'text-blue-600' :
                        target.annual_performance_percentage >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                      }`}
                    >
                      {formatPercentage(target.annual_performance_percentage)}%
                    </div>
                  </td>

                  {/* On Target Y/N */}
                  <td className="px-3 py-3 border-r border-gray-200">
                    <div
                      className={`font-bold text-center ${
                        target.on_target === 'Y' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {target.on_target}
                    </div>
                  </td>

                  {/* Comments */}
                  <td className="px-3 py-3 border-r border-gray-200">
                    {isEditable ? (
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                        rows={2}
                        value={target.comments}
                        onChange={(e) => handleTargetChange(target.id!, 'comments', e.target.value)}
                        placeholder="Add comments..."
                      />
                    ) : (
                      <div className="text-sm text-gray-700 max-w-xs break-words">
                        {target.comments}
                      </div>
                    )}
                  </td>

                  {/* Action */}
                  {isEditable && (
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
              <div className="text-gray-600">Total Indicators</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {targets.filter(t => t.on_target === 'Y').length}
              </div>
              <div className="text-gray-600">On Target (Y)</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">
                {targets.filter(t => t.on_target === 'N').length}
              </div>
              <div className="text-gray-600">Off Target (N)</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">
                {targets.length > 0 ?
                  ((targets.filter(t => t.on_target === 'Y').length / targets.length) * 100).toFixed(1)
                  : '0'}%
              </div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}