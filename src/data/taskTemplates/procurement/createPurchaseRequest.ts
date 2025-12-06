// Create Purchase Request Template - Essential Procurement Process
import { TaskTemplate } from '../../../types/chatTypes';

export const createPurchaseRequestTemplate: TaskTemplate = {
  key: 'create_purchase_request',
  name: 'Create Purchase Request',
  category: 'Purchase Management',
  module: 'procurement',
  description: 'Request approval to purchase goods or services needed for project activities with proper vendor comparison',

  quickAnswer: 'Request to buy items for your project. Go to Procurement > Purchase Requests > Create New. Include detailed specifications and get quotes for approval.',

  timeRequired: '20-30 minutes',

  prerequisites: [
    'Project with available budget allocation',
    'Clear specifications of items needed',
    'Vendor quotes or price estimates',
    'Delivery timeline requirements',
    'Approval authority limits understood'
  ],

  steps: [
    {
      stepNumber: 1,
      title: 'Navigate to Purchase Requests',
      description: 'Access the procurement request system',
      action: 'From main menu: Procurement → Purchase Requests → View All',
      successIndicator: 'You see existing purchase requests with "Create New" button'
    },
    {
      stepNumber: 2,
      title: 'Create New Purchase Request',
      description: 'Start a new procurement request',
      action: 'Click "Create New Purchase Request" button',
      successIndicator: 'Purchase request form opens with project selection dropdown'
    },
    {
      stepNumber: 3,
      title: 'Select Project and Budget',
      description: 'Choose which project budget will cover this purchase',
      action: 'Fill in the project and financial information',
      fieldExplanations: [
        {
          fieldName: 'Project',
          description: 'Which project needs these items',
          example: 'Community Health Project - Phase 2 (project with available budget)',
          required: true,
          validationRules: ['Only projects with available budget appear', 'Must have spending authority for project']
        },
        {
          fieldName: 'Budget Line',
          description: 'Specific budget category for this purchase',
          example: 'Medical Supplies, Office Equipment, Training Materials, Vehicle Maintenance',
          required: true,
          validationRules: ['Must match approved budget categories', 'Check available balance']
        },
        {
          fieldName: 'Urgency Level',
          description: 'How quickly these items are needed',
          example: 'Standard (4-6 weeks), Urgent (2 weeks), Emergency (immediate)',
          required: true,
          validationRules: ['Emergency requires stronger justification', 'Affects approval timeline']
        }
      ],
      warningNote: 'Only projects where you have spending authority will appear in the dropdown'
    },
    {
      stepNumber: 4,
      title: 'Add Items and Specifications',
      description: 'List exactly what you need to purchase',
      action: 'Click "Add Item" and provide detailed specifications',
      fieldExplanations: [
        {
          fieldName: 'Item Description',
          description: 'Specific, detailed description of each item',
          example: 'Laptop Computer: Dell Latitude 5520, 16GB RAM, 512GB SSD, Windows 11 Pro (NOT just "laptop")',
          required: true,
          validationRules: ['Be specific enough for vendor to quote accurately', 'Include brand/model if required']
        },
        {
          fieldName: 'Quantity',
          description: 'How many units needed',
          example: '5 laptops, 1 printer, 100 training manuals',
          required: true,
          validationRules: ['Be realistic about actual needs', 'Consider storage and usage capacity']
        },
        {
          fieldName: 'Unit Price Estimate',
          description: 'Estimated cost per unit based on research',
          example: '$800 per laptop (based on Dell website quote)',
          required: true,
          validationRules: ['Based on actual vendor quotes or market research', 'Include currency']
        },
        {
          fieldName: 'Technical Specifications',
          description: 'Detailed technical or quality requirements',
          example: 'Minimum specs: Intel i5, 3-year warranty, English keyboard layout',
          required: true,
          validationRules: ['Include all essential requirements', 'Avoid over-specification']
        },
        {
          fieldName: 'Delivery Requirements',
          description: 'When and where items should be delivered',
          example: 'Deliver to Abuja office by March 15, 2024 for training workshop',
          required: true,
          validationRules: ['Allow reasonable lead time', 'Specify exact delivery location']
        }
      ],
      warningNote: 'Vague specifications lead to wrong items being delivered - be specific!'
    },
    {
      stepNumber: 5,
      title: 'Provide Vendor Quotes',
      description: 'Attach quotes from multiple suppliers for price comparison',
      action: 'Upload vendor quotations and document your recommendation',
      fieldExplanations: [
        {
          fieldName: 'Vendor 1 Quote',
          description: 'Quote from first supplier',
          example: 'TechMart Nigeria: $4,000 total for 5 laptops (PDF attachment)',
          required: true,
          validationRules: ['Must be formal written quote', 'Include delivery terms and warranty']
        },
        {
          fieldName: 'Vendor 2 Quote',
          description: 'Quote from second supplier for comparison',
          example: 'ComputerWorld: $4,200 total for 5 laptops (PDF attachment)',
          required: true,
          validationRules: ['At least 2 quotes required for purchases over $1,000']
        },
        {
          fieldName: 'Vendor 3 Quote',
          description: 'Third quote if available (recommended for high-value purchases)',
          example: 'Office Solutions: $3,800 total for 5 laptops (PDF attachment)',
          required: false,
          validationRules: ['Required for purchases over $5,000', 'Shows due diligence']
        },
        {
          fieldName: 'Recommended Vendor',
          description: 'Which supplier you recommend and why',
          example: 'Recommend Office Solutions: Lowest price, includes 3-year warranty, local support available',
          required: true,
          validationRules: ['Consider price, quality, delivery, and service', 'Justify your recommendation clearly']
        }
      ],
      successIndicator: 'Multiple quotes uploaded and recommendation clearly documented'
    },
    {
      stepNumber: 6,
      title: 'Justify Purchase Need',
      description: 'Explain clearly why this purchase is necessary',
      action: 'Write compelling justification linking purchase to project outcomes',
      fieldExplanations: [
        {
          fieldName: 'Business Justification',
          description: 'Why these items are essential for project success',
          example: 'Laptops required for data collection team to enter survey data in field. Without them, data collection delayed by 6 weeks, risking project timeline and donor deadlines.',
          required: true,
          validationRules: ['Connect to specific project activities', 'Explain consequences of not purchasing', 'Show cost-benefit analysis']
        },
        {
          fieldName: 'Alternative Analysis',
          description: 'Why alternatives won\'t work',
          example: 'Considered using existing office computers but field locations have no internet for cloud access. Tablets considered but survey software requires Windows.',
          required: true,
          validationRules: ['Show you considered other options', 'Demonstrate this is most cost-effective solution']
        },
        {
          fieldName: 'Expected Benefits',
          description: 'What outcomes this purchase will enable',
          example: 'Will enable real-time data collection from 15 communities, improving data quality and reducing survey completion time from 8 weeks to 4 weeks.',
          required: true,
          validationRules: ['Be specific and measurable', 'Link to project objectives']
        }
      ],
      warningNote: 'Weak justification is the #1 reason purchase requests get rejected or delayed'
    },
    {
      stepNumber: 7,
      title: 'Submit for Approval',
      description: 'Send request through the multi-level approval process',
      action: 'Review all information carefully, then submit for approval',
      successIndicator: 'Status changes to "Pending Approval" and approval workflow begins'
    }
  ],

  proTips: [
    'Get 3 quotes for purchases over $5,000 to speed approval process',
    'Submit requests 4-6 weeks before items are needed',
    'Include specific brand/model requirements to avoid substitutions',
    'Research local suppliers to reduce shipping costs and delivery time',
    'Keep vendor quotes valid for at least 30 days to allow for approval time',
    'Consider bulk purchases to negotiate better prices',
    'Factor in customs duties for international purchases'
  ],

  commonMistakes: [
    'Vague item descriptions that lead to wrong products being delivered',
    'Not getting enough vendor quotes - slows approval process',
    'Underestimating delivery time and requesting last-minute purchases',
    'Forgetting to include taxes, shipping, and customs fees in budget',
    'Not checking if items are already available in inventory',
    'Requesting premium brands without justification for extra cost',
    'Missing documentation attachments - causes approval delays'
  ],

  nextSteps: [
    'Request enters approval workflow: PENDING → MANAGER_REVIEW → PROCUREMENT_REVIEW → FINANCE_APPROVAL → APPROVED',
    'Project Manager reviews need and budget availability (1-2 days)',
    'Procurement Officer validates quotes and vendor selection (2-3 days)',
    'Finance approves budget allocation and spending authority (1-2 days)',
    'Once approved, Procurement creates Purchase Order and contracts vendor',
    'Vendor delivers items according to agreed timeline',
    'You receive and inspect items, confirm receipt in system',
    'Finance processes vendor payment after delivery confirmation'
  ],

  helpContacts: [
    {
      role: 'Procurement Officer',
      department: 'Procurement',
      forIssues: ['Vendor selection advice', 'Quote requirements', 'Approval process questions'],
      contactMethod: 'email'
    },
    {
      role: 'Project Manager',
      department: 'Programs',
      forIssues: ['Budget availability', 'Project justification', 'Priority discussions'],
      contactMethod: 'email'
    },
    {
      role: 'Finance Officer',
      department: 'Finance',
      forIssues: ['Budget categories', 'Cost calculations', 'Payment processes'],
      contactMethod: 'chat'
    }
  ],

  difficulty: 'intermediate',
  userRoles: ['Program Officer', 'Project Manager', 'Department Head', 'Field Coordinator'],
  permissions: ['procurement.add_purchase_request'],
  relatedTasks: ['track_purchase_request', 'receive_purchased_items', 'create_vendor_evaluation', 'check_inventory_first']
};