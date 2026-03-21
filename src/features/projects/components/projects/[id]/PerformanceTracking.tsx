"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Card from "@/components/Card";
import { Plus, Edit, Save, X, Target } from "lucide-react";
import { toast } from "sonner";
import { useSaveAchievement, useUpdateProjectTarget } from "@/features/projects/controllers/projectController";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import SimpleAchievementModal from "./SimpleAchievementModal";

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
  const [isSaving, setIsSaving] = useState(false);

  // Modal state for simple target achievement recording
  const [simpleModalOpen, setSimpleModalOpen] = useState(false);
  const [selectedSimpleTarget, setSelectedSimpleTarget] = useState<TargetWithAchievements | null>(null);

  // API hooks for saving achievements
  const { saveAchievement } = useSaveAchievement();

  // Initialize targets with achievement tracking
  useEffect(() => {
    // Map backend target structure to component expected structure
    // CHANGED: Now showing ALL targets (both SIMPLE and QUARTERLY modes)
    let sourceTargets = projectTargets
      .map(target => ({
        id: target.id,
        indicator_code: target.indicator_code,
        indicator_name: target.indicator_name,
        tracking_mode: target.tracking_mode,
        fiscal_year: target.fiscal_year,
        annual_target: Number(target.target_value) || 0, // Map target_value to annual_target
        q1_target: target.q1_target,
        q2_target: target.q2_target,
        q3_target: target.q3_target,
        q4_target: target.q4_target,
        target_notes: target.comments || '',
        achievements: target.achievements || []
      }));

    // console.log("🎯 Mapped sourceTargets (ALL modes):", sourceTargets);

    const targetsWithAchievements: TargetWithAchievements[] = sourceTargets.map(target => {
      // Initialize empty achievements - only use actual data from backend
      const achievements: Achievement[] = [];

      // TODO: In the future, this should fetch actual achievements from the backend
      // For now, start with empty achievements that users can add through the UI

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

  const handleSaveCell = async () => {
    if (!editingCell || isSaving) return;

    const { targetId, field } = editingCell;
    setIsSaving(true);

    try {
      if (field === 'comments') {
        // Save comments via API using PATCH on the target
        await AxiosWithToken.patch(`projects/project-targets/${targetId}/`, {
          comments: editValue
        });

        // Update local state
        setTargets(prev => prev.map(target => {
          if (target.id === targetId) {
            return {
              ...target,
              target_notes: editValue
            };
          }
          return target;
        }));

        toast.success("Comment saved successfully!");
      } else {
        // Handle quarterly achievement update
        const quarter = field.toUpperCase() as 'Q1' | 'Q2' | 'Q3' | 'Q4';
        const value = parseFloat(editValue) || 0;

        // Find the target to check if achievement exists
        const target = targets.find(t => t.id === targetId);

        // Verify target is in quarterly mode
        if (target?.tracking_mode !== 'QUARTERLY') {
          toast.error("This target is not configured for quarterly tracking");
          setIsSaving(false);
          return;
        }

        const existingAchievement = target?.achievements.find(a => a.quarter === quarter);

        // Save achievement via API
        const achievementData = {
          id: existingAchievement?.id && !existingAchievement.id.includes('_') ? existingAchievement.id : undefined,
          project_target: targetId,
          quarter,
          value,
          achievement_date: new Date().toISOString().split('T')[0],
        };

        const response = await saveAchievement(achievementData);

        // Extract achievement ID from response
        const achievementId = response?.data?.id || response?.id || `${targetId}_${quarter}`;

        // Update local state with API response
        setTargets(prev => prev.map(target => {
          if (target.id === targetId) {
            // Update or create achievement for this quarter
            const updatedAchievements = target.achievements.filter(a => a.quarter !== quarter);
            if (value > 0) {
              updatedAchievements.push({
                id: achievementId,
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
          return target;
        }));

        toast.success("Achievement saved successfully!");
      }

      setEditingCell(null);
      setEditValue('');
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  // Handle opening the simple achievement modal
  const handleOpenSimpleModal = (target: TargetWithAchievements) => {
    console.log('Opening modal for target:', target.id, target.indicator_code);
    setSelectedSimpleTarget(target);
    setSimpleModalOpen(true);
  };

  // Handle saving simple achievement from modal
  const handleSaveSimpleAchievement = async (achievementData: Omit<Achievement, 'id'>) => {
    if (!selectedSimpleTarget) return;

    const response = await saveAchievement({
      project_target: selectedSimpleTarget.id,
      value: achievementData.achievement_value,
      achievement_date: achievementData.achievement_date,
      comments: achievementData.comments
    });

    // Extract achievement ID from response
    const achievementId = response?.data?.id || response?.id || `${selectedSimpleTarget.id}_${Date.now()}`;

    // Update local state
    setTargets(prev => prev.map(target => {
      if (target.id === selectedSimpleTarget.id) {
        const updatedAchievements = [
          ...target.achievements,
          {
            id: achievementId,
            target_id: selectedSimpleTarget.id,
            achievement_value: achievementData.achievement_value,
            achievement_date: achievementData.achievement_date,
            comments: achievementData.comments
          }
        ];

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
      return target;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Performance Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
            <div className="text-4xl font-bold text-blue-600 mb-2">{targets.length}</div>
            <div className="text-sm font-medium text-blue-800">Total Targets</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-green-200 hover:shadow-md transition-shadow">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {targets.filter(t => t.is_on_target).length}
            </div>
            <div className="text-sm font-medium text-green-800">On Target</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-red-200 hover:shadow-md transition-shadow">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {targets.filter(t => !t.is_on_target).length}
            </div>
            <div className="text-sm font-medium text-red-800">Off Target</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-purple-200 hover:shadow-md transition-shadow">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {targets.length > 0 ? Math.round((targets.reduce((sum, t) => sum + t.percentage_achieved, 0) / targets.length) * 10) / 10 : 0}%
            </div>
            <div className="text-sm font-medium text-purple-800">Avg Performance</div>
          </div>
        </div>
      </Card>

      {/* Comprehensive Performance Table */}
      <Card className="p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Performance Summary Table</h3>
          <div className="text-xs text-gray-500 italic">
            Click on any cell to edit • Press Enter to save • Escape to cancel
          </div>
        </div>

        {targets.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-gray-400 mb-4">
              <Target className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Performance Targets Defined</h3>
            <p className="text-sm text-gray-600 mb-4">
              This project doesn't have any performance targets yet. Add targets during project creation or setup to track achievements.
            </p>
            <div className="mt-6 text-left max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">Tracking Modes Available:</h4>
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-medium">SIMPLE</span>
                  <span>Record achievements as they happen throughout the year</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded font-medium">QUARTERLY</span>
                  <span>Track achievements by quarter (Q1, Q2, Q3, Q4)</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0">
              <tr>
                <th className="px-4 py-4 text-left font-semibold border-r border-blue-500">Indicator</th>
                <th className="px-4 py-4 text-center font-semibold border-r border-blue-500">Mode</th>
                <th className="px-4 py-4 text-right font-semibold border-r border-blue-500">Annual Target</th>
                <th className="px-4 py-4 text-center font-semibold border-r border-blue-500 bg-blue-500/30" colSpan={4}>Achievement Tracking</th>
                <th className="px-4 py-4 text-right font-semibold border-r border-blue-500">Total<br/><span className="text-xs font-normal">Achievement</span></th>
                <th className="px-4 py-4 text-right font-semibold border-r border-blue-500">Performance<br/><span className="text-xs font-normal">(%)</span></th>
                <th className="px-4 py-4 text-center font-semibold border-r border-blue-500">Status</th>
                <th className="px-4 py-4 text-left font-semibold">Comments/Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {targets.map((target, index) => {
                const isQuarterly = target.tracking_mode === 'QUARTERLY';

                // Get achievements based on tracking mode
                const q1_achievement = isQuarterly ? (target.achievements.find(a => a.quarter === 'Q1')?.achievement_value || 0) : 0;
                const q2_achievement = isQuarterly ? (target.achievements.find(a => a.quarter === 'Q2')?.achievement_value || 0) : 0;
                const q3_achievement = isQuarterly ? (target.achievements.find(a => a.quarter === 'Q3')?.achievement_value || 0) : 0;
                const q4_achievement = isQuarterly ? (target.achievements.find(a => a.quarter === 'Q4')?.achievement_value || 0) : 0;

                // For simple tracking, sum all achievements
                const totalAchievement = isQuarterly
                  ? q1_achievement + q2_achievement + q3_achievement + q4_achievement
                  : target.achievements.reduce((sum, ach) => sum + ach.achievement_value, 0);

                const performancePercent = (target.annual_target || 0) > 0 ? (totalAchievement / (target.annual_target || 1)) : 0;
                const isOnTarget = performancePercent >= 0.80;

                return (
                  <tr key={target.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                    {/* Indicator Name/Code */}
                    <td className="px-4 py-4 border-b border-r border-gray-200 font-semibold text-gray-800">
                      <div className="flex flex-col gap-1">
                        <span className="text-blue-600">{target.indicator_code}</span>
                        <span className="text-xs text-gray-500 font-normal truncate max-w-[200px]" title={target.indicator_name}>
                          {target.indicator_name}
                        </span>
                      </div>
                    </td>

                    {/* Tracking Mode Badge */}
                    <td className="px-4 py-4 border-b border-r border-gray-200 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        isQuarterly
                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                          : 'bg-green-100 text-green-800 border border-green-300'
                      }`}>
                        {target.tracking_mode}
                      </span>
                    </td>

                    {/* Annual Target */}
                    <td className="px-4 py-4 border-b border-r border-gray-200 text-right font-semibold text-gray-700">
                      {target.annual_target?.toLocaleString() || '0'}
                    </td>

                    {/* Achievement Tracking Section - Adaptive based on tracking mode */}
                    {isQuarterly ? (
                      <>
                        {/* Q1 Achievement - Editable */}
                        <td className="px-4 py-4 border-b border-r border-gray-200 text-right bg-blue-50/50">
                      {editingCell?.targetId === target.id && editingCell?.field === 'q1' ? (
                        <div className="flex items-center justify-end gap-3">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-48 px-4 py-3 text-lg font-semibold border-3 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-xl"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveCell();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <button
                            onClick={handleSaveCell}
                            disabled={isSaving}
                            className={`p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-110 shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Save (Enter)"
                          >
                            <Save size={24} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className={`p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all hover:scale-110 shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Cancel (Esc)"
                          >
                            <X size={24} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-blue-200 px-3 py-2 rounded-md transition-colors flex items-center justify-end gap-2 group"
                          onClick={() => handleCellEdit(target.id, 'q1')}
                          title="Click to edit Q1 achievement"
                        >
                          <span className="font-medium">{q1_achievement > 0 ? q1_achievement.toLocaleString() : '-'}</span>
                          <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </td>

                    {/* Q2 Achievement - Editable */}
                    <td className="px-4 py-4 border-b border-r border-gray-200 text-right bg-blue-50/50">
                      {editingCell?.targetId === target.id && editingCell?.field === 'q2' ? (
                        <div className="flex items-center justify-end gap-3">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-48 px-4 py-3 text-lg font-semibold border-3 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-xl"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveCell();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <button
                            onClick={handleSaveCell}
                            disabled={isSaving}
                            className={`p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-110 shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Save (Enter)"
                          >
                            <Save size={24} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className={`p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all hover:scale-110 shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Cancel (Esc)"
                          >
                            <X size={24} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-blue-200 px-3 py-2 rounded-md transition-colors flex items-center justify-end gap-2 group"
                          onClick={() => handleCellEdit(target.id, 'q2')}
                          title="Click to edit Q2 achievement"
                        >
                          <span className="font-medium">{q2_achievement > 0 ? q2_achievement.toLocaleString() : '-'}</span>
                          <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </td>

                    {/* Q3 Achievement - Editable */}
                    <td className="px-4 py-4 border-b border-r border-gray-200 text-right bg-blue-50/50">
                      {editingCell?.targetId === target.id && editingCell?.field === 'q3' ? (
                        <div className="flex items-center justify-end gap-3">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-48 px-4 py-3 text-lg font-semibold border-3 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-xl"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveCell();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <button
                            onClick={handleSaveCell}
                            disabled={isSaving}
                            className={`p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-110 shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Save (Enter)"
                          >
                            <Save size={24} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className={`p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all hover:scale-110 shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Cancel (Esc)"
                          >
                            <X size={24} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-blue-200 px-3 py-2 rounded-md transition-colors flex items-center justify-end gap-2 group"
                          onClick={() => handleCellEdit(target.id, 'q3')}
                          title="Click to edit Q3 achievement"
                        >
                          <span className="font-medium">{q3_achievement > 0 ? q3_achievement.toLocaleString() : '-'}</span>
                          <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </td>

                    {/* Q4 Achievement - Editable */}
                    <td className="px-4 py-4 border-b border-r border-gray-200 text-right bg-blue-50/50">
                      {editingCell?.targetId === target.id && editingCell?.field === 'q4' ? (
                        <div className="flex items-center justify-end gap-3">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-48 px-4 py-3 text-lg font-semibold border-3 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-xl"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveCell();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <button
                            onClick={handleSaveCell}
                            disabled={isSaving}
                            className={`p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-110 shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Save (Enter)"
                          >
                            <Save size={24} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className={`p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all hover:scale-110 shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Cancel (Esc)"
                          >
                            <X size={24} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-blue-200 px-3 py-2 rounded-md transition-colors flex items-center justify-end gap-2 group"
                          onClick={() => handleCellEdit(target.id, 'q4')}
                          title="Click to edit Q4 achievement"
                        >
                          <span className="font-medium">{q4_achievement > 0 ? q4_achievement.toLocaleString() : '-'}</span>
                          <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </td>
                      </>
                    ) : (
                      /* Simple Tracking Mode - Show achievement count and record button */
                      <td className="px-4 py-4 border-b border-r border-gray-200 text-center" colSpan={4}>
                        <div className="flex items-center justify-center gap-4">
                          <div className="text-sm text-gray-600">
                            {target.achievements.length > 0 ? (
                              <span className="font-medium text-gray-700">
                                {target.achievements.length} achievement{target.achievements.length !== 1 ? 's' : ''} recorded
                              </span>
                            ) : (
                              <span className="italic text-gray-400">No achievements recorded yet</span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleOpenSimpleModal(target)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                          >
                            <Plus size={16} className="mr-1" />
                            Record Achievement
                          </Button>
                        </div>
                      </td>
                    )}

                    {/* Total Achievement */}
                    <td className="px-4 py-4 border-b border-r border-gray-200 text-right">
                      <span className="font-bold text-lg text-gray-900">{totalAchievement.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4 border-b border-r border-gray-200 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-lg font-bold ${isOnTarget ? 'text-green-600' : 'text-red-600'}`}>
                          {(performancePercent * 100).toFixed(1)}%
                        </span>
                        <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${isOnTarget ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(performancePercent * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-b border-r border-gray-200 text-center">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 ${
                        isOnTarget ? 'bg-green-100 text-green-800 border-2 border-green-300' : 'bg-red-100 text-red-800 border-2 border-red-300'
                      }`}>
                        {isOnTarget ? (
                          <>
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            YES
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                            NO
                          </>
                        )}
                      </span>
                    </td>

                    {/* Comments - Editable */}
                    <td className="px-4 py-4 border-b border-gray-200">
                      {editingCell?.targetId === target.id && editingCell?.field === 'comments' ? (
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-4 py-3 text-lg border-3 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-xl"
                            placeholder="Enter comment..."
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveCell();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <button
                            onClick={handleSaveCell}
                            disabled={isSaving}
                            className={`p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-110 shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Save (Enter)"
                          >
                            <Save size={24} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className={`p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all hover:scale-110 shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Cancel (Esc)"
                          >
                            <X size={24} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-blue-100 px-3 py-2 rounded-md transition-colors text-sm group flex items-center gap-2"
                          onClick={() => handleCellEdit(target.id, 'comments')}
                          title="Click to edit comments"
                        >
                          <span className={target.target_notes ? 'text-gray-700' : 'text-gray-400 italic'}>
                            {target.target_notes || 'Click to add comment'}
                          </span>
                          <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}

        {targets.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Edit className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <h4 className="font-semibold text-gray-800 text-sm">How to Record Performance Data</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-bold">QUARTERLY</span>
                    <span className="text-gray-700 font-medium">Targets</span>
                  </div>
                  <ul className="text-xs text-gray-600 ml-4 space-y-1">
                    <li>• Click any Q1-Q4 cell to edit</li>
                    <li>• Press <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded font-mono">Enter</kbd> to save or <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded font-mono">Esc</kbd> to cancel</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">SIMPLE</span>
                    <span className="text-gray-700 font-medium">Targets</span>
                  </div>
                  <ul className="text-xs text-gray-600 ml-4 space-y-1">
                    <li>• Click "Record Achievement" button</li>
                    <li>• Enter achievement value with date</li>
                    <li>• Multiple achievements accumulate automatically</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-gray-600 italic mt-3">
                Total achievement and performance percentage are calculated automatically. Targets ≥80% are marked as "On Target".
              </p>
            </div>
          </div>
        </div>
        )}
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

      {/* Simple Achievement Modal */}
      <SimpleAchievementModal
        isOpen={simpleModalOpen && selectedSimpleTarget !== null}
        onClose={() => {
          console.log('Closing modal');
          setSimpleModalOpen(false);
          setSelectedSimpleTarget(null);
        }}
        targetId={selectedSimpleTarget?.id || ''}
        targetName={selectedSimpleTarget ? `${selectedSimpleTarget.indicator_code} - ${selectedSimpleTarget.indicator_name}` : ''}
        annualTarget={selectedSimpleTarget?.annual_target || 0}
        currentAchievements={selectedSimpleTarget?.achievements || []}
        onSave={handleSaveSimpleAchievement}
      />
    </div>
  );
}