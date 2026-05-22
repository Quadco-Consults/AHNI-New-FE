"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Plus, ChevronDown, ChevronUp, Upload } from "lucide-react";
import { toast } from "sonner";
import { ProjectTargetDefinition } from "@/features/projects/types/project";
import { Card } from "@/components/ui/card";
import TargetBulkUploadModal from "./TargetBulkUploadModal";

interface TargetDefinitionTableProps {
  targets: ProjectTargetDefinition[];
  onTargetsChange: (targets: ProjectTargetDefinition[]) => void;
  viewMode: 'simple' | 'quarterly';
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

// Generate dynamic fiscal years (current year - 1 to current year + 3)
const currentYear = new Date().getFullYear();
const FISCAL_YEARS = Array.from({ length: 5 }, (_, i) => {
  const year = currentYear - 1 + i;
  const fyNumber = year % 100; // Get last 2 digits
  return {
    label: `FY${fyNumber} (${year - 1}/${year})`,
    value: `FY${fyNumber}`
  };
});

export default function TargetDefinitionTable({ targets, onTargetsChange, viewMode, isEditable = true }: TargetDefinitionTableProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleAddTarget = () => {
    const currentFY = `FY${new Date().getFullYear() % 100}`;
    const newTarget: ProjectTargetDefinition = {
      id: `temp_${Date.now()}`,
      indicator_code: '',
      indicator_name: '',
      tracking_mode: viewMode === 'quarterly' ? 'QUARTERLY' : 'SIMPLE',
      fiscal_year: currentFY,
      annual_target: undefined,
      target_notes: '',
      // Initialize quarterly targets if quarterly mode
      ...(viewMode === 'quarterly' && {
        q1_target: undefined,
        q2_target: undefined,
        q3_target: undefined,
        q4_target: undefined,
      })
    };
    onTargetsChange([...targets, newTarget]);
    // Auto-expand the new card
    setExpandedCards(prev => new Set(prev).add(newTarget.id!));
    toast.success(`New ${viewMode === 'quarterly' ? 'quarterly' : 'simple'} target added`);
  };

  const handleRemoveTarget = (targetId: string) => {
    const target = targets.find(t => t.id === targetId);
    const hasData = target && target.indicator_code && target.annual_target;

    if (hasData) {
      const confirmed = window.confirm(
        `Are you sure you want to remove this target for ${target.indicator_code}? This action cannot be undone.`
      );
      if (!confirmed) return;
    }

    onTargetsChange(targets.filter(t => t.id !== targetId));
    setExpandedCards(prev => {
      const next = new Set(prev);
      next.delete(targetId);
      return next;
    });
    toast.success("Target removed");
  };

  const handleTargetChange = (targetId: string, field: keyof ProjectTargetDefinition, value: string | number | undefined) => {
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

  const handleBulkImport = (importedTargets: ProjectTargetDefinition[]) => {
    // Merge imported targets with existing ones
    const mergedTargets = [...targets, ...importedTargets];
    onTargetsChange(mergedTargets);

    // Auto-expand all newly imported targets
    setExpandedCards(prev => {
      const next = new Set(prev);
      importedTargets.forEach(t => next.add(t.id!));
      return next;
    });
  };

  const toggleCard = (targetId: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(targetId)) {
        next.delete(targetId);
      } else {
        next.add(targetId);
      }
      return next;
    });
  };

  // Auto-expand all cards on mount
  useEffect(() => {
    if (targets.length > 0) {
      setExpandedCards(new Set(targets.map(t => t.id!)));
    }
  }, []);

  // Add keyboard shortcut (Ctrl/Cmd + K) to add new target
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && isEditable) {
        e.preventDefault();
        handleAddTarget();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewMode, isEditable]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="text-green-600 border-green-600 hover:bg-green-50"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload className="mr-2" size={16} />
          Import from Excel
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden md:inline">
            Ctrl+K / ⌘K
          </span>
          <Button
            type="button"
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
            onClick={handleAddTarget}
            title="Add a new target (Ctrl+K or ⌘K)"
          >
            <Plus className="mr-2" size={16} />
            Add Target
          </Button>
        </div>
      </div>

      {/* Card-based Target List */}
      {targets.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="text-gray-400" size={32} />
            </div>
            <div className="text-center text-gray-500">
              <p className="font-medium text-sm">No targets defined yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Click "Add Target" button above to set your project goals
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {targets.map((target, index) => {
            const isExpanded = expandedCards.has(target.id!);
            const isComplete = target.indicator_code && target.annual_target && target.annual_target > 0;

            return (
              <Card key={target.id} className={`overflow-hidden transition-all ${isComplete ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
                {/* Card Header - Always Visible */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => toggleCard(target.id!)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${isComplete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {index + 1}
                        </div>
                        {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </div>

                      <div className="flex-1">
                        {target.indicator_code ? (
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{target.indicator_code}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{target.indicator_name}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic">Click to define target details</p>
                        )}
                      </div>

                      {target.annual_target && (
                        <div className="hidden md:flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Target</p>
                            <p className="font-semibold text-gray-900">{target.annual_target.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">FY</p>
                            <p className="font-semibold text-gray-900">{target.fiscal_year}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTarget(target.id!);
                      }}
                      title="Remove target"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>

                {/* Card Body - Expandable */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-gray-100 bg-white">
                    <div className="space-y-4">
                      {/* Indicator Selection */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Performance Indicator <span className="text-red-500">*</span>
                        </Label>
                        <select
                          className="w-full p-2.5 border border-gray-300 rounded-md text-sm font-medium bg-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          value={target.indicator_code}
                          onChange={(e) => handleTargetChange(target.id!, 'indicator_code', e.target.value)}
                        >
                          <option value="">Select Indicator...</option>
                          {PERFORMANCE_INDICATORS.map(ind => (
                            <option key={ind.code} value={ind.code}>
                              {ind.code} - {ind.name.length > 60 ? ind.name.substring(0, 60) + '...' : ind.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Custom Indicator Name */}
                      {target.indicator_code === 'CUSTOM' && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Custom Indicator Name <span className="text-red-500">*</span>
                          </Label>
                          <input
                            type="text"
                            className="w-full p-2.5 border border-gray-300 rounded-md text-sm font-medium bg-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter custom indicator name"
                            value={target.indicator_name}
                            onChange={(e) => handleTargetChange(target.id!, 'indicator_name', e.target.value)}
                          />
                        </div>
                      )}

                      {/* Fiscal Year & Annual Target */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Fiscal Year</Label>
                          <select
                            className="w-full p-2.5 border border-gray-300 rounded-md text-sm font-medium bg-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={target.fiscal_year}
                            onChange={(e) => handleTargetChange(target.id!, 'fiscal_year', e.target.value)}
                          >
                            {FISCAL_YEARS.map(fy => (
                              <option key={fy.value} value={fy.value}>{fy.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Annual Target <span className="text-red-500">*</span>
                          </Label>
                          <input
                            type="number"
                            className="w-full p-2.5 border border-gray-300 rounded-md text-sm font-medium bg-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter annual target"
                            value={target.annual_target ?? ''}
                            onChange={(e) => handleTargetChange(target.id!, 'annual_target', e.target.value === '' ? undefined : Number(e.target.value))}
                            min="0"
                          />
                        </div>
                      </div>

                      {/* Quarterly Targets */}
                      {viewMode === 'quarterly' && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Quarterly Breakdown</Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['q1', 'q2', 'q3', 'q4'].map((quarter, qIndex) => (
                              <div key={quarter} className="space-y-1">
                                <Label className="text-xs text-gray-600">Q{qIndex + 1}</Label>
                                <input
                                  type="number"
                                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm font-medium bg-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  placeholder={`Q${qIndex + 1}`}
                                  value={target[`${quarter}_target` as keyof ProjectTargetDefinition] ?? ''}
                                  onChange={(e) => handleTargetChange(target.id!, `${quarter}_target` as keyof ProjectTargetDefinition, e.target.value === '' ? undefined : Number(e.target.value))}
                                  min="0"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Target Notes */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Target Notes (Optional)</Label>
                        <textarea
                          className="w-full p-2.5 border border-gray-300 rounded-md text-sm font-medium bg-gray-100 resize-y min-h-[80px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          rows={3}
                          value={target.target_notes || ''}
                          onChange={(e) => handleTargetChange(target.id!, 'target_notes', e.target.value)}
                          placeholder="Add any notes or context about this target..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Target Summary */}
      {targets.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-blue-900">{targets.length}</div>
              <div className="text-blue-700">Total Targets</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-900">
                {viewMode === 'simple' ? 'Simple' : 'Quarterly'}
              </div>
              <div className="text-blue-700">Tracking Mode</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-900">
                {targets.filter(t => t.indicator_code && t.annual_target && t.annual_target > 0).length}
              </div>
              <div className="text-blue-700">Complete Targets</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-blue-600">
            💡 These targets will be used for progress tracking once the project starts. Achievements will be recorded during project execution.
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      <TargetBulkUploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onImport={handleBulkImport}
        viewMode={viewMode}
      />
    </div>
  );
}
