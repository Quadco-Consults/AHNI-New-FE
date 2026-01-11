"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelect";
import FormTextArea from "@/components/atoms/FormTextArea";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

export interface ProjectTarget {
  id?: string;
  indicator: string;
  indicator_name: string;
  tracking_mode: 'SIMPLE' | 'QUARTERLY';
  fiscal_year: string;
  target_value: number;
  // Quarterly fields (conditional)
  q1_target?: number;
  q2_target?: number;
  q3_target?: number;
  q4_target?: number;
  // Initial achievement (for simple mode)
  initial_achievement?: number;
  comments?: string;
}

interface TargetsSectionProps {
  targets: ProjectTarget[];
  onTargetsChange: (targets: ProjectTarget[]) => void;
}

// Sample performance indicators - this should come from your API
const PERFORMANCE_INDICATORS = [
  { code: 'TX_CURR', name: 'Number of adults and children currently receiving antiretroviral therapy (ART)' },
  { code: 'TX_NEW', name: 'Number of adults and children newly enrolled on antiretroviral therapy (ART)' },
  { code: 'HTS_TST', name: 'Number of individuals who received HIV testing services (HTS)' },
  { code: 'PMTCT_STAT', name: 'Number of pregnant women with known HIV status' },
  { code: 'OVC_SERV', name: 'Number of beneficiaries served by PEPFAR OVC programs' },
  { code: 'CUSTOM', name: 'Custom Indicator (Enter your own)' },
];

const FISCAL_YEARS = [
  { label: 'FY24 (2023/2024)', value: 'FY24' },
  { label: 'FY25 (2024/2025)', value: 'FY25' },
  { label: 'FY26 (2025/2026)', value: 'FY26' },
];

