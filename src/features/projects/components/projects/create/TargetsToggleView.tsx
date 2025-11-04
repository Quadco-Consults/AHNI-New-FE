"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import SimpleTargetsTable, { SimpleTarget } from "./SimpleTargetsTable";
import QuarterlyTargetsTable, { QuarterlyTarget } from "./QuarterlyTargetsTable";

type ViewMode = 'simple' | 'quarterly';

interface TargetsToggleViewProps {
  isEditable?: boolean;
  onTargetsChange?: (targets: any[]) => void;
}

export default function TargetsToggleView({ isEditable = true, onTargetsChange }: TargetsToggleViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const [simpleTargets, setSimpleTargets] = useState<SimpleTarget[]>([]);
  const [quarterlyTargets, setQuarterlyTargets] = useState<QuarterlyTarget[]>([]);

  const handleSimpleTargetsChange = (targets: SimpleTarget[]) => {
    setSimpleTargets(targets);
    onTargetsChange?.(targets);
  };

  const handleQuarterlyTargetsChange = (targets: QuarterlyTarget[]) => {
    setQuarterlyTargets(targets);
    onTargetsChange?.(targets);
  };

  return (
    <div className="space-y-6">
      <hr />

      <div className="space-y-4">
        {/* View Mode Toggle */}
        <div className="flex justify-between items-center">
          <div>
            <Label className="font-semibold text-lg">Performance Targets</Label>
            <p className="text-sm text-gray-600 mt-1">
              Choose between simple annual tracking or detailed quarterly breakdown.
            </p>
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
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          {viewMode === 'simple' ? (
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Simple Annual Tracking</h4>
              <p className="text-sm text-blue-800">
                Perfect for basic projects. Set annual targets and track overall achievement with automatic percentage calculation.
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1">
                <li>• Columns: Indicator | Target | Achievement | Percentage</li>
                <li>• Automatic calculation: Percentage = Achievement ÷ Target × 100</li>
                <li>• Color-coded progress indicators</li>
              </ul>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Quarterly Detailed Tracking</h4>
              <p className="text-sm text-blue-800">
                Comprehensive tracking with quarterly milestones. Perfect for complex projects requiring detailed performance monitoring.
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1">
                <li>• Quarterly achievements: Q1, Q2, Q3, Q4</li>
                <li>• Automatic cumulative calculation</li>
                <li>• Annual performance percentage</li>
                <li>• On Target Y/N indicator</li>
                <li>• Comments for each indicator</li>
              </ul>
            </div>
          )}
        </div>

        {/* Render Appropriate Table */}
        {viewMode === 'simple' ? (
          <SimpleTargetsTable
            targets={simpleTargets}
            onTargetsChange={handleSimpleTargetsChange}
            isEditable={isEditable}
          />
        ) : (
          <QuarterlyTargetsTable
            targets={quarterlyTargets}
            onTargetsChange={handleQuarterlyTargetsChange}
            isEditable={isEditable}
          />
        )}

        {/* Data Export Info */}
        {(simpleTargets.length > 0 || quarterlyTargets.length > 0) && (
          <div className="text-xs text-gray-500 italic">
            💡 These targets will be saved with your project and can be updated later in the Performance section.
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