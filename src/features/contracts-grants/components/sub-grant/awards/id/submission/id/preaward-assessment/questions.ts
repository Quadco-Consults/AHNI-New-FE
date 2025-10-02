// Technical Capacity Assessment Questions
export const technicalCapacityQuestions = {
    rating_scale: {
        na: 0,
        low: 0,
        med: 1,
        high: 2,
    },
    forms: [
        {
            category_name: "PROGRAMMING CAPACITY",
            category_description: "",
            questions: [
                {
                    id: "prog-1",
                    question: "Does Organization have an organogram? Please sight the organogram",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "high",
                    },
                },
                {
                    id: "prog-2",
                    question: "What is the Current staff strength of the Organization? (Please sight personnel files and staff database).",
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
                {
                    id: "prog-3",
                    question: "Does the organization have a program and M&E officer?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "high",
                    },
                },
                {
                    id: "prog-4",
                    question: "How many adhoc staff do the organization currently support?",
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
                {
                    id: "prog-5",
                    question: "Is the Organization's Program Data as of December 2023 available? (Review status across Key Performance Indicators)",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "med",
                    },
                },
                {
                    id: "prog-6",
                    question: "Did the organization attain its assigned targets in the previous reporting period?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "med",
                    },
                },
                {
                    id: "prog-7",
                    question: "Does the organization have a directory of hotspots mapped and identified in areas of implementation?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "med",
                    },
                },
                {
                    id: "prog-8",
                    question: "Do staff prepare & archive activity reports, and are they up to date? (review folders)",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "high",
                    },
                },
                {
                    id: "prog-9",
                    question: "Is there adequate space for the storage of commodities? (Sight storage space and storage conditions – temperature, pallets, security)",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "high",
                    },
                },
            ],
        },
        {
            category_name: "MONITORING AND EVALUATION - Data Management",
            category_description: "",
            questions: [
                {
                    id: "me-1",
                    question: "Are Lockable File Cabinets/Shelves available for M&E and Data Management?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "med",
                    },
                },
                {
                    id: "me-2",
                    question: "How many file cabinets are available?",
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
                {
                    id: "me-3",
                    question: "Are the National Revised Data Collection Tools used in this Organization?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "high",
                    },
                },
            ],
        },
    ],
};

