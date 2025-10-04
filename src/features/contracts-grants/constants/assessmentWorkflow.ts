import { IAssessmentWorkflowStep, ITechnicalCapacityScore, IPATSection } from "../types/contract-management/sub-grant/assessment";

// Pre-Award Assessment Workflow Configuration
export const ASSESSMENT_WORKFLOW_STEPS: IAssessmentWorkflowStep[] = [
  {
    step: 1,
    name: "Assessment Initiation",
    status: "PENDING",
    required: true,
    description: "Initialize assessment and assign assessor"
  },
  {
    step: 2,
    name: "Technical Capacity Assessment",
    status: "PENDING",
    required: true,
    description: "Evaluate organization's programming capacity and M&E capabilities"
  },
  {
    step: 3,
    name: "Financial Pre-Award Assessment (PAT)",
    status: "PENDING",
    required: true,
    description: "Conduct comprehensive financial assessment for subawards > $150,000"
  },
  {
    step: 4,
    name: "Risk Analysis & Rating",
    status: "PENDING",
    required: true,
    description: "Calculate overall risk rating and determine risk level"
  },
  {
    step: 5,
    name: "Special Conditions & Requirements",
    status: "PENDING",
    required: false,
    description: "Define special award conditions and documentation requirements"
  },
  {
    step: 6,
    name: "Review & Approval",
    status: "PENDING",
    required: true,
    description: "Multi-level review and approval process"
  },
  {
    step: 7,
    name: "Final Recommendation",
    status: "PENDING",
    required: true,
    description: "Final recommendation to proceed or not proceed with subaward"
  }
];

// Technical Capacity Assessment Questions
export const TECHNICAL_CAPACITY_QUESTIONS = {
  programming_capacity: [
    {
      question: "Does Organization have an organogram? Please sight the organogram",
      response: "N/A" as const,
      findings: ""
    },
    {
      question: "What is the Current staff strength of the Organization? (Please sight personnel files and staff database)",
      response: "N/A" as const,
      findings: ""
    },
    {
      question: "Does the organization have a program and M&E officer?",
      response: "N/A" as const,
      findings: ""
    },
    {
      question: "How many adhoc staff do the organization currently support?",
      response: "N/A" as const,
      findings: ""
    },
    {
      question: "Is the Organization's Program Data as of December 2023 available? (Review status across Key Performance Indicators)",
      response: "N/A" as const,
      findings: ""
    },
    {
      question: "Did the organization attain its assigned targets in the previous reporting period?",
      response: "N/A" as const,
      findings: ""
    },
    {
      question: "Does the organization have a directory of hotspots mapped and identified in areas of implementation?",
      response: "N/A" as const,
      findings: ""
    },
    {
      question: "Do staff prepare & archive activity reports, and are they up to date? (review folders)",
      response: "N/A" as const,
      findings: ""
    },
    {
      question: "Is there adequate space for the storage of commodities? (Sight storage space and storage conditions – temperature, pallets, security)",
      response: "N/A" as const,
      findings: ""
    }
  ],
  monitoring_evaluation: [
    {
      question: "Are Lockable File Cabinets/Shelves available for M&E and Data Management?",
      response: "N/A" as const,
      findings: ""
    },
    {
      question: "How many file cabinets are available?",
      response: "N/A" as const,
      findings: ""
    },
    {
      question: "Are the National Revised Data Collection Tools used in this Organization?",
      response: "N/A" as const,
      findings: ""
    },
    {
      question: "If Yes, indicate the tools and if in use.",
      response: "N/A" as const,
      findings: ""
    }
  ]
};

