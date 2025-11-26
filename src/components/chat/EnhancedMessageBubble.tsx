'use client';

import { useState } from 'react';
import { Bot, User, Navigation, MapPin, CheckCircle, Clock, ArrowRight, ExternalLink, UserCog, Shield } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/services/chatService';
import { useRouter } from 'next/navigation';
import { TemplateCard } from './TemplateCard';
import { ProcessFlowCard } from './ProcessFlowCard';

interface EnhancedMessageBubbleProps {
  message: ChatMessage;
  className?: string;
}

export const EnhancedMessageBubble = ({ message, className }: EnhancedMessageBubbleProps) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const renderNavigationResponse = () => {
    const { structuredData } = message;
    if (!structuredData) return null;

    return (
      <Card className="mt-3 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-primary" />
            <span className="font-medium text-primary">Navigation Guide</span>
          </div>
          
          {structuredData.breadcrumb && (
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              {structuredData.breadcrumb.map((item: string, index: number) => (
                <span key={index} className="flex items-center gap-2">
                  {item}
                  {index < structuredData.breadcrumb.length - 1 && (
                    <ArrowRight size={12} />
                  )}
                </span>
              ))}
            </div>
          )}

          {structuredData.target && (
            <Button 
              onClick={() => handleNavigation(structuredData.target)}
              className="w-full mb-3"
              size="sm"
            >
              <ExternalLink size={14} className="mr-2" />
              Go to {structuredData.breadcrumb?.[structuredData.breadcrumb.length - 1] || 'Page'}
            </Button>
          )}

          {structuredData.actions && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Available Actions:</p>
              <div className="flex flex-wrap gap-2">
                {structuredData.actions.map((action: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {action}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderTaskGuideResponse = () => {
    const { structuredData } = message;
    if (!structuredData) return null;

    const progress = structuredData.currentStep ? 
      ((structuredData.currentStep - 1) / structuredData.steps) * 100 : 0;

    return (
      <Card className="mt-3 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-blue-500" />
            <span className="font-medium text-blue-700">Task Guide</span>
            {structuredData.urgencyLevel === 'high' && (
              <Badge variant="destructive" className="text-xs">Urgent</Badge>
            )}
          </div>
          
          <div className="space-y-3">
            {structuredData.estimatedTime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>Estimated time: {structuredData.estimatedTime}</span>
              </div>
            )}

            {structuredData.steps && structuredData.currentStep && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    Step {structuredData.currentStep} of {structuredData.steps}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {structuredData.nextAction && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Next Step:</p>
                <p className="text-sm text-blue-700">{structuredData.nextAction}</p>
              </div>
            )}

            {structuredData.prerequisites && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Before you start:</p>
                <div className="space-y-1">
                  {structuredData.prerequisites.map((prereq: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                      {prereq.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStructuredResponse = () => {
    if (!message.content || typeof message.content !== 'string') {
      return null;
    }

    return (
      <Card className="mt-3 border-green-200">
        <CardContent className="p-4">
          <div className="prose prose-sm max-w-none">
            {message.content.split('\n').map((line, index) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <h4 key={index} className="font-semibold text-green-700 mb-1 mt-3 first:mt-0">
                    {line.replace(/\*\*/g, '')}
                  </h4>
                );
              }
              if (line.startsWith('•')) {
                return (
                  <div key={index} className="flex items-start gap-2 mb-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{line.substring(2)}</span>
                  </div>
                );
              }
              if (line.trim()) {
                return (
                  <p key={index} className="text-sm mb-2">{line}</p>
                );
              }
              return <br key={index} />;
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTemplateResponse = () => {
    const { structuredData } = message;
    if (!structuredData?.template) return null;

    return (
      <div className="mt-3">
        <TemplateCard
          template={structuredData.template}
          onView={(template) => {
            console.log('View template:', template);
            // TODO: Open template viewer modal
          }}
          onDownload={(template) => {
            console.log('Download template:', template);
            // TODO: Implement download functionality
          }}
        />
      </div>
    );
  };

  const renderTemplateListResponse = () => {
    const { structuredData } = message;
    if (!structuredData?.templates || structuredData.templates.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        {structuredData.templates.map((template, index) => (
          <TemplateCard
            key={index}
            template={template}
            onView={(template) => {
              console.log('View template:', template);
              // TODO: Open template viewer modal
            }}
            onDownload={(template) => {
              console.log('Download template:', template);
              // TODO: Implement download functionality
            }}
          />
        ))}
      </div>
    );
  };

  const renderProcessFlowResponse = () => {
    const { structuredData } = message;
    if (!structuredData?.process) return null;

    return (
      <div className="mt-3">
        <ProcessFlowCard process={structuredData.process} />
      </div>
    );
  };

  const formatMessageContent = (content: string | undefined | null) => {
    if (!content || typeof content !== 'string') {
      return null;
    }

    return content.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="font-semibold mb-1">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      if (line.startsWith('•')) {
        return (
          <div key={index} className="flex items-start gap-2 mb-1">
            <div className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0" />
            <span>{line.substring(2)}</span>
          </div>
        );
      }
      if (line.trim()) {
        return <p key={index} className="mb-1">{line}</p>;
      }
      return <br key={index} />;
    });
  };

  // Determine if this is an admin message
  const isAdmin = message.sender === 'admin' || message.role === 'admin';
  const adminName = message.adminName || message.metadata?.admin_name || 'AHNI Admin';

  return (
    <div
      className={cn(
        "flex space-x-2",
        message.sender === 'user' ? 'justify-end' : 'justify-start',
        className
      )}
    >
      {(message.sender === 'bot' || isAdmin) && (
        <Avatar className={cn("w-6 h-6", isAdmin && "border-2 border-primary")}>
          <AvatarFallback className={cn(isAdmin ? "bg-primary text-primary-foreground" : "bg-muted")}>
            {isAdmin ? <Shield size={12} /> : <Bot size={12} />}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn(
        "max-w-[80%] rounded-lg p-3 text-sm",
        message.sender === 'user'
          ? 'bg-primary text-primary-foreground'
          : isAdmin
          ? 'bg-primary/10 text-foreground border-2 border-primary/30'
          : 'bg-muted text-muted-foreground'
      )}>
        {/* Admin Header */}
        {isAdmin && (
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-primary/20">
            <Shield size={14} className="text-primary" />
            <span className="font-semibold text-primary text-xs">
              {adminName}
            </span>
            <Badge variant="outline" className="text-xs ml-auto">Admin</Badge>
          </div>
        )}

        <div className="whitespace-pre-wrap">
          {formatMessageContent(message.content)}
        </div>

        {message.timestamp && (
          <p className="text-xs opacity-70 mt-2">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        )}

        {/* Enhanced response types */}
        {message.sender === 'bot' && message.responseType === 'navigation' && renderNavigationResponse()}
        {message.sender === 'bot' && message.responseType === 'task_guide' && renderTaskGuideResponse()}
        {message.sender === 'bot' && message.responseType === 'structured' && renderStructuredResponse()}
        {message.sender === 'bot' && message.responseType === 'template' && renderTemplateResponse()}
        {message.sender === 'bot' && message.responseType === 'template_list' && renderTemplateListResponse()}
        {message.sender === 'bot' && message.responseType === 'process_flow' && renderProcessFlowResponse()}
      </div>

      {message.sender === 'user' && (
        <Avatar className="w-6 h-6">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User size={12} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};