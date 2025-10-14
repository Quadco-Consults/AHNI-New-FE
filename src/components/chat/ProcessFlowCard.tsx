'use client';

import { GitBranch, Clock, FileText, User, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProcessFlow, ProcessStep } from '@/services/chatService';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProcessFlowCardProps {
  process: ProcessFlow;
  expandAll?: boolean;
}

export const ProcessFlowCard = ({ process, expandAll = false }: ProcessFlowCardProps) => {
  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-semibold text-blue-900">
              {process.name}
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {process.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          {process.description}
        </p>

        <div className="flex items-center gap-4 mb-4 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{process.total_duration}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <CheckCircle2 className="h-3 w-3" />
            <span>{process.steps.length} steps</span>
          </div>
        </div>

        {/* Process Steps */}
        <Accordion type="single" collapsible className="w-full" defaultValue={expandAll ? "step-1" : undefined}>
          {process.steps.map((step: ProcessStep, index: number) => (
            <AccordionItem key={step.step} value={`step-${step.step}`} className="border-l-2 border-blue-200 pl-3 mb-2">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-blue-700">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{step.name}</p>
                    <p className="text-xs text-muted-foreground">{step.duration}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-3">
                <div className="space-y-2 ml-8">
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>

                  <div className="flex items-center gap-1 text-xs">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Actor:</span>
                    <span className="font-medium">{step.actor}</span>
                  </div>

                  {step.outputs && step.outputs.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-1">Outputs:</p>
                      <div className="flex flex-wrap gap-1">
                        {step.outputs.map((output, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {output}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.template && (
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <FileText className="h-3 w-3" />
                      <span>Template: {step.template}</span>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Required Documents */}
        {process.required_documents && process.required_documents.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <p className="text-xs font-medium mb-2">Required Documents:</p>
            <div className="flex flex-wrap gap-1">
              {process.required_documents.map((doc, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {doc}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
