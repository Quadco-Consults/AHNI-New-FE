// Task Template Service for AHNI ERP Chat Guidance System
// Handles 100+ task templates with beginner-friendly guidance

import { TaskTemplate, IntentPattern, UserContext } from '../types/chatTypes';
import { createWorkPlanTemplate } from '../data/taskTemplates/workPlanCreation';

class TaskTemplateService {
  private templates: Map<string, TaskTemplate> = new Map();
  private intentPatterns: IntentPattern[] = [];

  constructor() {
    this.loadTemplates();
    this.loadIntentPatterns();
  }

  private loadTemplates() {
    // Load initial template
    this.templates.set('create_work_plan', createWorkPlanTemplate);

    // TODO: Load all 100+ templates
    // This would typically load from a database or API
    // For now, we'll demonstrate with one template
  }

  private loadIntentPatterns() {
    this.intentPatterns = [
      // Work Plan Creation Intent
      {
        intent: 'create_work_plan',
        patterns: [
          'how do i create a work plan',
          'create work plan',
          'new work plan',
          'plan my activities',
          'annual planning',
          'activity planning',
          'plan project activities',
          'how to make work plan',
          'work plan creation',
          'planning activities for the year'
        ],
        entities: ['work_plan', 'activities', 'planning'],
        confidence: 0.9,
        category: 'task_guidance',
        targetModule: 'programs'
      },

      // Site Visit Planning Intent
      {
        intent: 'plan_site_visit',
        patterns: [
          'how do i plan a site visit',
          'create site visit',
          'plan field visit',
          'schedule site visit',
          'field trip planning',
          'supervision visit',
          'monitoring visit'
        ],
        entities: ['site_visit', 'field_visit', 'supervision'],
        confidence: 0.9,
        category: 'task_guidance',
        targetModule: 'programs'
      },

      // Fund Request Intent
      {
        intent: 'request_funds',
        patterns: [
          'how do i request funds',
          'request money',
          'ask for budget',
          'fund request',
          'need money for activity',
          'request funding',
          'how to get funds'
        ],
        entities: ['fund_request', 'budget', 'money'],
        confidence: 0.9,
        category: 'task_guidance',
        targetModule: 'programs'
      },

      // Employee Management Intent
      {
        intent: 'create_employee',
        patterns: [
          'how do i add new employee',
          'create employee',
          'add staff member',
          'onboard new employee',
          'register employee',
          'new hire process'
        ],
        entities: ['employee', 'staff', 'hire'],
        confidence: 0.9,
        category: 'task_guidance',
        targetModule: 'hr'
      },

      // Leave Request Intent
      {
        intent: 'request_leave',
        patterns: [
          'how do i request leave',
          'apply for leave',
          'request time off',
          'vacation request',
          'sick leave',
          'annual leave',
          'how to apply for leave'
        ],
        entities: ['leave', 'vacation', 'time_off'],
        confidence: 0.9,
        category: 'task_guidance',
        targetModule: 'hr'
      },

      // Purchase Request Intent
      {
        intent: 'create_purchase_request',
        patterns: [
          'how do i request purchase',
          'buy something',
          'purchase request',
          'procurement request',
          'order supplies',
          'request to buy'
        ],
        entities: ['purchase', 'procurement', 'buy'],
        confidence: 0.9,
        category: 'task_guidance',
        targetModule: 'procurement'
      },

      // Navigation Intent
      {
        intent: 'navigation_help',
        patterns: [
          'where do i find',
          'how do i get to',
          'where is the',
          'show me the page for',
          'navigate to',
          'find the menu for'
        ],
        entities: ['navigation', 'menu', 'page'],
        confidence: 0.8,
        category: 'basic_system'
      },

      // General Help Intent
      {
        intent: 'general_help',
        patterns: [
          'help me',
          'i need help',
          'how do i',
          'can you help',
          'i don\'t know how',
          'what should i do'
        ],
        entities: ['help', 'assistance'],
        confidence: 0.7,
        category: 'basic_system'
      }
    ];
  }