// Financial PAT Sections and Questions
export const FINANCIAL_PAT_SECTIONS: IPATSection[] = [
  {
    section_name: "A. General Organization Information",
    section_rating: 0,
    max_rating: 6,
    questions: [
      {
        question: "Is the organization incorporated or legally registered?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "For the current period, have the financial reporting and audit requirements associated with the registration been fulfilled?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Is the organization tax exempt for Value Added Tax (VAT) or Goods and Service Tax (GST)?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "B. Internal Audits and Financial Statements",
    section_rating: 0,
    max_rating: 6,
    questions: [
      {
        question: "Has the organization undergone an internal financial audit or review during the current or prior fiscal year?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Review the Statement of Financial Position (Balance Sheet/Statement of Net Assets). Are the current assets minus the current liabilities positive?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Review the Statement of Financial Position (Balance Sheet/Statement of Net Assets). Does the organization have a positive 'Unrestricted Net Assets'?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "C. Financial Management - Banking",
    section_rating: 0,
    max_rating: 4,
    questions: [
      {
        question: "Are the liquid assets (cash) of the organization kept in a bank account?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "If AHNI anticipates providing an advance of USG funds to the organization; does local practice and regulations permit the organization to open an interest-bearing bank account?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "C. Financial Management - Funding",
    section_rating: 0,
    max_rating: 2,
    questions: [
      {
        question: "Has the organization received funding similar to the proposed subaward (U.S. Government, xyz foundation etc.) in the last 3 years?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "C. Financial Management - Accounting Staff",
    section_rating: 0,
    max_rating: 4,
    questions: [
      {
        question: "What is the background (work and education qualifications) of the Accountant for the project?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Is it necessary to train the accountant prior to the implementation of the project?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "C. Financial Management - Accounting System",
    section_rating: 0,
    max_rating: 12,
    questions: [
      {
        question: "Is the accounting system manual or automated? If automated, what is the accounting software program used?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Is the accounting system capable of tracking and documenting the receipts of awarded funds by source (funder/award)?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Is the accounting system capable of tracking and documenting the utilization of awarded funds by source (funder/award)?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization use a written chart of accounts containing a description of each account?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization have written accounting policies and procedures?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "What accounting records are kept? (General ledger, Cash receipts ledger, Cash disbursements ledger, Bank book, Petty cash book, Payroll register, Fixed Asset register, Advance Ledger)",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "C. Financial Management - Segregation of Duties",
    section_rating: 0,
    max_rating: 4,
    questions: [
      {
        question: "Are there adequate segregation of duties between preparer, reviewer and approver for payments?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Is it the policy and practice that four different persons: prepare checks/EFT/internet banking, authorize the payments, reconcile bank accounts, and have access to receipts?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "C. Financial Management - Documentation",
    section_rating: 0,
    max_rating: 10,
    questions: [
      {
        question: "Are pre-numbered forms used to record all of the financial transactions and account for the sequence of all numbers used?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Are key records matched before a transaction is approved (i.e., matching purchase order, receiving report, and vendor invoice before the invoice is approved for payment)?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Are copies of proof of payment (e.g. checks, EFTs, internet banking) attached to the payment voucher?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Are the source documents canceled (e.g. stamped 'PAID') after processing to provide assurance that the same documents will not be reused?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Will the supporting documentation related to the AHNI project be maintained separately, marked, or coded so that the cost therein are clearly distinguishable from non-AHNI projects?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "C. Financial Management - Payroll",
    section_rating: 0,
    max_rating: 18,
    questions: [
      {
        question: "Is each employee's salary documented in an employment letter or contract?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Is a personnel action (or similar) form used to document salary revisions?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "For new hires, does the organization have written policies and a salary scale to guide them in establishing new hires salaries?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Provide an example of an employee's completed time sheet, if applicable.",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the time sheet detail the employee's hours worked each day by project (i.e., AHNI hours worked and non AHNI hours)?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization use the employee's approved time sheets to allocate payroll?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Is the organization complying with government payroll tax withholding regulations?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization have a written policy to support fringe benefits (leave, medical, pension and other benefits)?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization have written policies and procedures that govern the conduct of ethics and conflicts of interest?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "C. Financial Management - Petty Cash",
    section_rating: 0,
    max_rating: 4,
    questions: [
      {
        question: "Does the organization maintain petty cash on the imprest system?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization have a written petty cash policy that addresses petty cash management and segregation of such duties?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "C. Financial Management - Financial Reports & Budgets",
    section_rating: 0,
    max_rating: 8,
    questions: [
      {
        question: "Are the financial statements/reports prepared by authorized personnel having sufficient experience and expertise?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "How frequent does the organization prepare financial statements/reports?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Are financial monitoring systems in place to ensure that budgets are not exceeded?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization input funders' budgets into the accounting systems by line item amounts, by total budget or neither?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "C. Financial Management - Travel and Workshops",
    section_rating: 0,
    max_rating: 6,
    questions: [
      {
        question: "Does the organization have a written travel policy that addresses meals, accommodations, fuel, mileage, and other related travel cost?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "For meetings and workshops is there a written policy that describes adequate supporting documentation for participant's expenses and attendance records?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization have a system to track advances (e.g. travel, workshops) they issue to ensure that they are appropriately accounted for and documented?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "D. Procurement, Property and Commodities Management Systems",
    section_rating: 0,
    max_rating: 22,
    questions: [
      {
        question: "Does the organization have a written procurement policy?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization always solicit quotations from vendors before making a purchase over the local currency equivalent of $3,000?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "When dealing with US government funded projects, are terrorism and debarment searches performed of potential vendors, employees, consultants and subrecipients?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Are secured facilities used when appropriate, and access to equipment and commodities limited to authorized personnel?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Are the commodities maintained in a secure storage facility that meet the temperature and humidity requirements?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization use inventory stock cards to manage commodities and supplies?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization have adequate controls to ensure that obsolete commodities are not distributed?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Are different individuals responsible for purchasing goods, receiving goods, and approving vouchers?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Are incoming and outgoing assets counted, inspected, and received or released on the basis of proper authorization?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization maintain a fixed asset listing of non-expendable property?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Are assets on hand periodically (at least yearly) inspected and counted, and the results compared with the asset records?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "E. Reports and Records",
    section_rating: 0,
    max_rating: 8,
    questions: [
      {
        question: "Are secured facilities used when appropriate, and access to critical forms and equipment limited to authorized personnel?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Is access to computer programs and data files restricted to authorized personnel only?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Are procedures in place to provide reasonable assurance that current files can be recovered in the event of a computer failure?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization retain accounting records, including invoices, vouchers and time sheets, for at least three years after the final invoice is submitted to the funder?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "F. Insurance",
    section_rating: 0,
    max_rating: 2,
    questions: [
      {
        question: "Does the organization maintain Property, General Liability or Other types of insurance?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "G. Indirect Rate",
    section_rating: 0,
    max_rating: 2,
    questions: [
      {
        question: "Does the organization have an established, overhead, or administrative rate, such as an approved US Government negotiated indirect cost rate (NICRA)?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "H. Shared Cost Allocation Plan",
    section_rating: 0,
    max_rating: 2,
    questions: [
      {
        question: "If the organization has multiple funder's – will the organization use a shared cost allocation plan, to allocate direct cost such as; rent, utilities, administrative supplies, consistently and equitably between all funders?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "I. 2nd Tier subs",
    section_rating: 0,
    max_rating: 12,
    questions: [
      {
        question: "Does the organization have a financial pre-award questionnaire/process in which it administers to 2nd Tier-subawardees?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization have written policies and procedures for monitoring 2nd tier subawardees?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Will each 2nd tier sub-awardee's expenses be easily identifiable in the organization's financial accounting reports?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Will funds advanced to the 2nd tier sub-awardees be recorded as expenses?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "How often will the 2nd tier sub-awardee's financial information be submitted to the organization?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "What information will the 2nd tier sub-awardee be required to submit to the organization for payment?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "J. Cost Share",
    section_rating: 0,
    max_rating: 2,
    questions: [
      {
        question: "Does the organization have policies and procedures for documenting and monitoring cost share?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  },
  {
    section_name: "K. Satellite Offices",
    section_rating: 0,
    max_rating: 6,
    questions: [
      {
        question: "Will accounting transactions related to the AHNI funded project be recorded at the organization's satellite offices?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Does the organization perform a monthly financial review of the satellite offices' supporting documentation?",
        response: "",
        risk_rating: 0,
        comments: ""
      },
      {
        question: "Are financial duties in the satellite offices separated so that no one individual has complete control over an entire financial transaction?",
        response: "",
        risk_rating: 0,
        comments: ""
      }
    ]
  }
];

// Risk Level Thresholds
export const RISK_LEVEL_THRESHOLDS = {
  LOW: { min: 0, max: 29 },
  MEDIUM: { min: 30, max: 59 },
  HIGH: { min: 60, max: 89 },
  EXTREMELY_HIGH: { min: 90, max: 100 }
};

// Assessment Constants
export const ASSESSMENT_CONSTANTS = {
  MAXIMUM_TOTAL_SCORE: 140,
  MINIMUM_SUBAWARD_FOR_PAT: 150000, // USD
  REQUIRED_SIGNATURES: 3, // Conductor, Reviewer, Approver
  RECORD_RETENTION_YEARS: 3,
  MANDATORY_UPLOAD_FORMAT: "PDF"
};

// Utility function to calculate risk level
export const calculateRiskLevel = (percentage: number): "LOW" | "MEDIUM" | "HIGH" | "EXTREMELY_HIGH" => {
  if (percentage <= RISK_LEVEL_THRESHOLDS.LOW.max) return "LOW";
  if (percentage <= RISK_LEVEL_THRESHOLDS.MEDIUM.max) return "MEDIUM";
  if (percentage <= RISK_LEVEL_THRESHOLDS.HIGH.max) return "HIGH";
  return "EXTREMELY_HIGH";
};

// Utility function to calculate overall rating
export const calculateOverallRating = (totalScore: number, naCount: number, maxScore: number = ASSESSMENT_CONSTANTS.MAXIMUM_TOTAL_SCORE) => {
  const naAdjustment = naCount * 2;
  const adjustedMaximum = maxScore - naAdjustment;
  const percentage = adjustedMaximum > 0 ? (totalScore / adjustedMaximum) * 100 : 0;
  const riskLevel = calculateRiskLevel(percentage);

  return {
    total_score: totalScore,
    maximum_possible_score: maxScore,
    na_adjustments: naAdjustment,
    adjusted_maximum: adjustedMaximum,
    percentage_score: Math.round(percentage * 100) / 100,
    risk_level: riskLevel
  };
};