// Financial Pre-Award Assessment Questions (PAT) for amounts > $150,000
export const financialPreAwardQuestions = {
    rating_scale: {
        na: 0,
        low: 0,
        med: 1,
        high: 2,
    },
    forms: [
        {
            category_name: "A. General Organization Information",
            category_description: "To be completed by AHNI designated finance staff and only when impractical, the questions may be answered by the Organization's senior finance staff. Risk Rating: N/A=0 Low=0 Med=1 High=2",
            questions: [
                {
                    id: "gen-1",
                    question: "Is the organization incorporated or legally registered? Provide registration number:",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "med/high",
                    },
                },
                {
                    id: "gen-2",
                    question: "City and country of incorporation or legal registration:",
                    requires_explanation: false,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
                {
                    id: "gen-3",
                    question: "Date of incorporation or legal registration:",
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
                {
                    id: "gen-4",
                    question: "For the current period, have the financial reporting and audit requirements associated with the registration been fulfilled? If no, what is pending?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "med/high",
                    },
                },
                {
                    id: "gen-5",
                    question: "Is the organization tax exempt for Value Added Tax (VAT) or Goods and Service Tax (GST)? If no, explain if an alternative option is available",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "med/high",
                    },
                },
                {
                    id: "gen-6",
                    question: "Please list the number of employees of the organization (Full-time and Part-time employees)",
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
                {
                    id: "gen-7",
                    question: "Names of banks signatory (Request for account mandate for confirmation)",
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
                {
                    id: "gen-8",
                    question: "Enter the organization's fiscal year:",
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
            ],
        },
        {
            category_name: "B. Internal Audits and Financial Statements",
            category_description: "",
            questions: [
                {
                    id: "audit-1",
                    question: "Has the organization undergone an internal financial audit or review during the current or prior fiscal year?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "med/low",
                        noRating: "high",
                    },
                },
                {
                    id: "audit-2",
                    question: "Review the Statement of Financial Position (Balance Sheet/Statement of Net Assets). Are the current assets minus the current liabilities positive?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "med/high",
                    },
                },
                {
                    id: "audit-3",
                    question: "Review the Statement of Financial Position (Balance Sheet/Statement of Net Assets). Does the organization have a positive \"Unrestricted Net Assets\"?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "med/high",
                    },
                },
            ],
        },
        {
            category_name: "C. Financial Management - Banking",
            category_description: "",
            questions: [
                {
                    id: "bank-1",
                    question: "Are the liquid assets (cash) of the organization kept in a bank account? If yes, provide name of the organization's bank",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "med/high",
                    },
                },
                {
                    id: "bank-2",
                    question: "If AHNI anticipates providing an advance of USG funds to the organization; does local practice and regulations permit the organization to open an interest-bearing bank account? (Refer to 2 CFR 200.305(b)(8), and USAID ADS 303, and other applicable regulations.)",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "med/high",
                    },
                },
            ],
        },
        {
            category_name: "C. Financial Management - Funding",
            category_description: "",
            questions: [
                {
                    id: "fund-1",
                    question: "Has the organization received funding similar to the proposed subaward (U.S. Government, xyz foundation etc.) in the last 3 years? Please identify the source and specify the amount(s) received from each source, by year",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "med/low",
                        noRating: "med/high",
                    },
                },
                {
                    id: "fund-2",
                    question: "Based on the organization's current year fiscal budget, list the organization's expected sources and planned receipts for the current fiscal year. Identify the prime funder (U.S. Government, xyz foundation etc.)",
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
            ],
        },
        {
            category_name: "C. Financial Management - Accounting Staff",
            category_description: "",
            questions: [
                {
                    id: "acc-staff-1",
                    question: "How many employees are in the Accounting Department and what are their names and key responsibilities?",
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
                {
                    id: "acc-staff-2",
                    question: "What is the background (work and education qualifications) of the Accountant for the project?",
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
                {
                    id: "acc-staff-3",
                    question: "Is it necessary to train the accountant prior to the implementation of the project?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
<<<<<<< HEAD
                        yesRating: "high",
=======
                        yesRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                        noRating: "low",
                    },
                },
            ],
        },
        {
            category_name: "C. Financial Management - Accounting System",
            category_description: "",
            questions: [
                {
                    id: "acc-sys-1",
<<<<<<< HEAD
                    question: "Is the accounting system manual or automated? If automated, what is the accounting software program used?",
=======
                    question: "Is the accounting system manual or automated? If automated, what is the accounting software program used? Specify.",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
                {
                    id: "acc-sys-2",
                    question: "Is the accounting system capable of tracking and documenting the receipts of awarded funds by source (funder/award)?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "acc-sys-3",
                    question: "Is the accounting system capable of tracking and documenting the utilization of awarded funds by source (funder/award)?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "acc-sys-4",
                    question: "Does the organization use a written chart of accounts containing a description of each account?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "acc-sys-5",
                    question: "Does the organization have written accounting policies and procedures?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
<<<<<<< HEAD
                        yesRating: "low",
=======
                        yesRating: "low/med",
>>>>>>> 6895d90f (subgrant-ongoing)
                        noRating: "high",
                    },
                },
                {
                    id: "acc-sys-6",
<<<<<<< HEAD
                    question: "What accounting records are kept? (General ledger, Cash receipts ledger, Cash disbursements ledger, Bank book, Petty cash book, Payroll register, Fixed Asset register, Advance Ledger - Indicate date of last entry)",
=======
                    question: "What accounting records are kept? (General ledger, Cash receipts ledger, Cash disbursements ledger, Bank book, Petty cash book, Payroll register, Fixed Asset register, Advance Ledger) - Indicate date of last entry",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
            ],
        },
        {
            category_name: "C. Financial Management - Segregation of Duties",
            category_description: "",
            questions: [
                {
<<<<<<< HEAD
                    id: "seg-1",
                    question: "Are there adequate segregation of duties between preparer, reviewer and approver for payments?",
=======
                    id: "seg-duty-1",
                    question: "Are there adequate segregation of duties between preparer, reviewer and approver for payments? (Provide names/titles/positions)",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
                    },
                },
                {
                    id: "seg-2",
                    question: "Is it the policy and practice that different persons: prepare checks/EFT/internet banking, authorize the payments, reconcile bank accounts, and have access to receipts?",
=======
                        noRating: "med/high",
                    },
                },
                {
                    id: "seg-duty-2",
                    question: "Is it the policy and practice that four different persons: prepare checks/EFT/internet banking, and authorize the payments, and reconcile bank accounts, and have access to receipts?",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
            ],
        },
        {
            category_name: "C. Financial Management - Documentation",
            category_description: "",
            questions: [
                {
                    id: "doc-1",
                    question: "Are pre-numbered forms used to record all of the financial transactions and account for the sequence of all numbers used?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "doc-2",
                    question: "Are key records matched before a transaction is approved (i.e., matching purchase order, receiving report, and vendor invoice before the invoice is approved for payment)?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "doc-3",
                    question: "Are copies of proof of payment (e.g. checks, EFTs, internet banking) attached to the payment voucher?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "doc-4",
                    question: "Are the source documents canceled (e.g. stamped \"PAID\") after processing to provide assurance that the same documents will not be reused?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "doc-5",
<<<<<<< HEAD
                    question: "Will the supporting documentation related to the AHNI project be maintained separately, marked, or coded so that the cost therein are clearly distinguishable from non-AHNI projects?",
=======
                    question: "Will the supporting documentation related to the AHNI project be maintained separately, marked, or coded so that the cost therein are clearly distinguishable from non-AHNI projects? If yes, indicate how:",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
            ],
        },
        {
            category_name: "C. Financial Management - Payroll",
            category_description: "",
            questions: [
                {
<<<<<<< HEAD
                    id: "pay-1",
=======
                    id: "payroll-1",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "Is each employee's salary documented in an employment letter or contract?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
                    },
                },
                {
                    id: "pay-2",
=======
                        noRating: "med/high",
                    },
                },
                {
                    id: "payroll-2",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "Is a personnel action (or similar) form used to document salary revisions?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
                    },
                },
                {
                    id: "pay-3",
=======
                        noRating: "med/high",
                    },
                },
                {
                    id: "payroll-3",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "For new hires, does the organization have written policies and a salary scale to guide them in establishing new hires salaries?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
                    },
                },
                {
                    id: "pay-4",
                    question: "Provide an example of an employee's completed time sheet. If not provided, explain how organization will comply with US Gov't 2 CFR 200.430 (i) Standards for Documentation of Personnel Expenses.",
=======
                        noRating: "med/high",
                    },
                },
                {
                    id: "payroll-4",
                    question: "Provide an example of an employee's completed time sheet, if applicable. If not provided, explain how organization will comply with US Gov't 2 CFR 200.430(i) Standards for Documentation of Personnel Expenses",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
                {
<<<<<<< HEAD
                    id: "pay-5",
=======
                    id: "payroll-5",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "Does the time sheet detail the employee's hours worked each day by project (i.e., AHNI hours worked and non AHNI hours)?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
                    },
                },
                {
                    id: "pay-6",
=======
                        noRating: "med/high",
                    },
                },
                {
                    id: "payroll-6",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "Does the organization use the employee's approved time sheets to allocate payroll?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
                    },
                },
                {
                    id: "pay-7",
=======
                        noRating: "med/high",
                    },
                },
                {
                    id: "payroll-7",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "Is the organization complying with government payroll tax withholding regulations? If not, explain.",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
                    },
                },
                {
                    id: "pay-8",
                    question: "Does the organization have a written policy to support fringe benefits (leave, medical, pension and other benefits)?",
=======
                        noRating: "med/high",
                    },
                },
                {
                    id: "payroll-8",
                    question: "Does the organization have a written policy to support fringe benefits (leave, medical, pension and other benefits)? If yes, describe",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
                    },
                },
                {
                    id: "pay-9",
=======
                        noRating: "med/high",
                    },
                },
                {
                    id: "payroll-9",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "Does the organization have written policies and procedures that govern the conduct of ethics and conflicts of interest?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
            ],
        },
        {
            category_name: "C. Financial Management - Petty Cash",
            category_description: "",
            questions: [
                {
                    id: "petty-1",
                    question: "Does the organization maintain petty cash on the imprest system? What is the imprest petty cash amount?",
                    requires_explanation: true,
                    options: {
<<<<<<< HEAD
                        type: "text",
                        yesRating: "",
                        noRating: "",
=======
                        type: "boolean",
                        yesRating: "low",
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "petty-2",
<<<<<<< HEAD
                    question: "Does the organization have a written petty cash policy that addresses petty cash management and segregation of such duties?",
=======
                    question: "Does the organization have a written petty cash policy that addresses petty cash management and segregation of such duties (e.g. Who keeps the petty cash? What expenses are paid and what documentation is obtained to support the expense)?",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
            ],
        },
        {
            category_name: "C. Financial Management - Financial Reports and Budgets",
            category_description: "",
            questions: [
                {
                    id: "fin-rep-1",
<<<<<<< HEAD
                    question: "Are the financial statements/reports prepared by authorized personnel having sufficient experience and expertise to ensure compliance with applicable accounting principles?",
=======
                    question: "Are the financial statements/reports prepared by authorized personnel having sufficient experience and expertise to ensure compliance with applicable accounting principles? (Preparer's Name & Title)",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "fin-rep-2",
<<<<<<< HEAD
                    question: "How frequent does the organization prepare financial statements/reports?",
=======
                    question: "How frequent does the organization prepare financial statements/reports? (Monthly, Quarterly, Annually)",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
                {
                    id: "fin-rep-3",
                    question: "Are financial monitoring systems in place to ensure that budgets are not exceeded (i.e. costs compared with approved budgets and variances explained)?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "fin-rep-4",
                    question: "Does the organization input funders' budgets into the accounting systems by line item amounts, by total budget or neither?",
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
            ],
        },
        {
            category_name: "C. Financial Management - Travel and Workshops",
            category_description: "",
            questions: [
                {
                    id: "travel-1",
                    question: "Does the organization have a written travel policy that addresses meals, accommodations, fuel, mileage, and other related travel cost?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "travel-2",
                    question: "For meetings and workshops is there a written policy that describes adequate supporting documentation for participant's expenses and attendance records?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "travel-3",
<<<<<<< HEAD
                    question: "Does the organization have a system to track advances (e.g. travel, workshops) they issue to ensure that they are appropriately accounted for and documented?",
=======
                    question: "Does the organization have a system to track advances (e.g. travel, workshops) they issue to ensure that they are appropriately accounted for and documented? How is the difference in the amount advanced and actually paid resolved?",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
            ],
        },
        {
            category_name: "D. Procurement, Property and Commodities Management Systems",
            category_description: "",
            questions: [
                {
                    id: "proc-1",
                    question: "Does the organization have a written procurement policy?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "proc-2",
                    question: "Does the organization always solicit quotations from vendors before making a purchase over the local currency equivalent of $3,000?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "proc-3",
                    question: "When dealing with US government funded projects, are terrorism and debarment searches performed of potential vendors, employees, consultants and subrecipients?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "proc-4",
                    question: "Are secured facilities used when appropriate, and access to equipment and commodities limited to authorized personnel?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "proc-5",
                    question: "Are the commodities maintained in a secure storage facility that meet the temperature and humidity requirements and are free from rodents, insects, oil and water damage?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "proc-6",
                    question: "Does the organization use inventory stock cards to manage commodities and supplies?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "proc-7",
<<<<<<< HEAD
                    question: "Does the organization have adequate controls to ensure that obsolete commodities are not distributed?",
=======
                    question: "Does the organization have adequate controls to ensure that obsolete commodities are not distributed? (Commodities; such as medical supplies, pharmaceuticals, condoms and printed media materials, etc.)",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "proc-8",
                    question: "Are different individuals responsible for purchasing goods, receiving goods, and approving vouchers?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "proc-9",
<<<<<<< HEAD
                    question: "Are incoming and outgoing assets counted, inspected, and received or released on the basis of proper authorization?",
=======
                    question: "Are incoming and outgoing assets counted, inspected, and received or released on the basis of proper authorization in accordance with established procedures?",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "proc-10",
<<<<<<< HEAD
                    question: "Does the organization maintain a fixed asset listing of non-expendable property containing description, serial number, acquisition cost, acquisition date, unique fixed asset number, location, current condition, and funding source?",
=======
                    question: "Does the organization maintain a fixed asset listing of non-expendable property containing the following? (Description, serial number, acquisition cost, acquisition date, unique fixed asset number assigned by the organization, location, current condition, and funding source.)",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "proc-11",
                    question: "Are assets on hand periodically (at least yearly) inspected and counted, and the results compared with the asset records?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
            ],
        },
        {
            category_name: "E. Reports and Records",
            category_description: "",
            questions: [
                {
<<<<<<< HEAD
                    id: "rep-1",
=======
                    id: "rec-1",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "Are secured facilities used when appropriate, and access to critical forms and equipment limited to authorized personnel?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
                    },
                },
                {
                    id: "rep-2",
=======
                        noRating: "med/high",
                    },
                },
                {
                    id: "rec-2",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "Is access to computer programs and data files restricted to authorized personnel only?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
                    },
                },
                {
                    id: "rep-3",
=======
                        noRating: "med/high",
                    },
                },
                {
                    id: "rec-3",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "Are procedures in place to provide reasonable assurance that current files can be recovered in the event of a computer failure?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
                    },
                },
                {
                    id: "rep-4",
=======
                        noRating: "med/high",
                    },
                },
                {
                    id: "rec-4",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "Does the organization retain accounting records, including invoices, vouchers and time sheets, for at least three years after the final invoice is submitted to the funder?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
            ],
        },
        {
            category_name: "F. Insurance",
            category_description: "",
            questions: [
                {
                    id: "ins-1",
<<<<<<< HEAD
                    question: "Does the organization maintain Property/Vehicle Insurance?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "high",
                    },
                },
                {
                    id: "ins-2",
                    question: "Does the organization maintain General Liability Insurance?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "high",
=======
                    question: "Does the organization maintain Property, General Liability or Other types of insurance? Specify the nature of coverage (Property/Vehicle Insurance, General Liability Insurance, Other)",
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
            ],
        },
        {
            category_name: "G. Indirect Rate",
            category_description: "",
            questions: [
                {
                    id: "ind-1",
<<<<<<< HEAD
                    question: "Does the organization have an established, overhead, or administrative rate, such as an approved US Government negotiated indirect cost rate (NICRA)?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
=======
                    question: "Does the organization have an established, overhead, or administrative rate, such as an approved US Government negotiated indirect cost rate (NICRA)? (Note: In cases in which there is no approved NICRA letter or no audited indirect rate, consider the allowability of the 10% de minimis as defined by 2 CFR 200 for US Government funded assistance awards. For all others circumstances the cost must be direct charged.)",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low/med",
>>>>>>> 6895d90f (subgrant-ongoing)
                        noRating: "high",
                    },
                },
            ],
        },
        {
            category_name: "H. Shared Cost Allocation Plan",
            category_description: "",
            questions: [
                {
                    id: "cost-alloc-1",
<<<<<<< HEAD
                    question: "If the organization has multiple funder's – will the organization use a shared cost allocation plan, to allocate direct cost such as; rent, utilities, administrative supplies, consistently and equitably between all funders?",
=======
                    question: "If the organization has multiple funders – will the organization use a shared cost allocation plan, to allocate direct cost such as; rent, utilities, administrative supplies, consistently and equitably between all funders?",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
            ],
        },
        {
<<<<<<< HEAD
            category_name: "I. 2nd Tier Subawardees",
            category_description: "",
            questions: [
                {
                    id: "sub-1",
=======
            category_name: "I. 2nd Tier Subs",
            category_description: "",
            questions: [
                {
                    id: "tier2-1",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "Does the organization have a financial pre-award questionnaire/process in which it administers to 2nd Tier-subawardees?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
                    },
                },
                {
                    id: "sub-2",
=======
                        noRating: "med/high",
                    },
                },
                {
                    id: "tier2-2",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "Does the organization have written policies and procedures for monitoring 2nd tier subawardees?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
                    },
                },
                {
                    id: "sub-3",
=======
                        noRating: "med/high",
                    },
                },
                {
                    id: "tier2-3",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "Will each 2nd tier sub-awardee's expenses be easily identifiable in the organization's financial accounting reports?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
                    },
                },
                {
                    id: "sub-4",
=======
                        noRating: "med/high",
                    },
                },
                {
                    id: "tier2-4",
>>>>>>> 6895d90f (subgrant-ongoing)
                    question: "Will funds advanced to the 2nd tier sub-awardees be recorded as expenses?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
<<<<<<< HEAD
                        yesRating: "high",
                        noRating: "low",
                    },
                },
                {
                    id: "sub-5",
                    question: "How often will the 2nd tier sub-awardee's financial information be submitted to the organization?",
=======
                        yesRating: "med/low",
                        noRating: "high",
                    },
                },
                {
                    id: "tier2-5",
                    question: "How often will the 2nd tier sub-awardee's financial information be submitted to the organization? (Monthly, Every other Month, Quarterly or less often)",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
                {
<<<<<<< HEAD
                    id: "sub-6",
                    question: "What information will the 2nd tier sub-awardee be required to submit to the organization for payment?",
=======
                    id: "tier2-6",
                    question: "What information will the 2nd tier sub-awardee be required to submit to the organization for payment? (No invoicing required, Financial Invoice only, Disbursements & receipts listing with financial invoice, Original or copies of paid invoices with financial invoice)",
>>>>>>> 6895d90f (subgrant-ongoing)
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
            ],
        },
        {
            category_name: "J. Cost Share",
            category_description: "",
            questions: [
                {
                    id: "cost-share-1",
                    question: "Does the organization have policies and procedures for documenting and monitoring cost share?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
            ],
        },
        {
            category_name: "K. Satellite Offices",
            category_description: "",
            questions: [
                {
                    id: "sat-1",
                    question: "Will accounting transactions related to the AHNI funded project be recorded at the organization's satellite offices?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
<<<<<<< HEAD
                        yesRating: "high",
=======
                        yesRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                        noRating: "low",
                    },
                },
                {
                    id: "sat-2",
                    question: "Does the organization perform a monthly financial review of the satellite offices' supporting documentation?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
                {
                    id: "sat-3",
                    question: "Are financial duties in the satellite offices separated so that no one individual has complete control over an entire financial transaction?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
<<<<<<< HEAD
                        noRating: "high",
=======
                        noRating: "med/high",
>>>>>>> 6895d90f (subgrant-ongoing)
                    },
                },
            ],
        },
    ],
};
