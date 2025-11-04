"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import TargetDefinitionTable, { ProjectTargetDefinition } from "./TargetDefinitionTable";

type ViewMode = 'simple' | 'quarterly';

interface TargetsToggleViewProps {
  isEditable?: boolean;
  onTargetsChange?: (targets: ProjectTargetDefinition[]) => void;
}

export default function TargetsToggleView({ isEditable = true, onTargetsChange }: TargetsToggleViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const [projectTargets, setProjectTargets] = useState<ProjectTargetDefinition[]>([]);

  const handleTargetsChange = (targets: ProjectTargetDefinition[]) => {
    setProjectTargets(targets);
    onTargetsChange?.(targets);
  };

  return (
    <div className="space-y-6">
      <hr />

      <div className="space-y-4">
        {/* View Mode Toggle */}
        <div className="flex justify-between items-center">
          <div>
            <Label className="font-semibold text-lg">Step 1: Define Performance Targets</Label>
            <p className="text-sm text-gray-600 mt-1">
              Start by defining what you want to achieve. Choose between simple annual tracking or detailed quarterly breakdown.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <span className="text-sm text-blue-600 font-medium">Define your measurable goals first - this will guide your budget and planning.</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant={viewMode === 'simple' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('simple')}
              className={viewMode === 'simple' ? 'bg-blue-600 text-white' : 'text-blue-600 border-blue-600'}
            >
              Simple View
            </Button>
            <Button
              type="button"
              variant={viewMode === 'quarterly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('quarterly')}
              className={viewMode === 'quarterly' ? 'bg-blue-600 text-white' : 'text-blue-600 border-blue-600'}
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
          targets={projectTargets}
          onTargetsChange={handleTargetsChange}
          viewMode={viewMode}
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