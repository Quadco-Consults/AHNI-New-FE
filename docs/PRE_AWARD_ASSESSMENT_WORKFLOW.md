# Pre-Award Assessment Workflow Implementation

## Overview

This document outlines the comprehensive pre-award assessment workflow implementation based on the Technical Capacity Assessment and Financial Pre-Award Assessment Tool (PAT) templates. The workflow is designed to evaluate organizations seeking subawards, particularly for amounts greater than $150,000.

## Workflow Structure

### 1. Assessment Types

The system supports three types of assessments:

- **TECHNICAL_CAPACITY**: Evaluates organization's programming capacity and M&E capabilities
- **FINANCIAL_PAT**: Comprehensive financial assessment using the PAT tool for subawards > $150,000
- **COMBINED**: Both technical and financial assessments

### 2. Workflow Steps

The assessment follows a 7-step workflow:

1. **Assessment Initiation**: Initialize assessment and assign assessor
2. **Technical Capacity Assessment**: Evaluate programming capacity and M&E
3. **Financial Pre-Award Assessment (PAT)**: Comprehensive financial evaluation
4. **Risk Analysis & Rating**: Calculate overall risk rating
5. **Special Conditions & Requirements**: Define award conditions and documentation requirements
6. **Review & Approval**: Multi-level review and approval process
7. **Final Recommendation**: Proceed or not proceed recommendation

## Technical Capacity Assessment

### Programming Capacity Evaluation

The technical capacity assessment covers:

- Organizational structure (organogram)
- Staff strength and personnel files
- Program and M&E officer availability
- Adhoc staff support capacity
- Program data availability and KPI performance
- Target achievement in previous reporting periods
- Hotspot mapping and identification
- Activity reporting and archival systems
- Commodity storage capacity and conditions

### Monitoring & Evaluation Assessment

Evaluates:

- File cabinets and storage for M&E data
- Data collection tools usage
- National revised data collection tools compliance
- Data management systems and procedures

## Financial Pre-Award Assessment (PAT)

### Assessment Sections

The PAT includes 11 comprehensive sections:

#### A. General Organization Information (Max: 6 points)
- Legal registration and incorporation
- Financial reporting compliance
- Tax exemption status

#### B. Internal Audits and Financial Statements (Max: 6 points)
- Internal audit history
- Financial position review
- Unrestricted net assets evaluation

#### C. Financial Management (Max: 72 points)
Broken down into subsections:
- **Banking** (4 points): Cash management and bank account requirements
- **Funding** (2 points): Previous funding experience
- **Accounting Staff** (4 points): Staff qualifications and training needs
- **Accounting System** (12 points): System capabilities and record keeping
- **Segregation of Duties** (4 points): Payment approval processes
- **Documentation** (10 points): Transaction recording and proof requirements
- **Payroll** (18 points): Employee documentation and time tracking
- **Petty Cash** (4 points): Imprest system and policies
- **Financial Reports & Budgets** (8 points): Reporting frequency and monitoring
- **Travel and Workshops** (6 points): Travel policies and documentation

#### D. Procurement, Property and Commodities Management (Max: 22 points)
- Procurement policies and quotation processes
- Security and access controls
- Inventory management and asset tracking

#### E. Reports and Records (Max: 8 points)
- Security and access controls
- Data backup and recovery procedures
- Record retention policies

#### F. Insurance (Max: 2 points)
- Property and liability insurance coverage

#### G. Indirect Rate (Max: 2 points)
- NICRA or approved indirect cost rates

#### H. Shared Cost Allocation Plan (Max: 2 points)
- Multi-funder cost allocation procedures

#### I. 2nd Tier Subawardees (Max: 12 points)
- Sub-recipient pre-award processes
- Monitoring procedures and reporting requirements

#### J. Cost Share (Max: 2 points)
- Cost sharing documentation and monitoring

#### K. Satellite Offices (Max: 6 points)
- Remote office financial controls and oversight

### Risk Rating System

The PAT uses a 0-2 risk rating scale:
- **N/A = 0**: Not applicable
- **Low = 0**: Low risk
- **Med = 1**: Medium risk
- **High = 2**: High risk

### Overall Risk Calculation

The overall risk is calculated as:
1. Sum all individual risk ratings (total score)
2. Count N/A responses and multiply by 2 (NA adjustments)
3. Subtract NA adjustments from maximum possible score (140)
4. Calculate percentage: (total score / adjusted maximum) × 100

### Risk Level Thresholds

- **Low Risk**: 0-29%
- **Medium Risk**: 30-59%
- **High Risk**: 60-89%
- **Extremely High Risk**: 90-100%

## Implementation Components

### Type Definitions

**File**: `src/features/contracts-grants/types/contract-management/sub-grant/assessment.ts`

Key interfaces:
- `IPreAwardAssessment`: Main assessment structure
- `ITechnicalCapacityAssessment`: Technical evaluation structure
- `IFinancialPreAwardAssessment`: PAT structure
- `IAssessmentWorkflow`: Workflow management
- Form data types for each assessment type

### Workflow Configuration

**File**: `src/features/contracts-grants/constants/assessmentWorkflow.ts`

Contains:
- Predefined workflow steps
- Technical capacity questions
- Complete PAT section definitions with all questions
- Risk calculation utilities
- Assessment constants and thresholds

### API Controller

**File**: `src/features/contracts-grants/controllers/assessmentController.ts`

Provides hooks for:
- Assessment CRUD operations
- Workflow management
- Technical capacity assessment
- Financial PAT assessment
- Risk rating calculations
- PDF export functionality

## Certification Requirements

The PAT requires three mandatory signatures:

1. **Assessment Conductor**: AHNI finance staff or organization's senior finance staff
2. **Assessment Reviewer**: Senior finance or business unit manager
3. **Assessment Approver**: Project Director, Chief of Party, or Country Director

For high or extremely high-risk assessments, an additional Managing Director approval is required.

## Special Award Conditions

Based on assessment results, the system can define:
- Special award conditions for medium/high-risk responses
- SFR/Invoice documentation requirements
- Completion dates for addressing identified risks

## Documentation Requirements

All completed assessments must be:
- Scanned and uploaded in PDF format
- Stored in the C&G system
- Retained according to the organization's record retention schedule
- Made available for review as needed

## Integration Points

The workflow integrates with existing:
- Submission management system
- Document upload functionality
- User management and role-based access
- Notification system for workflow steps
- Reporting and analytics dashboard

## Usage Guidelines

1. **Initiation**: Assessment is triggered when a submission requires evaluation
2. **Assignment**: Qualified assessors are assigned based on submission value and type
3. **Completion**: Assessors complete relevant sections based on assessment type
4. **Review**: Multi-level review ensures quality and compliance
5. **Approval**: Final approval triggers award recommendation
6. **Documentation**: All supporting documents are archived for audit trail

## Best Practices

- Complete assessments early in the subaward process
- Ensure all supporting documentation is gathered before starting
- Follow the prescribed risk rating guidelines consistently
- Document all findings and recommendations thoroughly
- Maintain audit trail throughout the process
- Regular review of assessment criteria and thresholds

This implementation provides a comprehensive, structured approach to pre-award assessments that ensures consistent evaluation standards and risk mitigation for AHNI's subaward programs.