  // Match user query to intent and return appropriate template
  async getTaskGuidance(
    userQuery: string,
    userContext: UserContext
  ): Promise<{
    intent: string;
    confidence: number;
    template?: TaskTemplate;
    suggestions?: string[];
    needsMoreInfo?: boolean;
  }> {
    const normalizedQuery = userQuery.toLowerCase();

    // Find best matching intent
    let bestMatch = {
      intent: '',
      confidence: 0,
      pattern: ''
    };

    for (const intentPattern of this.intentPatterns) {
      for (const pattern of intentPattern.patterns) {
        const confidence = this.calculatePatternMatch(normalizedQuery, pattern);
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            intent: intentPattern.intent,
            confidence: confidence * intentPattern.confidence,
            pattern
          };
        }
      }
    }

    // If we have a good match and template exists
    if (bestMatch.confidence > 0.6) {
      const template = this.templates.get(bestMatch.intent);

      if (template) {
        // Check if user has required permissions
        const hasPermissions = this.checkUserPermissions(template, userContext);

        if (!hasPermissions) {
          return {
            intent: 'permission_denied',
            confidence: 1.0,
            suggestions: [
              'Contact your supervisor for access permissions',
              'Ask IT Admin to grant required permissions',
              'Check if you\'re in the right department for this task'
            ]
          };
        }

        // Customize template for user experience level
        const customizedTemplate = this.customizeTemplateForUser(template, userContext);

        return {
          intent: bestMatch.intent,
          confidence: bestMatch.confidence,
          template: customizedTemplate
        };
      }
    }

    // If no specific template match, provide suggestions
    return {
      intent: 'clarification_needed',
      confidence: bestMatch.confidence,
      suggestions: this.getSuggestions(normalizedQuery, userContext),
      needsMoreInfo: true
    };
  }

  private calculatePatternMatch(query: string, pattern: string): number {
    const queryWords = query.split(' ');
    const patternWords = pattern.split(' ');

    let matches = 0;
    for (const patternWord of patternWords) {
      for (const queryWord of queryWords) {
        if (queryWord.includes(patternWord) || patternWord.includes(queryWord)) {
          matches++;
          break;
        }
      }
    }

    return matches / patternWords.length;
  }

  private checkUserPermissions(template: TaskTemplate, userContext: UserContext): boolean {
    // Check if user role is allowed
    if (template.userRoles.length > 0 && !template.userRoles.includes(userContext.role)) {
      return false;
    }

    // Check if user has required permissions
    if (template.permissions.length > 0) {
      return template.permissions.some(permission =>
        userContext.permissions.includes(permission)
      );
    }

    return true;
  }

  private customizeTemplateForUser(template: TaskTemplate, userContext: UserContext): TaskTemplate {
    const customized = { ...template };

    // For new users, show all details
    if (userContext.experienceLevel === 'new') {
      // Keep all steps, tips, and warnings
      return customized;
    }

    // For experienced users, can skip some basic explanations
    if (userContext.experienceLevel === 'experienced') {
      // Remove basic navigation steps
      customized.steps = customized.steps.filter(step =>
        !step.description.includes('Navigate to') || step.stepNumber === 1
      );

      // Focus on advanced tips
      customized.proTips = customized.proTips.filter(tip =>
        tip.includes('advanced') || tip.includes('tip') || tip.includes('buffer')
      );
    }

    return customized;
  }

  private getSuggestions(query: string, userContext: UserContext): string[] {
    const suggestions: string[] = [];

    // Module-based suggestions
    if (query.includes('work') || query.includes('plan')) {
      suggestions.push('How do I create a work plan?');
      suggestions.push('How do I edit my work plan?');
      suggestions.push('How do I track work plan progress?');
    }

    if (query.includes('visit') || query.includes('field')) {
      suggestions.push('How do I plan a site visit?');
      suggestions.push('How do I complete a site visit?');
    }

    if (query.includes('fund') || query.includes('money') || query.includes('budget')) {
      suggestions.push('How do I request funds?');
      suggestions.push('How do I track my fund request?');
    }

    if (query.includes('employee') || query.includes('staff') || query.includes('hire')) {
      suggestions.push('How do I add a new employee?');
      suggestions.push('How do I onboard a new employee?');
    }

    if (query.includes('leave') || query.includes('vacation')) {
      suggestions.push('How do I request leave?');
      suggestions.push('How do I check my leave balance?');
    }

    // Role-based suggestions
    if (userContext.role === 'Program Officer') {
      suggestions.push('How do I create a work plan?');
      suggestions.push('How do I plan a site visit?');
      suggestions.push('How do I request funds?');
    }

    if (userContext.role === 'HR Officer') {
      suggestions.push('How do I add a new employee?');
      suggestions.push('How do I process leave requests?');
      suggestions.push('How do I conduct performance reviews?');
    }

    // If no specific suggestions, provide general help
    if (suggestions.length === 0) {
      suggestions.push('What can I do in this system?');
      suggestions.push('Show me common tasks for my role');
      suggestions.push('Help me find what I\'m looking for');
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  // Get all templates for a specific module
  getTemplatesByModule(module: string): TaskTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => template.module === module);
  }

  // Get templates user can access
  getTemplatesForUser(userContext: UserContext): TaskTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => this.checkUserPermissions(template, userContext));
  }

  // Search templates by keywords
  searchTemplates(query: string, userContext: UserContext): TaskTemplate[] {
    const normalizedQuery = query.toLowerCase();

    return Array.from(this.templates.values())
      .filter(template => {
        // Check permissions first
        if (!this.checkUserPermissions(template, userContext)) {
          return false;
        }

        // Check if query matches template content
        const searchableText = [
          template.name,
          template.description,
          template.category,
          ...template.steps.map(step => step.title + ' ' + step.description)
        ].join(' ').toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
      .sort((a, b) => {
        // Sort by relevance (simple scoring)
        const scoreA = this.calculateRelevanceScore(a, normalizedQuery);
        const scoreB = this.calculateRelevanceScore(b, normalizedQuery);
        return scoreB - scoreA;
      });
  }

  private calculateRelevanceScore(template: TaskTemplate, query: string): number {
    let score = 0;

    // Higher score for matches in name and description
    if (template.name.toLowerCase().includes(query)) score += 10;
    if (template.description.toLowerCase().includes(query)) score += 5;
    if (template.category.toLowerCase().includes(query)) score += 3;

    // Score for step matches
    template.steps.forEach(step => {
      if (step.title.toLowerCase().includes(query)) score += 2;
      if (step.description.toLowerCase().includes(query)) score += 1;
    });

    return score;
  }
}

export const taskTemplateService = new TaskTemplateService();