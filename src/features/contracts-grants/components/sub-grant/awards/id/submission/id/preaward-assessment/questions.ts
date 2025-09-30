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
            category_description: "Rate the organization as extremely high, high, medium, or low risk based upon the financial pre-award results",
            questions: [
                {
                    id: "gen-1",
                    question: "Is the organization incorporated or legally registered?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "high",
                    },
                },
                {
                    id: "gen-2",
                    question: "City and country of incorporation or legal registration:",
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
                {
                    id: "gen-3",
                    question: "Date of incorporation or legal registration:",
                    requires_explanation: false,
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
                        noRating: "high",
                    },
                },
                {
                    id: "gen-5",
                    question: "Is the organization tax exempt for Value Added Tax (VAT) or Goods and Service Tax (GST)?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "med",
                    },
                },
                {
                    id: "gen-6",
                    question: "Please list the number of employees of the organization (Full-time and Part-time)",
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
                    requires_explanation: false,
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
                        yesRating: "low",
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
                        noRating: "high",
                    },
                },
                {
                    id: "audit-3",
                    question: "Review the Statement of Financial Position (Balance Sheet/Statement of Net Assets). Does the organization have a positive \"Unrestricted Net Assets\"?",
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
            category_name: "C. Financial Management - Banking",
            category_description: "",
            questions: [
                {
                    id: "bank-1",
                    question: "Are the liquid assets (cash) of the organization kept in a bank account?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "high",
                    },
                },
                {
                    id: "bank-2",
                    question: "If AHNI anticipates providing an advance of USG funds to the organization; does local practice and regulations permit the organization to open an interest-bearing bank account?",
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
            category_name: "C. Financial Management - Funding",
            category_description: "",
            questions: [
                {
                    id: "fund-1",
                    question: "Has the organization received funding similar to the proposed subaward (U.S. Government, xyz foundation etc.) in the last 3 years?",
                    requires_explanation: true,
                    options: {
                        type: "boolean",
                        yesRating: "low",
                        noRating: "high",
                    },
                },
                {
                    id: "fund-2",
                    question: "Based on the organization's current year fiscal budget, list the organization's expected sources and planned receipts for the current fiscal year. Identify the prime funder",
                    requires_explanation: true,
                    options: {
                        type: "text",
                        yesRating: "",
                        noRating: "",
                    },
                },
            ],
        },
    ],
};
