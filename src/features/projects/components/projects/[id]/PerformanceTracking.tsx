"use client";

import { useState, useEffect } from "react";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import Card from "components/Card";
import { FaPlus, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "sonner";

// Types for achievement tracking
interface ProjectTarget {
  id: string;
  indicator_code: string;
  indicator_name: string;
  tracking_mode: 'SIMPLE' | 'QUARTERLY';
  fiscal_year: string;
  annual_target: number;
  q1_target?: number;
  q2_target?: number;
  q3_target?: number;
  q4_target?: number;
  target_notes?: string;
}

interface Achievement {
  id?: string;
  target_id: string;
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  achievement_value: number;
  achievement_date: string;
  comments?: string;
}

interface TargetWithAchievements extends ProjectTarget {
  achievements: Achievement[];
  total_achievement: number;
  percentage_achieved: number;
  is_on_target: boolean;
}

interface PerformanceTrackingProps {
  projectId: string;
  projectTargets?: ProjectTarget[]; // Targets set during project creation
}

export default function PerformanceTracking({ projectId, projectTargets = [] }: PerformanceTrackingProps) {
  const [targets, setTargets] = useState<TargetWithAchievements[]>([]);
  const [editingCell, setEditingCell] = useState<{
    targetId: string;
    field: 'q1' | 'q2' | 'q3' | 'q4' | 'comments';
  } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Initialize targets with achievement tracking
  useEffect(() => {
    // If no projectTargets passed, create sample data for demonstration
    let sourceTargets = projectTargets;

    if (sourceTargets.length === 0) {
      // Create sample targets based on user's data format
      sourceTargets = [
        {
          id: 'sample_1',
          indicator_code: 'TX_CURR',
          indicator_name: 'Number of adults and children currently receiving antiretroviral therapy (ART)',
          tracking_mode: 'QUARTERLY' as const,
          fiscal_year: 'FY25',
          annual_target: 100035,
          q1_target: 99728,
          q2_target: 102303,
          q3_target: 103384,
          q4_target: 104207,
          target_notes: 'TX_CURR indicator for FY25'
        },
        {
          id: 'sample_2',
          indicator_code: 'TX_NEW',
          indicator_name: 'Number of adults and children newly enrolled on antiretroviral therapy (ART)',
          tracking_mode: 'QUARTERLY' as const,
          fiscal_year: 'FY25',
          annual_target: 3422,
          q1_target: 2060,
          q2_target: 1749,
          q3_target: 1615,
          q4_target: 1421,
          target_notes: 'TX_NEW indicator for FY25'
        },
        {
          id: 'sample_3',
          indicator_code: 'HTS_TST',
          indicator_name: 'Number of individuals who received HIV testing services (HTS)',
          tracking_mode: 'QUARTERLY' as const,
          fiscal_year: 'FY25',
          annual_target: 778399,
          q1_target: 210799,
          q2_target: 144766,
          q3_target: 191834,
          q4_target: 165843,
          target_notes: 'HTS_TST indicator for FY25'
        }
      ];
    }

    const targetsWithAchievements: TargetWithAchievements[] = sourceTargets.map(target => {
      // Create sample achievements for demonstration
      const achievements: Achievement[] = [];

      // Add sample achievements based on the user's data
      if (target.indicator_code === 'TX_CURR') {
        achievements.push({ id: '1', target_id: target.id, quarter: 'Q4', achievement_value: 104207, achievement_date: '2025-03-31', comments: '' });
      } else if (target.indicator_code === 'TX_NEW') {
        achievements.push(
          { id: '2', target_id: target.id, quarter: 'Q1', achievement_value: 2060, achievement_date: '2024-12-31', comments: '' },
          { id: '3', target_id: target.id, quarter: 'Q2', achievement_value: 1749, achievement_date: '2025-03-31', comments: '' },
          { id: '4', target_id: target.id, quarter: 'Q3', achievement_value: 1615, achievement_date: '2025-06-30', comments: '' },
          { id: '5', target_id: target.id, quarter: 'Q4', achievement_value: 1421, achievement_date: '2025-09-30', comments: '' }
        );
      } else if (target.indicator_code === 'HTS_TST') {
        achievements.push(
          { id: '6', target_id: target.id, quarter: 'Q1', achievement_value: 210799, achievement_date: '2024-12-31', comments: '' },
          { id: '7', target_id: target.id, quarter: 'Q2', achievement_value: 144766, achievement_date: '2025-03-31', comments: '' },
          { id: '8', target_id: target.id, quarter: 'Q3', achievement_value: 191834, achievement_date: '2025-06-30', comments: '' },
          { id: '9', target_id: target.id, quarter: 'Q4', achievement_value: 165843, achievement_date: '2025-09-30', comments: '' }
        );
      }

      const totalAchievement = achievements.reduce((sum, ach) => sum + ach.achievement_value, 0);
      const percentageAchieved = target.annual_target > 0 ? (totalAchievement / target.annual_target) * 100 : 0;

      return {
        ...target,
        achievements,
        total_achievement: totalAchievement,
        percentage_achieved: Math.round(percentageAchieved * 100) / 100,
        is_on_target: percentageAchieved >= 80
      };
    });

    setTargets(targetsWithAchievements);
  }, [projectTargets]);

  const handleCellEdit = (targetId: string, field: 'q1' | 'q2' | 'q3' | 'q4' | 'comments') => {
    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    let currentValue = '';
    if (field === 'comments') {
      currentValue = target.target_notes || '';
    } else {
      const quarter = field.toUpperCase() as 'Q1' | 'Q2' | 'Q3' | 'Q4';
      const achievement = target.achievements.find(a => a.quarter === quarter);
      currentValue = achievement?.achievement_value?.toString() || '0';
    }

    setEditingCell({ targetId, field });
    setEditValue(currentValue);
  };

  const handleSaveCell = () => {
    if (!editingCell) return;

    const { targetId, field } = editingCell;

    setTargets(prev => prev.map(target => {
      if (target.id === targetId) {
        if (field === 'comments') {
          return {
            ...target,
            target_notes: editValue
          };
        } else {
          // Handle quarterly achievement update
          const quarter = field.toUpperCase() as 'Q1' | 'Q2' | 'Q3' | 'Q4';
          const value = parseFloat(editValue) || 0;

          // Update or create achievement for this quarter
          const updatedAchievements = target.achievements.filter(a => a.quarter !== quarter);
          if (value > 0) {
            updatedAchievements.push({
              id: `${targetId}_${quarter}`,
              target_id: targetId,
              quarter,
              achievement_value: value,
              achievement_date: new Date().toISOString().split('T')[0],
              comments: ''
            });
          }

          // Recalculate totals
          const totalAchievement = updatedAchievements.reduce((sum, ach) => sum + ach.achievement_value, 0);
          const percentageAchieved = target.annual_target > 0 ? (totalAchievement / target.annual_target) * 100 : 0;

          return {
            ...target,
            achievements: updatedAchievements,
            total_achievement: totalAchievement,
            percentage_achieved: Math.round(percentageAchieved * 100) / 100,
            is_on_target: percentageAchieved >= 80
          };
        }
      }
      return target;
    }));

    setEditingCell(null);
    setEditValue('');
    toast.success("Achievement updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const getQuarterlyAchievement = (target: TargetWithAchievements, quarter: string) => {
    return target.achievements.find(ach => ach.quarter === quarter);
  };

  const getQuarterlyTarget = (target: TargetWithAchievements, quarter: string) => {
    switch (quarter) {
      case 'Q1': return target.q1_target || 0;
      case 'Q2': return target.q2_target || 0;
      case 'Q3': return target.q3_target || 0;
      case 'Q4': return target.q4_target || 0;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Performance Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{targets.length}</div>
            <div className="text-sm text-blue-800">Total Targets</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {targets.filter(t => t.is_on_target).length}
            </div>
            <div className="text-sm text-green-800">On Target</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {targets.filter(t => !t.is_on_target).length}
            </div>
            <div className="text-sm text-red-800">Off Target</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {targets.length > 0 ? Math.round((targets.reduce((sum, t) => sum + t.percentage_achieved, 0) / targets.length) * 10) / 10 : 0}%
            </div>
            <div className="text-sm text-purple-800">Avg Performance</div>
          </div>
        </div>
      </Card>

      {/* Comprehensive Performance Table */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Performance Summary Table</h3>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-3 py-3 text-left font-semibold border border-gray-300">Standard Indicators</th>
                <th className="px-3 py-3 text-right font-semibold border border-gray-300">Annual Target FY25</th>
                <th className="px-3 py-3 text-right font-semibold border border-gray-300">FY25Q1</th>
                <th className="px-3 py-3 text-right font-semibold border border-gray-300">FY25Q2</th>
                <th className="px-3 py-3 text-right font-semibold border border-gray-300">FY25Q3</th>
                <th className="px-3 py-3 text-right font-semibold border border-gray-300">FY25Q4</th>
                <th className="px-3 py-3 text-right font-semibold border border-gray-300">Cumulative Achievement</th>
                <th className="px-3 py-3 text-right font-semibold border border-gray-300">Annual Performance (%)</th>
                <th className="px-3 py-3 text-center font-semibold border border-gray-300">On Target Y/N</th>
                <th className="px-3 py-3 text-left font-semibold border border-gray-300">Comments</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {targets.map((target, index) => {
                // Get quarterly achievements
                const q1_achievement = target.achievements.find(a => a.quarter === 'Q1')?.achievement_value || 0;
                const q2_achievement = target.achievements.find(a => a.quarter === 'Q2')?.achievement_value || 0;
                const q3_achievement = target.achievements.find(a => a.quarter === 'Q3')?.achievement_value || 0;
                const q4_achievement = target.achievements.find(a => a.quarter === 'Q4')?.achievement_value || 0;

                const cumulativeAchievement = q1_achievement + q2_achievement + q3_achievement + q4_achievement;
                const performancePercent = target.annual_target > 0 ? (cumulativeAchievement / target.annual_target) : 0;
                const isOnTarget = performancePercent >= 0.80;

                return (
                  <tr key={target.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-3 border border-gray-300 font-medium">{target.indicator_code}</td>
                    <td className="px-3 py-3 border border-gray-300 text-right">{target.annual_target.toLocaleString()}</td>

                    {/* Q1 Achievement - Editable */}
                    <td className="px-3 py-3 border border-gray-300 text-right">
                      {editingCell?.targetId === target.id && editingCell?.field === 'q1' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 px-1 py-1 text-xs border rounded"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveCell();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <FaSave
                            className="text-green-600 cursor-pointer"
                            size={12}
                            onClick={handleSaveCell}
                          />
                          <FaTimes
                            className="text-red-600 cursor-pointer"
                            size={12}
                            onClick={handleCancelEdit}
                          />
                        </div>
                      ) : (
                        <span
                          className="cursor-pointer hover:bg-blue-100 px-1 py-1 rounded"
                          onClick={() => handleCellEdit(target.id, 'q1')}
                          title="Click to edit Q1 achievement"
                        >
                          {q1_achievement > 0 ? q1_achievement.toLocaleString() : '-'}
                        </span>
                      )}
                    </td>

                    {/* Q2 Achievement - Editable */}
                    <td className="px-3 py-3 border border-gray-300 text-right">
                      {editingCell?.targetId === target.id && editingCell?.field === 'q2' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 px-1 py-1 text-xs border rounded"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveCell();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <FaSave
                            className="text-green-600 cursor-pointer"
                            size={12}
                            onClick={handleSaveCell}
                          />
                          <FaTimes
                            className="text-red-600 cursor-pointer"
                            size={12}
                            onClick={handleCancelEdit}
                          />
                        </div>
                      ) : (
                        <span
                          className="cursor-pointer hover:bg-blue-100 px-1 py-1 rounded"
                          onClick={() => handleCellEdit(target.id, 'q2')}
                          title="Click to edit Q2 achievement"
                        >
                          {q2_achievement > 0 ? q2_achievement.toLocaleString() : '-'}
                        </span>
                      )}
                    </td>

                    {/* Q3 Achievement - Editable */}
                    <td className="px-3 py-3 border border-gray-300 text-right">
                      {editingCell?.targetId === target.id && editingCell?.field === 'q3' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 px-1 py-1 text-xs border rounded"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveCell();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <FaSave
                            className="text-green-600 cursor-pointer"
                            size={12}
                            onClick={handleSaveCell}
                          />
                          <FaTimes
                            className="text-red-600 cursor-pointer"
                            size={12}
                            onClick={handleCancelEdit}
                          />
                        </div>
                      ) : (
                        <span
                          className="cursor-pointer hover:bg-blue-100 px-1 py-1 rounded"
                          onClick={() => handleCellEdit(target.id, 'q3')}
                          title="Click to edit Q3 achievement"
                        >
                          {q3_achievement > 0 ? q3_achievement.toLocaleString() : '-'}
                        </span>
                      )}
                    </td>

                    {/* Q4 Achievement - Editable */}
                    <td className="px-3 py-3 border border-gray-300 text-right">
                      {editingCell?.targetId === target.id && editingCell?.field === 'q4' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 px-1 py-1 text-xs border rounded"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveCell();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <FaSave
                            className="text-green-600 cursor-pointer"
                            size={12}
                            onClick={handleSaveCell}
                          />
                          <FaTimes
                            className="text-red-600 cursor-pointer"
                            size={12}
                            onClick={handleCancelEdit}
                          />
                        </div>
                      ) : (
                        <span
                          className="cursor-pointer hover:bg-blue-100 px-1 py-1 rounded"
                          onClick={() => handleCellEdit(target.id, 'q4')}
                          title="Click to edit Q4 achievement"
                        >
                          {q4_achievement > 0 ? q4_achievement.toLocaleString() : '-'}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-3 border border-gray-300 text-right font-semibold">{cumulativeAchievement.toLocaleString()}</td>
                    <td className="px-3 py-3 border border-gray-300 text-right font-semibold">
                      <span className={`${isOnTarget ? 'text-green-600' : 'text-red-600'}`}>
                        {(performancePercent * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-3 py-3 border border-gray-300 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        isOnTarget ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isOnTarget ? 'Y' : 'N'}
                      </span>
                    </td>

                    {/* Comments - Editable */}
                    <td className="px-3 py-3 border border-gray-300 text-xs">
                      {editingCell?.targetId === target.id && editingCell?.field === 'comments' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-32 px-1 py-1 text-xs border rounded"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveCell();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <FaSave
                            className="text-green-600 cursor-pointer"
                            size={12}
                            onClick={handleSaveCell}
                          />
                          <FaTimes
                            className="text-red-600 cursor-pointer"
                            size={12}
                            onClick={handleCancelEdit}
                          />
                        </div>
                      ) : (
                        <span
                          className="cursor-pointer hover:bg-blue-100 px-1 py-1 rounded"
                          onClick={() => handleCellEdit(target.id, 'comments')}
                          title="Click to edit comments"
                        >
                          {target.target_notes || 'Click to add comment'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></span>
              <span className="text-gray-600">Click any achievement cell to edit</span>
            </div>
            <div className="flex items-center gap-2">
              <FaSave className="text-green-600" size={12} />
              <span className="text-gray-600">Save changes</span>
            </div>
            <div className="flex items-center gap-2">
              <FaTimes className="text-red-600" size={12} />
              <span className="text-gray-600">Cancel editing</span>
            </div>
          </div>
          <div className="text-xs text-gray-600">
            <p><strong>Instructions:</strong> Click on any Q1-Q4 achievement cell or comment to edit. Press Enter to save or Escape to cancel. Calculations update automatically.</p>
          </div>
        </div>
      </Card>

      {/* Additional Tools Section - Optional */}
      {targets.length > 10 && (
        <Card className="p-4">
          <h4 className="text-lg font-semibold mb-3">Bulk Actions</h4>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="text-blue-600 border-blue-600"
              onClick={() => toast.info("Export functionality coming soon!")}
            >
              📊 Export to Excel
            </Button>
            <Button
              variant="outline"
              className="text-green-600 border-green-600"
              onClick={() => toast.info("Import functionality coming soon!")}
            >
              📥 Import Achievements
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}