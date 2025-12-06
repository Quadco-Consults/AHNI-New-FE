// Enhanced type definitions for comprehensive AHNI ERP chat guidance system

export interface TaskTemplate {
  key: string;
  name: string;
  category: string;
  module: 'programs' | 'projects' | 'hr' | 'procurement' | 'finance' | 'grants' | 'system';
  description: string;

  // Template structure
  quickAnswer: string;
  timeRequired: string;
  prerequisites: string[];
  steps: TaskStep[];
  proTips: string[];
  commonMistakes: string[];
  nextSteps: string[];
  helpContacts: HelpContact[];

  // Metadata
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  userRoles: string[];
  permissions: string[];
  relatedTasks: string[];
}

export interface TaskStep {
  stepNumber: number;
  title: string;
  description: string;
  action: string;
  screenshot?: string;
  fieldExplanations?: FieldExplanation[];
  warningNote?: string;
  successIndicator?: string;
}

export interface FieldExplanation {
  fieldName: string;
  description: string;
  example?: string;
  required: boolean;
  validationRules?: string[];
}

export interface HelpContact {
  role: string;
  department: string;
  forIssues: string[];
  contactMethod: 'chat' | 'email' | 'phone' | 'in-person';
}

export interface ProcessFlowResponse {
  type: 'process_flow';
  process: ProcessFlow;
  currentStep?: number;
  userRole: string;
  permissions: string[];
}

export interface TaskGuidanceResponse {
  type: 'task_guide';
  template: TaskTemplate;
  userContext: {
    role: string;
    department: string;
    permissions: string[];
    experience: 'new' | 'experienced';
  };
  customization?: {
    skipBasics?: boolean;
    highlightSections?: string[];
    additionalHelp?: string[];
  };
}

export interface NavigationResponse {
  type: 'navigation';
  target: string;
  breadcrumb: string[];
  actions: string[];
  permissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canApprove: boolean;
  };
}

export interface SmartSuggestionsResponse {
  type: 'suggestions';
  suggestions: SmartSuggestion[];
  context: string;
  confidenceScore: number;
}

export interface SmartSuggestion {
  action: string;
  label: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  estimatedTime?: string;
  prerequisites?: string[];
}

// Enhanced chat message types
export interface EnhancedChatMessage extends ChatMessage {
  responseType: 'text' | 'task_guide' | 'navigation' | 'process_flow' | 'suggestions' | 'template_list';
  structuredData?: {
    type: string;
    template?: TaskTemplate;
    templates?: TaskTemplate[];
    process?: ProcessFlow;
    suggestions?: SmartSuggestion[];
    navigation?: NavigationResponse;
    userContext?: any;
    [key: string]: any;
  };

  // User experience enhancements
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime?: string;
  followUpSuggestions?: string[];
  relatedHelp?: string[];
}

// NLP Intent system
export interface IntentPattern {
  intent: string;
  patterns: string[];
  entities: string[];
  confidence: number;
  category: 'basic_system' | 'task_guidance' | 'status_tracking' | 'error_resolution' | 'learning';
  requiredPermissions?: string[];
  targetModule?: string;
}

// User context for personalized responses
export interface UserContext {
  userId: string;
  role: string;
  department: string;
  permissions: string[];
  experienceLevel: 'new' | 'intermediate' | 'experienced';
  preferredLanguage?: string;
  lastActivity?: Date;
  completedTasks?: string[];
  onboardingProgress?: number;
}

// Chat session analytics
export interface ChatSession {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  messageCount: number;
  tasksDiscussed: string[];
  helpTopics: string[];
  userSatisfaction?: number;
  resolvedQueries: number;
  escalatedQueries: number;
}