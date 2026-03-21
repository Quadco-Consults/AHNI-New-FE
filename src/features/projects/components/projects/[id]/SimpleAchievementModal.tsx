"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Save, Plus } from "lucide-react";
import { toast } from "sonner";

interface Achievement {
  id?: string;
  target_id: string;
  achievement_value: number;
  achievement_date: string;
  comments?: string;
}

interface SimpleAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetName: string;
  annualTarget: number;
  currentAchievements: Achievement[];
  onSave: (achievement: Omit<Achievement, 'id'>) => Promise<void>;
}

export default function SimpleAchievementModal({
  isOpen,
  onClose,
  targetId,
  targetName,
  annualTarget,
  currentAchievements,
  onSave
}: SimpleAchievementModalProps) {
  const [achievementValue, setAchievementValue] = useState<string>('');
  const [achievementDate, setAchievementDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [comments, setComments] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened - resetting form');
      setAchievementValue('');
      setComments('');
      setAchievementDate(new Date().toISOString().split('T')[0]);
      setIsSaving(false);
    }
  }, [isOpen]);

  // Calculate current total achievement
  const totalAchievement = currentAchievements.reduce(
    (sum, ach) => sum + ach.achievement_value,
    0
  );
  const percentageAchieved = annualTarget > 0
    ? (totalAchievement / annualTarget) * 100
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const value = parseFloat(achievementValue);
    if (isNaN(value) || value <= 0) {
      toast.error("Please enter a valid achievement value");
      return;
    }

    if (!achievementDate) {
      toast.error("Please select achievement date");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        target_id: targetId,
        achievement_value: value,
        achievement_date: achievementDate,
        comments: comments.trim() || undefined
      });

      // Reset form
      setAchievementValue('');
      setComments('');
      setAchievementDate(new Date().toISOString().split('T')[0]);

      toast.success("Achievement recorded successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving achievement:", error);
      toast.error("Failed to save achievement. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Record Achievement</h2>
              <p className="text-sm text-blue-100 mt-1">{targetName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={isSaving}
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Summary */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {annualTarget.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 mt-1">Annual Target</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {totalAchievement.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 mt-1">Current Achievement</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${percentageAchieved >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                  {percentageAchieved.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600 mt-1">Performance</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  percentageAchieved >= 80 ? 'bg-green-500' : 'bg-orange-500'
                }`}
                style={{ width: `${Math.min(percentageAchieved, 100)}%` }}
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Achievement Value */}
            <div className="space-y-2">
              <Label htmlFor="achievement-value" className="text-sm font-semibold text-gray-700">
                Achievement Value <span className="text-red-500">*</span>
              </Label>
              <input
                id="achievement-value"
                type="number"
                min="0"
                step="0.01"
                value={achievementValue}
                onChange={(e) => setAchievementValue(e.target.value)}
                className="w-full px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all"
                placeholder="Enter achievement value"
                autoFocus
                required
              />
              <p className="text-xs text-gray-500">
                Enter the actual achievement value to be added to the cumulative total
              </p>
            </div>

            {/* Achievement Date */}
            <div className="space-y-2">
              <Label htmlFor="achievement-date" className="text-sm font-semibold text-gray-700">
                Achievement Date <span className="text-red-500">*</span>
              </Label>
              <input
                id="achievement-date"
                type="date"
                value={achievementDate}
                onChange={(e) => setAchievementDate(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all"
                required
              />
              <p className="text-xs text-gray-500">
                Select the date this achievement was recorded or completed
              </p>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <Label htmlFor="comments" className="text-sm font-semibold text-gray-700">
                Comments (Optional)
              </Label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all resize-none"
                placeholder="Add any notes or comments about this achievement..."
                rows={3}
              />
            </div>

            {/* Achievement History */}
            {currentAchievements.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Recent Achievements ({currentAchievements.length})
                </Label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Date</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-700">Value</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentAchievements
                        .sort((a, b) => new Date(b.achievement_date).getTime() - new Date(a.achievement_date).getTime())
                        .slice(0, 5)
                        .map((ach, index) => (
                          <tr key={ach.id || index} className="border-t border-gray-100">
                            <td className="px-3 py-2 text-gray-600">
                              {new Date(ach.achievement_date).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-2 text-right font-semibold text-gray-900">
                              {ach.achievement_value.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-gray-600 text-xs truncate max-w-[200px]">
                              {ach.comments || '-'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} className="mr-2" />
                    Save Achievement
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
                className="px-6 py-3 rounded-xl font-semibold"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
