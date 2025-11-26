// Submit Leave Request Template - Essential HR Self-Service
import { TaskTemplate } from '../../../types/chatTypes';

export const submitLeaveRequestTemplate: TaskTemplate = {
  key: 'submit_leave_request',
  name: 'Request Leave/Time Off',
  category: 'Leave Management',
  module: 'hr',
  description: 'Submit a formal request for vacation, sick leave, or other time off with proper approval workflow',

  quickAnswer: 'Request time off through HR > My Leave > New Request. Choose leave type, select dates, and get manager approval before taking leave.',

  timeRequired: '5-10 minutes',

  prerequisites: [
    'Employee account with leave entitlements',
    'Manager assigned in HR system',
    'Leave dates planned and confirmed',
    'Coverage arrangements discussed with team',
    'Leave policy guidelines understood'
  ],

  steps: [
    {
      stepNumber: 1,
      title: 'Navigate to Leave Management',
      description: 'Access your personal leave request system',
      action: 'From main menu: HR → My Leave → View My Leave',
      successIndicator: 'You see your leave history and available balance with "New Request" button'
    },
    {
      stepNumber: 2,
      title: 'Create New Leave Request',
      description: 'Start a new leave application',
      action: 'Click "New Request" or "+" button to start leave application',
      successIndicator: 'Leave request form opens with leave type selection'
    },
    {
      stepNumber: 3,
      title: 'Select Leave Type and Dates',
      description: 'Choose the appropriate type of leave and specify dates',
      action: 'Fill in the basic leave information',
      fieldExplanations: [
        {
          fieldName: 'Leave Type',
          description: 'Category of leave you are requesting',
          example: 'Annual Leave (vacation), Sick Leave, Personal Leave, Emergency Leave',
          required: true,
          validationRules: ['Must match your available entitlements', 'Different types have different approval rules']
        },
        {
          fieldName: 'Start Date',
          description: 'First day you will be away from work',
          example: 'March 15, 2024 (first day of absence)',
          required: true,
          validationRules: ['Cannot be in the past', 'Must be a working day', 'Should allow sufficient notice']
        },
        {
          fieldName: 'End Date',
          description: 'Last day of your leave period',
          example: 'March 20, 2024 (last day of absence, you return March 21)',
          required: true,
          validationRules: ['Must be after start date', 'Calculate working days carefully']
        },
        {
          fieldName: 'Duration',
          description: 'Total working days requested',
          example: '5 days (excludes weekends and holidays)',
          required: true,
          validationRules: ['System auto-calculates based on dates', 'Verify calculation is correct']
        },
        {
          fieldName: 'Half Day Option',
          description: 'If requesting partial days',
          example: 'Morning only (9 AM - 1 PM) or Afternoon only (1 PM - 5 PM)',
          required: false,
          validationRules: ['Only for single-day requests or start/end days']
        }
      ],
      warningNote: 'Check your leave balance before submitting - insufficient balance will cause rejection'
    },
    {
      stepNumber: 4,
      title: 'Provide Leave Justification',
      description: 'Explain the reason for your leave request',
      action: 'Write a clear explanation for your leave',
      fieldExplanations: [
        {
          fieldName: 'Reason for Leave',
          description: 'Brief explanation of why you need the time off',
          example: 'Family vacation to celebrate anniversary (Annual Leave) or Medical appointment and recovery (Sick Leave)',
          required: true,
          validationRules: ['Be honest and appropriate', 'Sick leave may require medical documentation']
        },
        {
          fieldName: 'Emergency Contact',
          description: 'How to reach you during leave if absolutely necessary',
          example: 'Mobile phone number for emergencies only',
          required: false,
          validationRules: ['Only for true emergencies', 'You have right to disconnect']
        }
      ],
      successIndicator: 'Leave details and justification clearly documented'
    },
    {
      stepNumber: 5,
      title: 'Arrange Work Coverage',
      description: 'Plan how your responsibilities will be handled during absence',
      action: 'Document coverage arrangements and handover plans',
      fieldExplanations: [
        {
          fieldName: 'Coverage Arrangements',
          description: 'Who will handle your urgent tasks while away',
          example: 'John Smith will cover client meetings, Sarah will handle urgent emails, non-urgent items will wait until return',
          required: true,
          validationRules: ['Must be realistic and fair to colleagues', 'Confirm arrangements with covering staff']
        },
        {
          fieldName: 'Handover Notes',
          description: 'Key information for covering colleagues',
          example: 'Project ABC deadline on March 18 - files in shared folder, client contact details attached',
          required: true,
          validationRules: ['Include all critical information', 'Make notes clear and accessible']
        },
        {
          fieldName: 'Urgent Contact Protocol',
          description: 'When and how you can be contacted during leave',
          example: 'True emergencies only via mobile, expect 4-hour response time',
          required: false,
          validationRules: ['Set clear boundaries', 'Protect your leave time']
        }
      ],
      warningNote: 'Discuss coverage arrangements with colleagues before submitting request'
    },
    {
      stepNumber: 6,
      title: 'Submit for Manager Approval',
      description: 'Send request through the approval workflow',
      action: 'Review all details carefully, then submit for approval',
      successIndicator: 'Status changes to "Pending Approval" and manager receives notification'
    }
  ],

  proTips: [
    'Submit requests at least 2 weeks in advance for annual leave',
    'Check company calendar for busy periods before requesting dates',
    'Confirm coverage arrangements with colleagues before submitting',
    'Keep copies of approved leave requests for your records',
    'For sick leave, submit as soon as possible and follow up with documentation',
    'Annual leave expires - use it before year-end to avoid losing days'
  ],

  commonMistakes: [
    'Submitting requests too close to leave dates - may be rejected due to timing',
    'Not checking leave balance first - insufficient balance causes automatic rejection',
    'Forgetting to arrange coverage - leaves team in difficult position',
    'Requesting leave during blackout periods without checking company calendar',
    'Not following up on pending requests - may expire if not approved timely',
    'Taking leave before approval - policy violation can result in disciplinary action'
  ],

  nextSteps: [
    'Request enters approval workflow: PENDING → MANAGER_REVIEW → APPROVED/REJECTED',
    'Manager receives notification and has 3-5 business days to respond',
    'If approved, leave is added to team calendar and HR records',
    'If rejected, you receive explanation and can discuss with manager',
    'Once approved, you can plan final handover details',
    'Day before leave, send reminder to team about coverage arrangements',
    'After return, complete any required documentation (especially sick leave)'
  ],

  helpContacts: [
    {
      role: 'HR Officer',
      department: 'HR',
      forIssues: ['Leave policy questions', 'Balance calculations', 'System technical problems'],
      contactMethod: 'email'
    },
    {
      role: 'Direct Manager',
      department: 'Various',
      forIssues: ['Approval delays', 'Coverage planning', 'Leave timing discussions'],
      contactMethod: 'email'
    },
    {
      role: 'IT Support',
      department: 'IT',
      forIssues: ['System access problems', 'Form submission errors', 'Login difficulties'],
      contactMethod: 'chat'
    }
  ],

  difficulty: 'beginner',
  userRoles: ['All Staff', 'Employee', 'Contractor'],
  permissions: ['hr.submit_leave_request', 'hr.view_own_leave'],
  relatedTasks: ['view_leave_balance', 'cancel_leave_request', 'update_leave_request', 'view_team_calendar']
};