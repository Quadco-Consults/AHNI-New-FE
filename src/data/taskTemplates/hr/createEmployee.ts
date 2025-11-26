// Create Employee Template - Essential HR Function
import { TaskTemplate } from '../../../types/chatTypes';

export const createEmployeeTemplate: TaskTemplate = {
  key: 'create_employee',
  name: 'Add New Employee',
  category: 'Employee Management',
  module: 'hr',
  description: 'Register a new employee in the HR system with complete profile, job details, and system access',

  quickAnswer: 'Add new employees to the HR system. Go to HR > Employees > Add New. You\'ll need their personal info, job details, and salary information.',

  timeRequired: '15-20 minutes',

  prerequisites: [
    'HR Officer or HR Manager role',
    'Employee personal information collected',
    'Signed job offer with position details',
    'Salary and benefits information approved',
    'Manager assignment confirmed'
  ],

  steps: [
    {
      stepNumber: 1,
      title: 'Navigate to Employee Management',
      description: 'Access the HR employee registration section',
      action: 'From main menu: HR → Employees → Add New Employee',
      successIndicator: 'Employee registration form opens with personal information section'
    },
    {
      stepNumber: 2,
      title: 'Enter Personal Information',
      description: 'Fill in the employee\'s basic personal details',
      action: 'Complete all required personal information fields',
      fieldExplanations: [
        {
          fieldName: 'First Name',
          description: 'Employee\'s legal first name',
          example: 'John (as shown on passport/ID)',
          required: true,
          validationRules: ['Must match official documents']
        },
        {
          fieldName: 'Last Name',
          description: 'Employee\'s legal surname',
          example: 'Smith (family name on official documents)',
          required: true,
          validationRules: ['Must match official documents']
        },
        {
          fieldName: 'Email Address',
          description: 'Official company email for system access',
          example: 'john.smith@ahni.org (use standard format)',
          required: true,
          validationRules: ['Must be unique', 'Use company domain', 'Will be used for login']
        },
        {
          fieldName: 'Phone Number',
          description: 'Primary contact number with country code',
          example: '+234-801-123-4567 (include country code)',
          required: true,
          validationRules: ['Include country code', 'Use active number']
        },
        {
          fieldName: 'Date of Birth',
          description: 'For age verification and benefits calculation',
          example: 'January 15, 1990',
          required: true,
          validationRules: ['Must be 18+ years old', 'Match official documents']
        },
        {
          fieldName: 'Address',
          description: 'Current residential address',
          example: 'Complete address for emergency contact and mail delivery',
          required: true,
          validationRules: ['Must be current address']
        }
      ],
      warningNote: 'Email address will be used for system login - ensure it\'s correct!'
    },
    {
      stepNumber: 3,
      title: 'Set Employment Details',
      description: 'Configure the employee\'s job and organizational information',
      action: 'Fill in all employment-related fields',
      fieldExplanations: [
        {
          fieldName: 'Department',
          description: 'Which department the employee belongs to',
          example: 'HR, Programs, Finance, Procurement, M&E',
          required: true,
          validationRules: ['Must exist in organizational structure']
        },
        {
          fieldName: 'Position/Job Title',
          description: 'Exact job title from job description',
          example: 'Program Officer, HR Specialist, Finance Manager',
          required: true,
          validationRules: ['Must match approved position in organizational chart']
        },
        {
          fieldName: 'Start Date',
          description: 'Official first day of employment',
          example: 'March 1, 2024 (first day employee reports to work)',
          required: true,
          validationRules: ['Cannot be in the past unless backdating approved', 'Align with onboarding schedule']
        },
        {
          fieldName: 'Direct Manager',
          description: 'Immediate supervisor for reporting and approvals',
          example: 'Programs Manager (who will approve their leave and expenses)',
          required: true,
          validationRules: ['Must be existing employee with supervisory role']
        },
        {
          fieldName: 'Employment Type',
          description: 'Type of employment relationship',
          example: 'Permanent, Fixed-term Contract, Consultant, Volunteer',
          required: true,
          validationRules: ['Must match offer letter terms']
        },
        {
          fieldName: 'Location',
          description: 'Primary work location',
          example: 'Abuja HQ, Lagos Field Office, Remote',
          required: true,
          validationRules: ['Must be valid AHNI location']
        }
      ],
      successIndicator: 'All employment fields completed and manager assignment confirmed'
    },
    {
      stepNumber: 4,
      title: 'Configure Salary and Benefits',
      description: 'Set up compensation and benefits information',
      action: 'Enter salary details and benefit eligibility',
      fieldExplanations: [
        {
          fieldName: 'Base Salary',
          description: 'Annual salary before deductions',
          example: '$45,000 or NGN 18,000,000 (gross annual amount)',
          required: true,
          validationRules: ['Must match offer letter', 'Use approved salary scales']
        },
        {
          fieldName: 'Currency',
          description: 'Salary payment currency',
          example: 'USD for international staff, NGN for local staff',
          required: true,
          validationRules: ['Match location and contract type']
        },
        {
          fieldName: 'Pay Frequency',
          description: 'How often salary is paid',
          example: 'Monthly (standard for most employees)',
          required: true,
          validationRules: ['Monthly is standard unless specified otherwise']
        },
        {
          fieldName: 'Benefits Eligibility',
          description: 'Which benefit programs apply',
          example: 'Health insurance, life insurance, pension (can be configured later)',
          required: false,
          validationRules: ['Based on employment type and location']
        }
      ],
      warningNote: 'Salary information is confidential and access-controlled - only HR and Finance can see full details'
    },
    {
      stepNumber: 5,
      title: 'Set System Access and Permissions',
      description: 'Create user account and assign appropriate system permissions',
      action: 'Configure login credentials and system access',
      fieldExplanations: [
        {
          fieldName: 'Username',
          description: 'System login username',
          example: 'john.smith (usually firstname.lastname)',
          required: true,
          validationRules: ['Must be unique', 'Use standard format']
        },
        {
          fieldName: 'Initial Role',
          description: 'Starting permission level',
          example: 'All Staff (basic access), can be upgraded later based on responsibilities',
          required: true,
          validationRules: ['Start with minimal access, expand as needed']
        },
        {
          fieldName: 'Department Access',
          description: 'Which modules employee can access',
          example: 'HR staff get HR module, Program staff get Programs module',
          required: true,
          validationRules: ['Based on job role and department']
        }
      ],
      warningNote: 'System will generate temporary password and send login details via email'
    },
    {
      stepNumber: 6,
      title: 'Add Banking Information (Optional)',
      description: 'Set up salary payment details if available',
      action: 'Enter bank account details for salary payments',
      fieldExplanations: [
        {
          fieldName: 'Bank Name',
          description: 'Employee\'s bank for salary payments',
          example: 'First Bank, GTBank, Access Bank',
          required: false,
          validationRules: ['Must be recognized bank']
        },
        {
          fieldName: 'Account Number',
          description: 'Bank account number for direct deposit',
          example: '1234567890',
          required: false,
          validationRules: ['Validate account number format']
        }
      ],
      warningNote: 'Banking details can be added later by employee through self-service, but required before first salary payment'
    },
    {
      stepNumber: 7,
      title: 'Review and Save Employee Record',
      description: 'Verify all information is correct before saving',
      action: 'Review all sections and save the employee record',
      fieldExplanations: [
        {
          fieldName: 'Final Review Checklist',
          description: 'Verify critical information',
          example: 'Email unique and correct, start date aligns with onboarding, manager assignment appropriate, salary matches offer',
          required: true,
          validationRules: ['All required fields completed', 'Information matches offer letter']
        }
      ],
      successIndicator: 'Employee record saved successfully and employee ID generated'
    }
  ],

  proTips: [
    'Double-check email address - it\'s used for all system communications',
    'Coordinate start date with IT for equipment setup and office preparation',
    'Assign appropriate manager who will handle day-to-day supervision',
    'Start with basic system permissions - you can always add more later',
    'Save banking details securely - they\'re needed for first salary payment',
    'Use standard naming conventions for email and username consistency'
  ],

  commonMistakes: [
    'Using email that already exists - system will reject duplicate emails',
    'Selecting wrong manager - affects approval workflows and reporting',
    'Incorrect salary information - causes payroll problems later',
    'Wrong employment type - affects benefits eligibility and contract terms',
    'Missing start date coordination - employee may not have desk/equipment ready',
    'Assigning too many permissions initially - creates security risks'
  ],

  nextSteps: [
    'Employee receives welcome email with login credentials',
    'Manager gets notification about new team member',
    'IT Department creates necessary system accounts and email',
    'HR initiates onboarding checklist and orientation schedule',
    'Payroll team sets up salary processing for next pay period',
    'Employee completes onboarding tasks on first day',
    'Probation period tracking begins (if applicable)'
  ],

  helpContacts: [
    {
      role: 'HR Manager',
      department: 'HR',
      forIssues: ['Position classification', 'Salary scales', 'Policy questions'],
      contactMethod: 'email'
    },
    {
      role: 'IT Administrator',
      department: 'IT',
      forIssues: ['Email setup', 'System access problems', 'Permission configuration'],
      contactMethod: 'chat'
    },
    {
      role: 'Finance Officer',
      department: 'Finance',
      forIssues: ['Payroll setup', 'Banking details', 'Salary processing'],
      contactMethod: 'email'
    }
  ],

  difficulty: 'intermediate',
  userRoles: ['HR Officer', 'HR Manager', 'HR Specialist'],
  permissions: ['hr.add_employee', 'hr.manage_employees'],
  relatedTasks: ['onboard_employee', 'setup_employee_benefits', 'assign_employee_equipment', 'create_employment_contract']
};