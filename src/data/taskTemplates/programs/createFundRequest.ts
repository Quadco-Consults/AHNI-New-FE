// Fund Request Template - Critical NGO Financial Process
import { TaskTemplate } from '../../../types/chatTypes';

export const createFundRequestTemplate: TaskTemplate = {
  key: 'create_fund_request',
  name: 'Request Funds',
  category: 'Fund Request Management',
  module: 'programs',
  description: 'Request money for project activities with multi-level approval process and proper justification',

  quickAnswer: 'Request funds for your project activities. Go to Programs > Fund Requests > Create New. Choose MAIN for planned activities, SUPPLEMENTARY for urgent needs.',

  timeRequired: '10-15 minutes',

  prerequisites: [
    'Approved work plan or documented urgent need',
    'Project with available budget allocation',
    'Detailed activity plans and cost estimates',
    'Supporting documentation ready'
  ],

  steps: [
    {
      stepNumber: 1,
      title: 'Navigate to Fund Requests',
      description: 'Access the fund request system',
      action: 'From main menu: Programs → Fund Requests → View All',
      successIndicator: 'You see your previous fund requests and their approval status'
    },
    {
      stepNumber: 2,
      title: 'Create New Fund Request',
      description: 'Start a new funding request',
      action: 'Click "Create New Fund Request" button',
      successIndicator: 'Fund request form opens with project selection dropdown'
    },
    {
      stepNumber: 3,
      title: 'Select Project and Period',
      description: 'Choose which project and time period the funds are for',
      action: 'Fill in the project and timing information',
      fieldExplanations: [
        {
          fieldName: 'Project',
          description: 'Which project budget will pay for these activities',
          example: 'Community Health Project - Phase 2',
          required: true,
          validationRules: ['Only projects with available budget will appear', 'Must have access to project']
        },
        {
          fieldName: 'Financial Year',
          description: 'Budget year for the request',
          example: '2024 (current financial year)',
          required: true,
          validationRules: ['Must match project financial year']
        },
        {
          fieldName: 'Financial Month',
          description: 'Month when you need the funds',
          example: 'March 2024 (when activities will happen)',
          required: true,
          validationRules: ['Cannot be in the past', 'Must be within financial year']
        }
      ],
      warningNote: 'Only projects with available budget will appear in the dropdown'
    },
    {
      stepNumber: 4,
      title: 'Choose Request Type',
      description: 'Select MAIN or SUPPLEMENTARY based on your need',
      action: 'Select the appropriate request type',
      fieldExplanations: [
        {
          fieldName: 'MAIN Request',
          description: 'For planned activities in your approved work plan',
          example: 'Quarterly training sessions, scheduled site visits, routine program activities',
          required: false,
          validationRules: ['Must reference approved work plan activities']
        },
        {
          fieldName: 'SUPPLEMENTARY Request',
          description: 'For urgent or unplanned activities not in work plan',
          example: 'Emergency response, urgent equipment replacement, unexpected travel',
          required: false,
          validationRules: ['Requires stronger justification', 'Must explain why not planned']
        }
      ],
      warningNote: 'SUPPLEMENTARY requests need stronger justification and may take longer to approve'
    },
    {
      stepNumber: 5,
      title: 'Enter Amount and Currency',
      description: 'Specify exactly how much money you need',
      action: 'Enter the total amount and select currency',
      fieldExplanations: [
        {
          fieldName: 'Amount',
          description: 'Total funds needed for all activities',
          example: '$5,000 (include all anticipated costs with small buffer)',
          required: true,
          validationRules: ['Must not exceed available project budget', 'Be realistic and accurate']
        },
        {
          fieldName: 'Currency',
          description: 'USD for international costs, NGN for local costs',
          example: 'USD for international travel and equipment, NGN for local supplies and transport',
          required: true,
          validationRules: ['Match the currency of your cost estimates']
        }
      ],
      successIndicator: 'Amount shows as available in project budget summary'
    },
    {
      stepNumber: 6,
      title: 'Add Detailed Activities',
      description: 'List exactly what the money will be used for',
      action: 'Click "Add Activity" and describe each planned use of funds',
      fieldExplanations: [
        {
          fieldName: 'Activity Description',
          description: 'Specific, detailed description of each activity',
          example: 'Training 30 Community Health Workers on malaria prevention and treatment ($2,000)',
          required: true,
          validationRules: ['Be specific, not generic', 'Include quantity and purpose']
        },
        {
          fieldName: 'Activity Cost',
          description: 'Estimated cost for this specific activity',
          example: '$2,000 (breakdown: venue $300, materials $200, transport $500, meals $1,000)',
          required: true,
          validationRules: ['Must add up to total amount requested']
        },
        {
          fieldName: 'Activity Timeline',
          description: 'When this activity will happen',
          example: 'March 15-17, 2024 (3-day training workshop)',
          required: true,
          validationRules: ['Must be within the financial month selected']
        }
      ],
      warningNote: 'Be specific: "Training 30 CHWs on malaria ($2,000)" not just "Training"'
    },
    {
      stepNumber: 7,
      title: 'Provide Strong Justification',
      description: 'Explain clearly why these funds are needed now',
      action: 'Write a compelling justification for the request',
      fieldExplanations: [
        {
          fieldName: 'Business Justification',
          description: 'Why this spending is necessary for project success',
          example: 'Training is critical to achieve Q1 target of 500 patients treated. Without this training, CHWs cannot provide quality malaria care, risking project outcomes and beneficiary health.',
          required: true,
          validationRules: ['Connect to project objectives', 'Explain urgency if applicable', 'Show expected impact']
        },
        {
          fieldName: 'Expected Outcomes',
          description: 'What will be achieved with these funds',
          example: '30 trained CHWs will serve 15 communities, enabling treatment of 500+ malaria cases in Q1',
          required: true,
          validationRules: ['Be specific and measurable']
        }
      ],
      successIndicator: 'Justification clearly explains need, urgency, and expected results'
    },
    {
      stepNumber: 8,
      title: 'Submit for Approval',
      description: 'Send request through the multi-level approval chain',
      action: 'Review all details carefully, then click "Submit for Approval"',
      successIndicator: 'Status changes from "Draft" to "Pending" and approval workflow begins'
    }
  ],

  proTips: [
    'Submit requests early - approval process takes 5-10 business days',
    'Include 5-10% buffer in cost estimates for unexpected expenses',
    'Reference your approved work plan activities to speed approval',
    'Save as draft first to review with supervisor before submitting',
    'Keep copies of supporting documents ready for reviewers',
    'Follow up politely if approval takes longer than expected'
  ],

  commonMistakes: [
    'Requesting more than available project budget - automatic rejection',
    'Weak justification that doesn\'t explain need - causes delays',
    'Generic activity descriptions - reviewers can\'t assess value',
    'Forgetting to include all costs - budget shortfalls later',
    'Not checking work plan first - may duplicate existing requests',
    'Submitting too close to activity dates - insufficient approval time'
  ],

  nextSteps: [
    'Request enters approval workflow: PENDING → LOCATION_REVIEWED → LOCATION_AUTHORIZED → HQ_REVIEWED → HQ_AUTHORIZED → HQ_APPROVED',
    'Location Reviewer checks technical details (1-2 days)',
    'Location Authorizer approves local priorities (1-2 days)',
    'HQ Reviewer reviews budget alignment (2-3 days)',
    'HQ Authorizer gives final financial approval (1-2 days)',
    'HQ Approver releases funds (1 day)',
    'Once approved, you can start implementing activities',
    'Submit expense reports after activities are completed'
  ],

  helpContacts: [
    {
      role: 'Programs Manager',
      department: 'Programs',
      forIssues: ['Activity planning questions', 'Approval process delays', 'Work plan alignment'],
      contactMethod: 'email'
    },
    {
      role: 'Finance Officer',
      department: 'Finance',
      forIssues: ['Budget availability', 'Cost estimation help', 'Approval status'],
      contactMethod: 'chat'
    },
    {
      role: 'Location Reviewer',
      department: 'Programs',
      forIssues: ['Technical review questions', 'Local context issues', 'Activity feasibility'],
      contactMethod: 'email'
    }
  ],

  difficulty: 'beginner',
  userRoles: ['Program Officer', 'Project Manager', 'Field Coordinator', 'M&E Specialist'],
  permissions: ['programs.add_fundrequest'],
  relatedTasks: ['track_fund_request_status', 'create_work_plan', 'resubmit_rejected_fund_request', 'create_expense_report']
};