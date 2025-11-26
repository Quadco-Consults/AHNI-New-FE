'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Users,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Shield,
  MessageSquare,
  Target,
  TrendingUp
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { TaskTemplate, TaskStep } from '@/types/chatTypes';

interface TaskGuideCardProps {
  template: TaskTemplate;
  userContext?: {
    role: string;
    experienceLevel: 'new' | 'intermediate' | 'experienced';
  };
  onStartTask?: () => void;
  className?: string;
}

export const TaskGuideCard = ({
  template,
  userContext,
  onStartTask,
  className
}: TaskGuideCardProps) => {
  const [expandedSections, setExpandedSections] = useState({
    steps: false,
    tips: false,
    mistakes: false,
    help: false
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const markStepComplete = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'programs': return <Target size={16} />;
      case 'hr': return <Users size={16} />;
      case 'procurement': return <TrendingUp size={16} />;
      case 'finance': return <TrendingUp size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  return (
    <Card className={cn("border-blue-200 bg-blue-50/30", className)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
            {getModuleIcon(template.module)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-blue-900">{template.name}</h3>
              <Badge
                variant="outline"
                className={getDifficultyColor(template.difficulty)}
              >
                {template.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-blue-700 mb-2">{template.description}</p>

            {/* Quick info */}
            <div className="flex items-center gap-4 text-xs text-blue-600">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{template.timeRequired}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={12} />
                <span>{template.steps.length} steps</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>{template.module}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Answer */}
        <div className="bg-blue-100 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <Target size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 text-sm mb-1">Quick Answer</h4>
              <p className="text-sm text-blue-700">{template.quickAnswer}</p>
            </div>
          </div>
        </div>

        {/* Prerequisites */}
        {template.prerequisites.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
              <Shield size={14} className="text-amber-500" />
              Before You Start
            </h4>
            <div className="space-y-1">
              {template.prerequisites.map((prereq, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-gray-700">{prereq}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection('steps')}
            className="p-0 h-auto font-medium text-gray-900 hover:bg-transparent"
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600" />
              Step-by-Step Instructions
              {expandedSections.steps ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </Button>

          {expandedSections.steps && (
            <div className="mt-3 space-y-3">
              {template.steps.map((step, index) => (
                <StepCard
                  key={step.stepNumber}
                  step={step}
                  isCompleted={completedSteps.includes(step.stepNumber)}
                  onComplete={() => markStepComplete(step.stepNumber)}
                  isActive={currentStep === index}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pro Tips */}
        {template.proTips.length > 0 && (
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('tips')}
              className="p-0 h-auto font-medium text-gray-900 hover:bg-transparent"
            >
              <div className="flex items-center gap-2">
                <Lightbulb size={14} className="text-yellow-500" />
                Pro Tips ({template.proTips.length})
                {expandedSections.tips ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </Button>

            {expandedSections.tips && (
              <div className="mt-3 space-y-2">
                {template.proTips.map((tip, index) => (
                  <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Common Mistakes */}
        {template.commonMistakes.length > 0 && (
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('mistakes')}
              className="p-0 h-auto font-medium text-gray-900 hover:bg-transparent"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-500" />
                Common Mistakes to Avoid ({template.commonMistakes.length})
                {expandedSections.mistakes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </Button>

            {expandedSections.mistakes && (
              <div className="mt-3 space-y-2">
                {template.commonMistakes.map((mistake, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-800">{mistake}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Help Contacts */}
        {template.helpContacts.length > 0 && (
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('help')}
              className="p-0 h-auto font-medium text-gray-900 hover:bg-transparent"
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-purple-500" />
                Get Help ({template.helpContacts.length} contacts)
                {expandedSections.help ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </Button>

            {expandedSections.help && (
              <div className="mt-3 space-y-2">
                {template.helpContacts.map((contact, index) => (
                  <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium text-purple-900 text-sm">{contact.role}</h5>
                        <p className="text-xs text-purple-700 mb-1">{contact.department}</p>
                        <p className="text-xs text-purple-600">For: {contact.forIssues.join(', ')}</p>
                      </div>
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                        {contact.contactMethod}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Next Steps */}
        {template.nextSteps.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
              <ArrowRight size={14} className="text-blue-500" />
              What Happens Next
            </h4>
            <div className="space-y-1">
              {template.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {onStartTask && (
            <Button size="sm" onClick={onStartTask} className="bg-blue-600 hover:bg-blue-700">
              Start This Task
            </Button>
          )}
          <Button variant="outline" size="sm">
            Bookmark Guide
          </Button>
          <Button variant="ghost" size="sm">
            Share Guide
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step Card Component
interface StepCardProps {
  step: TaskStep;
  isCompleted: boolean;
  onComplete: () => void;
  isActive: boolean;
}

const StepCard = ({ step, isCompleted, onComplete, isActive }: StepCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      "border rounded-lg p-3 transition-all",
      isActive ? "border-blue-300 bg-blue-50" : "border-gray-200",
      isCompleted ? "border-green-300 bg-green-50" : ""
    )}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium",
            isCompleted
              ? "bg-green-100 border-green-400 text-green-700"
              : isActive
                ? "bg-blue-100 border-blue-400 text-blue-700"
                : "bg-gray-100 border-gray-300 text-gray-600"
          )}>
            {isCompleted ? <CheckCircle size={12} /> : step.stepNumber}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h5 className={cn(
              "font-medium text-sm",
              isCompleted ? "text-green-900" : isActive ? "text-blue-900" : "text-gray-900"
            )}>
              {step.title}
            </h5>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="p-1 h-auto"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          </div>

          <p className="text-sm text-gray-600 mb-2">{step.description}</p>

          {expanded && (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded p-2">
                <p className="text-sm font-medium text-gray-700">Action:</p>
                <p className="text-sm text-gray-600">{step.action}</p>
              </div>

              {step.fieldExplanations && step.fieldExplanations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">Field Details:</p>
                  {step.fieldExplanations.map((field, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded p-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-blue-900">{field.fieldName}</span>
                        {field.required && (
                          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-blue-700">{field.description}</p>
                      {field.example && (
                        <p className="text-xs text-blue-600 mt-1 italic">Example: {field.example}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {step.warningNote && (
                <div className="bg-amber-50 border border-amber-200 rounded p-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={12} className="text-amber-600 mt-0.5" />
                    <p className="text-xs text-amber-700">{step.warningNote}</p>
                  </div>
                </div>
              )}

              {step.successIndicator && (
                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={12} className="text-green-600 mt-0.5" />
                    <p className="text-xs text-green-700">Success: {step.successIndicator}</p>
                  </div>
                </div>
              )}

              {!isCompleted && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onComplete}
                  className="w-full"
                >
                  Mark Step Complete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};