export default function TargetsSection({ targets, onTargetsChange }: TargetsSectionProps) {
  const [isAddingTarget, setIsAddingTarget] = useState(false);
  const [newTarget, setNewTarget] = useState<Partial<ProjectTarget>>({
    indicator: '',
    indicator_name: '',
    tracking_mode: 'SIMPLE',
    fiscal_year: 'FY25',
    target_value: 0,
    initial_achievement: 0,
    comments: ''
  });

  const handleAddTarget = () => {
    if (!newTarget.indicator || !newTarget.target_value) {
      toast.error("Please fill in all required fields");
      return;
    }

    const target: ProjectTarget = {
      id: `temp_${Date.now()}`, // Temporary ID for frontend
      indicator: newTarget.indicator!,
      indicator_name: newTarget.indicator_name!,
      tracking_mode: newTarget.tracking_mode!,
      fiscal_year: newTarget.fiscal_year!,
      target_value: newTarget.target_value!,
      initial_achievement: newTarget.initial_achievement,
      comments: newTarget.comments,
      // Add quarterly targets if quarterly mode
      ...(newTarget.tracking_mode === 'QUARTERLY' && {
        q1_target: newTarget.q1_target || 0,
        q2_target: newTarget.q2_target || 0,
        q3_target: newTarget.q3_target || 0,
        q4_target: newTarget.q4_target || 0,
      })
    };

    onTargetsChange([...targets, target]);

    // Reset form
    setNewTarget({
      indicator: '',
      indicator_name: '',
      tracking_mode: 'SIMPLE',
      fiscal_year: 'FY25',
      target_value: 0,
      initial_achievement: 0,
      comments: ''
    });
    setIsAddingTarget(false);
    toast.success("Target added successfully");
  };

  const handleRemoveTarget = (targetId: string) => {
    onTargetsChange(targets.filter(t => t.id !== targetId));
    toast.success("Target removed");
  };

  const handleIndicatorChange = (indicatorCode: string) => {
    const indicator = PERFORMANCE_INDICATORS.find(ind => ind.code === indicatorCode);
    setNewTarget({
      ...newTarget,
      indicator: indicatorCode,
      indicator_name: indicator?.name || ''
    });
  };

  const indicatorOptions = PERFORMANCE_INDICATORS.map(ind => ({
    label: `${ind.code} - ${ind.name}`,
    value: ind.code
  }));

  return (
    <div className="space-y-6">
      <hr />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Label className="font-semibold text-lg">Performance Targets</Label>
            <p className="text-sm text-gray-600 mt-1">
              Set measurable targets for this project. You can use simple tracking or detailed quarterly breakdown.
            </p>
          </div>

          {!isAddingTarget && (
            <Button
              type="button"
              variant="outline"
              className="text-blue-600 border-blue-600"
              onClick={() => setIsAddingTarget(true)}
            >
              <Plus className="mr-2" size={12} />
              Add Target
            </Button>
          )}
        </div>

        {/* Existing Targets */}
        <div className="space-y-3">
          {targets.map((target) => (
            <Card key={target.id} className="p-4 border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-blue-600">{target.indicator}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                      {target.tracking_mode}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {target.fiscal_year}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-2">{target.indicator_name}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Annual Target:</span>
                      <span className="ml-1">{target.target_value.toLocaleString()}</span>
                    </div>

                    {target.tracking_mode === 'QUARTERLY' && (
                      <>
                        <div>
                          <span className="font-medium">Q1:</span>
                          <span className="ml-1">{target.q1_target?.toLocaleString() || 0}</span>
                        </div>
                        <div>
                          <span className="font-medium">Q2:</span>
                          <span className="ml-1">{target.q2_target?.toLocaleString() || 0}</span>
                        </div>
                        <div>
                          <span className="font-medium">Q3:</span>
                          <span className="ml-1">{target.q3_target?.toLocaleString() || 0}</span>
                        </div>
                        <div>
                          <span className="font-medium">Q4:</span>
                          <span className="ml-1">{target.q4_target?.toLocaleString() || 0}</span>
                        </div>
                      </>
                    )}

                    {target.tracking_mode === 'SIMPLE' && target.initial_achievement && (
                      <div>
                        <span className="font-medium">Initial Achievement:</span>
                        <span className="ml-1">{target.initial_achievement.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {target.comments && (
                    <p className="text-sm text-gray-600 mt-2 italic">"{target.comments}"</p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveTarget(target.id!)}
                >
                  <X size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Add New Target Form */}
        {isAddingTarget && (
          <Card className="p-6 border-2 border-blue-200">
            <h4 className="font-semibold mb-4">Add Performance Target</h4>

            <div className="space-y-4">
              {/* Indicator Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Performance Indicator *</Label>
                  <select
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    value={newTarget.indicator}
                    onChange={(e) => handleIndicatorChange(e.target.value)}
                    required
                  >
                    <option value="">Select an indicator...</option>
                    {PERFORMANCE_INDICATORS.map(ind => (
                      <option key={ind.code} value={ind.code}>
                        {ind.code} - {ind.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Fiscal Year</Label>
                  <select
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    value={newTarget.fiscal_year}
                    onChange={(e) => setNewTarget({...newTarget, fiscal_year: e.target.value})}
                  >
                    {FISCAL_YEARS.map(fy => (
                      <option key={fy.value} value={fy.value}>{fy.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Indicator Name (if CUSTOM selected) */}
              {newTarget.indicator === 'CUSTOM' && (
                <div>
                  <Label className="text-sm font-medium">Custom Indicator Name *</Label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Enter your custom indicator name"
                    value={newTarget.indicator_name}
                    onChange={(e) => setNewTarget({...newTarget, indicator_name: e.target.value})}
                    required
                  />
                </div>
              )}

              {/* Tracking Mode */}
              <div>
                <Label className="text-sm font-medium">Tracking Mode</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="SIMPLE"
                      checked={newTarget.tracking_mode === 'SIMPLE'}
                      onChange={(e) => setNewTarget({...newTarget, tracking_mode: e.target.value as 'SIMPLE' | 'QUARTERLY'})}
                      className="mr-2"
                    />
                    Simple (Annual target only)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="QUARTERLY"
                      checked={newTarget.tracking_mode === 'QUARTERLY'}
                      onChange={(e) => setNewTarget({...newTarget, tracking_mode: e.target.value as 'SIMPLE' | 'QUARTERLY'})}
                      className="mr-2"
                    />
                    Quarterly (Detailed breakdown)
                  </label>
                </div>
              </div>

              {/* Target Values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Annual Target *</Label>
                  <input
                    type="number"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Enter annual target"
                    value={newTarget.target_value || ''}
                    onChange={(e) => setNewTarget({...newTarget, target_value: Number(e.target.value)})}
                    required
                  />
                </div>

                {newTarget.tracking_mode === 'SIMPLE' && (
                  <div>
                    <Label className="text-sm font-medium">Initial Achievement (Optional)</Label>
                    <input
                      type="number"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      placeholder="Current achievement (if any)"
                      value={newTarget.initial_achievement || ''}
                      onChange={(e) => setNewTarget({...newTarget, initial_achievement: Number(e.target.value)})}
                    />
                  </div>
                )}
              </div>

              {/* Quarterly Targets (if quarterly mode) */}
              {newTarget.tracking_mode === 'QUARTERLY' && (
                <div>
                  <Label className="text-sm font-medium">Quarterly Targets</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    <div>
                      <label className="text-xs text-gray-600">Q1</label>
                      <input
                        type="number"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        placeholder="Q1"
                        value={newTarget.q1_target || ''}
                        onChange={(e) => setNewTarget({...newTarget, q1_target: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Q2</label>
                      <input
                        type="number"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        placeholder="Q2"
                        value={newTarget.q2_target || ''}
                        onChange={(e) => setNewTarget({...newTarget, q2_target: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Q3</label>
                      <input
                        type="number"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        placeholder="Q3"
                        value={newTarget.q3_target || ''}
                        onChange={(e) => setNewTarget({...newTarget, q3_target: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Q4</label>
                      <input
                        type="number"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        placeholder="Q4"
                        value={newTarget.q4_target || ''}
                        onChange={(e) => setNewTarget({...newTarget, q4_target: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Comments */}
              <div>
                <Label className="text-sm font-medium">Comments (Optional)</Label>
                <textarea
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  rows={2}
                  placeholder="Add any notes about this target..."
                  value={newTarget.comments || ''}
                  onChange={(e) => setNewTarget({...newTarget, comments: e.target.value})}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingTarget(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAddTarget}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Target
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Helper Text */}
        {targets.length === 0 && !isAddingTarget && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No performance targets added yet.</p>
            <p className="text-xs mt-1">Click "Add Target" to define measurable goals for this project.</p>
          </div>
        )}
      </div>
    </div>
  );
}