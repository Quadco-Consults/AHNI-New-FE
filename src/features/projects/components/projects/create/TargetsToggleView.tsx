"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import TargetDefinitionTable, { ProjectTargetDefinition } from "./TargetDefinitionTable";

type ViewMode = 'simple' | 'quarterly';

interface TargetsToggleViewProps {
  isEditable?: boolean;
  onTargetsChange?: (targets: ProjectTargetDefinition[]) => void;
  initialTargets?: ProjectTargetDefinition[];
}

export default function TargetsToggleView({ isEditable = true, onTargetsChange, initialTargets }: TargetsToggleViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const [projectTargets, setProjectTargets] = useState<ProjectTargetDefinition[]>([]);

  // Populate targets when initialTargets is provided (for editing existing projects)
  useEffect(() => {
    if (initialTargets && initialTargets.length > 0) {
      setProjectTargets(initialTargets);
    }
  }, [initialTargets]);

  const handleTargetsChange = (targets: ProjectTargetDefinition[]) => {
    // Merge the updated targets with targets from the other mode
    // This preserves targets when switching between Simple and Quarterly views
    // Only include targets that have a valid indicator_code
    const otherModeTargets = projectTargets.filter(target => {
      // Skip targets without indicator_code (incomplete targets)
      if (!target.indicator_code || target.indicator_code === '') return false;

      if (viewMode === 'simple') {
        return target.tracking_mode === 'QUARTERLY';
      } else {
        return target.tracking_mode === 'SIMPLE';
      }
    });

    const mergedTargets = [...otherModeTargets, ...targets];
    setProjectTargets(mergedTargets);
    onTargetsChange?.(mergedTargets);
  };

  // Filter targets to show only those matching current view mode
  const filteredTargets = projectTargets.filter(target => {
    if (viewMode === 'simple') {
      return target.tracking_mode === 'SIMPLE';
    } else {
      return target.tracking_mode === 'QUARTERLY';
    }
  });

  return (
    <div className="space-y-6">
      <hr />

      <div className="space-y-4">
        {/* View Mode Toggle */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex-1">
            <Label className="font-semibold text-lg">Step 1: Define Performance Targets</Label>
            <p className="text-sm text-gray-600 mt-1">
              Start by defining what you want to achieve. Choose between simple annual tracking or detailed quarterly breakdown.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <span className="text-sm text-blue-600 font-medium">Define your measurable goals first - this will guide your budget and planning.</span>
            </div>
          </div>

          <div className="flex gap-2 lg:flex-shrink-0">
            <Button
              type="button"
              variant={viewMode === 'simple' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('simple')}
              className={viewMode === 'simple' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-blue-600 border-blue-600 hover:bg-blue-50'}
            >
              Simple View
            </Button>
            <Button
              type="button"
              variant={viewMode === 'quarterly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('quarterly')}
              className={viewMode === 'quarterly' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-blue-600 border-blue-600 hover:bg-blue-50'}
            >
              Quarterly View
            </Button>
          </div>
        </div>

        {/* Mode Description */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          {viewMode === 'simple' ? (
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Simple Annual Target Setting</h4>
              <p className="text-sm text-green-800">
                Set annual targets for your project indicators. Perfect for basic projects with straightforward goals.
              </p>
              <ul className="text-xs text-green-700 mt-2 space-y-1">
                <li>• Define what you want to achieve by end of fiscal year</li>
                <li>• Achievements will be recorded during project execution</li>
                <li>• Simple tracking and progress monitoring</li>
              </ul>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Quarterly Target Breakdown</h4>
              <p className="text-sm text-green-800">
                Break down annual targets into quarterly milestones. Ideal for complex projects with detailed planning.
              </p>
              <ul className="text-xs text-green-700 mt-2 space-y-1">
                <li>• Set quarterly target milestones: Q1, Q2, Q3, Q4</li>
                <li>• Better project planning and monitoring</li>
                <li>• Achievements tracked quarterly during execution</li>
                <li>• Early identification of performance issues</li>
              </ul>
            </div>
          )}
        </div>

        {/* Render Target Definition Table */}
        <TargetDefinitionTable
          targets={filteredTargets}
          onTargetsChange={handleTargetsChange}
          viewMode={viewMode}
          isEditable={isEditable}
        />

        {/* Important Note */}
        {projectTargets.length > 0 && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600">⚠️</span>
              <div className="text-xs text-yellow-800">
                <strong>Note:</strong> You're defining TARGETS (what you plan to achieve).
                ACHIEVEMENTS will be recorded during project execution, not now during creation.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export the current state for parent components
export const useTargetsData = () => {
  return {
    simpleTargets: [],
    quarterlyTargets: [],
    viewMode: 'simple' as ViewMode
  };
};