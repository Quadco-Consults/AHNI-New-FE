// Sample task template: Create Work Plan
// Following the beginner-friendly structure from your design

import { TaskTemplate } from '../../types/chatTypes';

export const createWorkPlanTemplate: TaskTemplate = {
  key: 'create_work_plan',
  name: 'How to Create a Work Plan',
  category: 'Work Plan Management',
  module: 'programs',
  description: 'Step-by-step guide to create an annual work plan for your project activities and budget planning',

  quickAnswer: 'A work plan shows all activities you\'ll do for a project during a specific time period. Go to Programs > Plans > Work Plans > Create New.',

  timeRequired: '15-20 minutes',

  prerequisites: [
    'Access to Programs module (ask IT Admin if you can\'t see it)',
    'A project already created in the system',
    'List of activities you want to plan',
    'Estimated costs for each activity'
  ],

  steps: [
    {
      stepNumber: 1,
      title: 'Navigate to Work Plans',
      description: 'First, we need to get to the right place in the system',
      action: 'Log into AHNI ERP → Click "Programs" → Click "Plans" → Click "Work Plans"',
      successIndicator: 'You\'ll see a list of existing work plans with a "Create New" button'
    },
    {
      stepNumber: 2,
      title: 'Create New Work Plan',
      description: 'Start creating your new work plan',
      action: 'Click the "+ Create New" button (usually blue button at top right)',
      successIndicator: 'The "Create Work Plan" form will open'
    },
    {
      stepNumber: 3,
      title: 'Fill Basic Information',
      description: 'Enter the essential information about your work plan',
      action: 'Complete the required fields in the form',
      fieldExplanations: [
        {
          fieldName: 'Project/Grant',
          description: 'Select the project this work plan is for',
          example: 'Community Health Project - Lagos',
          required: true,
          validationRules: ['Must be an active project']
        },
        {
          fieldName: 'Financial Year',
          description: 'The year you\'re planning activities for',
          example: '2024',
          required: true,
          validationRules: ['Must be current or future year']
        },
        {
          fieldName: 'Description',
          description: 'Brief explanation of this work plan (optional)',
          example: 'Annual work plan for Community Health Project covering all field activities',
          required: false
        }
      ]
    },
    {
      stepNumber: 4,
      title: 'Add Activities',
      description: 'Add all the activities you plan to do during the year',
      action: 'Click "Add Activity" and fill details for each activity',
      fieldExplanations: [
        {
          fieldName: 'Activity Title',
          description: 'Specific name for your activity',
          example: 'Training 50 community health workers on malaria prevention',
          required: true,
          validationRules: ['Must be descriptive and specific']
        },
        {
          fieldName: 'Start Date & End Date',
          description: 'When this activity will begin and end',
          example: 'Start: January 15, 2024 | End: January 17, 2024',
          required: true,
          validationRules: ['Must be within the financial year', 'End date must be after start date']
        },
        {
          fieldName: 'Cost Category',
          description: 'Type of expense for this activity',
          example: 'Training, Travel, Personnel, Equipment, Supplies',
          required: true,
          validationRules: ['Must select from predefined categories']
        },
        {
          fieldName: 'Estimated Cost',
          description: 'Total cost including all expenses',
          example: '$2,500 (includes venue, materials, transport, meals)',
          required: true,
          validationRules: ['Must be realistic', 'Include ALL associated costs']
        }
      ],
      warningNote: 'Make sure to include ALL costs: transport, meals, materials, venue, per diems, etc.'
    },
    {
      stepNumber: 5,
      title: 'Review & Submit',
      description: 'Check everything is correct before submitting',
      action: 'Review all activities → Save as draft → Submit for approval',
      successIndicator: 'Work plan status changes from "Draft" to "Submitted"'
    }
  ],

  proTips: [
    'Always add 10-15% buffer to your cost estimates for unexpected expenses',
    'Plan activities in logical sequence - some might depend on others',
    'Check with Finance team about current exchange rates if using multiple currencies',
    'Save as draft frequently to avoid losing your work',
    'Coordinate with other team members to avoid scheduling conflicts'
  ],

  commonMistakes: [
    'Forgetting to include all costs (transport, meals, materials, accommodation)',
    'Scheduling activities outside the financial year period',
    'Using vague activity descriptions that reviewers can\'t understand',
    'Not checking if total cost exceeds available project budget',
    'Planning activities without considering local holidays or weather seasons'
  ],

  nextSteps: [
    'Work plan goes to your supervisor for review (typically 2-3 business days)',
    'If approved: You can start implementing activities and requesting funds',
    'If rejected: You\'ll receive feedback to revise and resubmit',
    'Use "Work Plan Tracker" monthly to update progress',
    'Record actual expenses in "Project Expenditures" as activities happen'
  ],

  helpContacts: [
    {
      role: 'Programs Manager',
      department: 'Programs',
      forIssues: ['Project not in dropdown', 'Activity planning questions', 'Budget allocation issues'],
      contactMethod: 'email'
    },
    {
      role: 'Finance Officer',
      department: 'Finance',
      forIssues: ['Cost estimation questions', 'Budget limits', 'Exchange rates'],
      contactMethod: 'chat'
    },
    {
      role: 'IT Admin',
      department: 'IT',
      forIssues: ['Can\'t access Programs menu', 'System errors', 'Permission issues'],
      contactMethod: 'phone'
    }
  ],

  difficulty: 'beginner',
  userRoles: ['Program Officer', 'Project Manager', 'Field Coordinator'],
  permissions: ['programs.create', 'programs.view'],
  relatedTasks: ['edit_work_plan', 'track_work_plan_progress', 'create_fund_request']
};