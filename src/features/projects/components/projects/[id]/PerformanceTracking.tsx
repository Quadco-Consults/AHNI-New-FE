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
  const [editingAchievement, setEditingAchievement] = useState<{
    targetId: string;
    quarter?: string;
    isNew: boolean;
  } | null>(null);
  const [achievementForm, setAchievementForm] = useState({
    value: 0,
    date: new Date().toISOString().split('T')[0],
    comments: ''
  });

  // Initialize targets with achievement tracking
  useEffect(() => {
    const targetsWithAchievements: TargetWithAchievements[] = projectTargets.map(target => {
      // In real implementation, fetch achievements from API
      const achievements: Achievement[] = []; // Placeholder
      const totalAchievement = achievements.reduce((sum, ach) => sum + ach.achievement_value, 0);
      const percentageAchieved = target.annual_target > 0 ? (totalAchievement / target.annual_target) * 100 : 0;

      return {
        ...target,
        achievements,
        total_achievement: totalAchievement,
        percentage_achieved: percentageAchieved,
        is_on_target: percentageAchieved >= 80
      };
    });

    setTargets(targetsWithAchievements);
  }, [projectTargets]);

  const handleAddAchievement = (targetId: string, quarter?: string) => {
    setEditingAchievement({ targetId, quarter, isNew: true });
    setAchievementForm({
      value: 0,
      date: new Date().toISOString().split('T')[0],
      comments: ''
    });
  };

  const handleSaveAchievement = () => {
    if (!editingAchievement) return;

    const newAchievement: Achievement = {
      id: `temp_${Date.now()}`,
      target_id: editingAchievement.targetId,
      quarter: editingAchievement.quarter as any,
      achievement_value: achievementForm.value,
      achievement_date: achievementForm.date,
      comments: achievementForm.comments
    };

    // Update targets with new achievement
    setTargets(prev => prev.map(target => {
      if (target.id === editingAchievement.targetId) {
        const updatedAchievements = [...target.achievements, newAchievement];
        const totalAchievement = updatedAchievements.reduce((sum, ach) => sum + ach.achievement_value, 0);
        const percentageAchieved = target.annual_target > 0 ? (totalAchievement / target.annual_target) * 100 : 0;

        return {
          ...target,
          achievements: updatedAchievements,
          total_achievement: totalAchievement,
          percentage_achieved: Math.round(percentageAchieved * 10) / 10,
          is_on_target: percentageAchieved >= 80
        };
      }
      return target;
    }));

    setEditingAchievement(null);
    toast.success("Achievement recorded successfully!");
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

      {/* Targets and Achievement Tracking */}
      {targets.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <h3 className="text-lg font-semibold mb-2">No Targets Defined</h3>
            <p className="text-sm">No performance targets were set during project creation.</p>
            <p className="text-xs mt-2">Targets should be defined when creating the project.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {targets.map((target) => (
            <Card key={target.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-blue-600">{target.indicator_code}</h4>
                  <p className="text-sm text-gray-600">{target.indicator_name}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {target.tracking_mode}
                    </span>
                    <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {target.fiscal_year}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      target.is_on_target ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {target.is_on_target ? 'On Target' : 'Off Target'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold">{target.percentage_achieved}%</div>
                  <div className="text-sm text-gray-600">Performance</div>
                </div>
              </div>

              {target.tracking_mode === 'SIMPLE' ? (
                /* Simple Tracking Table */
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold border-r">Annual Target</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border-r">Total Achievement</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border-r">Percentage</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr>
                        <td className="px-4 py-3 border-r font-medium">
                          {target.annual_target.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 border-r font-medium">
                          {target.total_achievement.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 border-r">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${
                              target.percentage_achieved >= 100 ? 'text-green-600' :
                              target.percentage_achieved >= 80 ? 'text-blue-600' :
                              'text-red-600'
                            }`}>
                              {target.percentage_achieved}%
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  target.percentage_achieved >= 100 ? 'bg-green-500' :
                                  target.percentage_achieved >= 80 ? 'bg-blue-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(target.percentage_achieved, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            size="sm"
                            onClick={() => handleAddAchievement(target.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <FaPlus className="mr-1" size={12} />
                            Add Achievement
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Quarterly Tracking Table */
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-sm font-semibold border-r">Quarter</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold border-r">Target</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold border-r">Achievement</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold border-r">Performance</th>
                        <th className="px-3 py-2 text-center text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => {
                        const quarterlyTarget = getQuarterlyTarget(target, quarter);
                        const quarterlyAchievement = getQuarterlyAchievement(target, quarter);
                        const quarterlyPerformance = quarterlyTarget > 0 ?
                          ((quarterlyAchievement?.achievement_value || 0) / quarterlyTarget) * 100 : 0;

                        return (
                          <tr key={quarter} className="border-t">
                            <td className="px-3 py-2 border-r font-medium">{quarter}</td>
                            <td className="px-3 py-2 border-r">{quarterlyTarget.toLocaleString()}</td>
                            <td className="px-3 py-2 border-r">
                              {quarterlyAchievement ? quarterlyAchievement.achievement_value.toLocaleString() : '-'}
                            </td>
                            <td className="px-3 py-2 border-r">
                              {quarterlyAchievement ? (
                                <span className={`font-semibold ${
                                  quarterlyPerformance >= 100 ? 'text-green-600' :
                                  quarterlyPerformance >= 80 ? 'text-blue-600' :
                                  'text-red-600'
                                }`}>
                                  {Math.round(quarterlyPerformance)}%
                                </span>
                              ) : '-'}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {quarterlyAchievement ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAddAchievement(target.id, quarter)}
                                >
                                  <FaEdit size={12} />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleAddAchievement(target.id, quarter)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <FaPlus className="mr-1" size={12} />
                                  Add
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {/* Cumulative Row */}
                      <tr className="border-t bg-blue-50">
                        <td className="px-3 py-2 border-r font-bold">TOTAL</td>
                        <td className="px-3 py-2 border-r font-bold">{target.annual_target.toLocaleString()}</td>
                        <td className="px-3 py-2 border-r font-bold">{target.total_achievement.toLocaleString()}</td>
                        <td className="px-3 py-2 border-r">
                          <span className={`font-bold ${
                            target.percentage_achieved >= 100 ? 'text-green-600' :
                            target.percentage_achieved >= 80 ? 'text-blue-600' :
                            'text-red-600'
                          }`}>
                            {target.percentage_achieved}%
                          </span>
                        </td>
                        <td className="px-3 py-2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {target.target_notes && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Target Notes:</strong> {target.target_notes}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Achievement Entry Modal */}
      {editingAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Record Achievement {editingAchievement.quarter && `- ${editingAchievement.quarter}`}
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Achievement Value</Label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                  value={achievementForm.value}
                  onChange={(e) => setAchievementForm({...achievementForm, value: Number(e.target.value)})}
                  placeholder="Enter achieved value"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Achievement Date</Label>
                <input
                  type="date"
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                  value={achievementForm.date}
                  onChange={(e) => setAchievementForm({...achievementForm, date: e.target.value})}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Comments (Optional)</Label>
                <textarea
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                  rows={3}
                  value={achievementForm.comments}
                  onChange={(e) => setAchievementForm({...achievementForm, comments: e.target.value})}
                  placeholder="Add notes about this achievement..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setEditingAchievement(null)}
              >
                <FaTimes className="mr-1" size={12} />
                Cancel
              </Button>
              <Button
                onClick={handleSaveAchievement}
                className="bg-green-600 hover:bg-green-700"
              >
                <FaSave className="mr-1" size={12} />
                Save Achievement
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}