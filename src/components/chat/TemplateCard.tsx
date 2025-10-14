'use client';

import { FileText, Download, Eye, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Template } from '@/services/chatService';

interface TemplateCardProps {
  template: Template;
  onView?: (template: Template) => void;
  onDownload?: (template: Template) => void;
}

export const TemplateCard = ({ template, onView, onDownload }: TemplateCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">{template.name}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {template.file_type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          {template.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{template.category}</span>
        </div>

        {template.variables && template.variables.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Required Fields:
            </p>
            <div className="flex flex-wrap gap-1">
              {template.variables.slice(0, 3).map((variable, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {variable.replace(/_/g, ' ')}
                </Badge>
              ))}
              {template.variables.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.variables.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {onView && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => onView(template)}
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
          )}
          {onDownload && (
            <Button
              size="sm"
              variant="default"
              className="flex-1 text-xs"
              onClick={() => onDownload(template)}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
