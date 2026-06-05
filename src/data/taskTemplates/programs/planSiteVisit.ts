// Site Visit Planning Template - High Priority NGO Function
import { TaskTemplate } from '../../../types/chatTypes';

export const planSiteVisitTemplate: TaskTemplate = {
  key: 'create_site_visit',
  name: 'Plan Site Visit',
  category: 'Site Visit Management',
  module: 'programs',
  description: 'Plan and budget for a field visit or supervision activity with complete cost estimation',

  quickAnswer: 'A travel request helps you supervise, train, or monitor field activities. Go to Programs > Site Visits > Create New to plan your visit.',

  timeRequired: '20-25 minutes',

  prerequisites: [
    'Access to Programs module',
    'Project/location to visit exists in system',
    'Clear purpose for the visit',
    'Estimated travel and accommodation costs',
    'Team members identified for the visit'
  ],

  steps: [
    {
      stepNumber: 1,
      title: 'Navigate to Site Visits',
      description: 'Access the travel request planning section',
      action: 'From main menu: Programs → Site Visits → View All',
      successIndicator: 'You see a list of planned and completed visits with "Create New" button'
    },
    {
      stepNumber: 2,
      title: 'Create New Site Visit',
      description: 'Start planning your new field visit',
      action: 'Click "Create New" or "+" button (usually blue)',
      successIndicator: 'Travel request creation form opens with empty fields'
    },
    {
      stepNumber: 3,
      title: 'Fill Basic Visit Information',
      description: 'Provide essential details about your planned visit',
      action: 'Complete all required fields in the basic information section',
      fieldExplanations: [
        {
          fieldName: 'Title',
          description: 'Descriptive name for your visit',
          example: 'Q1 Supervision Visit to Kano Office',
          required: true,
          validationRules: ['Must be specific and clear']
        },
        {
          fieldName: 'Visit Type',
          description: 'Purpose category for the visit',
          example: 'Supportive Supervision, M&E, Training, Emergency, Stakeholder Engagement',
          required: true,
          validationRules: ['Must select from predefined options']
        },
        {
          fieldName: 'Purpose',
          description: 'Detailed explanation of why this visit is needed',
          example: 'Monthly supervision to review program implementation and provide technical support to field staff',
          required: true,
          validationRules: ['Must be clear and specific']
        },
        {
          fieldName: 'Location',
          description: 'Field office or project site to visit',
          example: 'Kano Field Office, Lagos Project Site',
          required: true,
          validationRules: ['Must select from existing locations']
        },
        {
          fieldName: 'Start Date',
          description: 'First day of visit (include travel time)',
          example: 'If visiting Monday, but traveling Sunday night, start date should be Sunday',
          required: true,
          validationRules: ['Cannot be in the past', 'Must be a working day']
        },
        {
          fieldName: 'End Date',
          description: 'Last day of visit (include return travel)',
          example: 'If visit ends Wednesday but returning Thursday morning, end date should be Thursday',
          required: true,
          validationRules: ['Must be after start date', 'Include return travel time']
        }
      ],
      warningNote: 'Include travel time in your start/end dates for accurate cost calculation'
    },
    {
      stepNumber: 4,
      title: 'Add Team Members',
      description: 'Select all staff who will participate in the visit',
      action: 'Click "Add Team Member" and select participants',
      fieldExplanations: [
        {
          fieldName: 'Team Lead',
          description: 'Senior staff member responsible for the visit',
          example: 'Usually the supervisor or department head',
          required: true,
          validationRules: ['Must be senior staff member']
        },
        {
          fieldName: 'Participants',
          description: 'All staff who will travel or participate locally',
          example: 'Program Officers, M&E Specialists, Technical Advisors',
          required: true,
          validationRules: ['At least one participant required']
        }
      ],
      warningNote: 'Include ALL travelers for accurate cost calculation - missing team members will affect budget'
    },
    {
      stepNumber: 5,
      title: 'Estimate Visit Costs',
      description: 'Calculate comprehensive budget for the entire visit',
      action: 'Review auto-calculated costs and adjust if necessary',
      fieldExplanations: [
        {
          fieldName: 'Transport',
          description: 'All transportation costs',
          example: 'Flights ($300), fuel for vehicle ($150), local transport ($50)',
          required: true,
          validationRules: ['Must include all transportation needs']
        },
        {
          fieldName: 'Accommodation',
          description: 'Hotel or guesthouse costs',
          example: 'Hotel: $80/night × 3 nights × 2 people = $480',
          required: false,
          validationRules: ['Use standard accommodation rates']
        },
        {
          fieldName: 'Meals',
          description: 'Per diem allowances for meals',
          example: 'Per diem: $40/day × 4 days × 2 people = $320',
          required: true,
          validationRules: ['Use current per diem rates from Finance']
        },
        {
          fieldName: 'Activities',
          description: 'Meeting costs and materials',
          example: 'Meeting venue ($100), training materials ($50)',
          required: false,
          validationRules: ['Include all activity-related costs']
        }
      ],
      successIndicator: 'Total cost appears reasonable and fits within project budget'
    },
    {
      stepNumber: 6,
      title: 'Submit for Approval',
      description: 'Send visit plan through the approval workflow',
      action: 'Review all information carefully, then click "Submit for Approval"',
      successIndicator: 'Status changes from "Draft" to "Submitted" and approval workflow begins'
    }
  ],

  proTips: [
    'Plan visits at least 2 weeks in advance to allow for approval process',
    'Check with Finance for current travel rates before estimating costs',
    'Coordinate with field office to ensure they\'re available for your visit dates',
    'Include buffer time for travel delays in your schedule',
    'Book accommodation early, especially during peak seasons',
    'Prepare visit agenda in advance and share with local team'
  ],

  commonMistakes: [
    'Not including return travel time in end date - affects cost calculation',
    'Forgetting to add all team members - budget will be insufficient',
    'Using outdated travel rates - leads to budget shortfalls',
    'Scheduling during local holidays or events - visit may be ineffective',
    'Not coordinating with field office - staff may not be available',
    'Insufficient justification - delays approval process'
  ],

  nextSteps: [
    'Visit goes through approval chain: SUBMITTED → REVIEWED → AUTHORIZED → APPROVED',
    'Once approved, system generates Expenditure Authorization (EA)',
    'Finance releases funds for advance payments if needed',
    'You can start booking transport and accommodation',
    'After visit, complete travel request report within 48 hours',
    'Submit actual expenses for reimbursement'
  ],

  helpContacts: [
    {
      role: 'Programs Manager',
      department: 'Programs',
      forIssues: ['Visit planning questions', 'Approval delays', 'Location access'],
      contactMethod: 'email'
    },
    {
      role: 'Finance Officer',
      department: 'Finance',
      forIssues: ['Travel rates', 'Cost estimation', 'Budget availability'],
      contactMethod: 'chat'
    },
    {
      role: 'Field Office Coordinator',
      department: 'Programs',
      forIssues: ['Local logistics', 'Accommodation booking', 'Schedule coordination'],
      contactMethod: 'phone'
    }
  ],

  difficulty: 'intermediate',
  userRoles: ['Program Officer', 'Program Manager', 'M&E Specialist', 'Technical Advisor'],
  permissions: ['programs.add_sitevisit'],
  relatedTasks: ['execute_site_visit', 'complete_site_visit_report', 'create_fund_request', 'track_visit_approval']
};