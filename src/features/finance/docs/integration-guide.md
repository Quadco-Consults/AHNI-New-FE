# Finance Module Integration Guide

This guide explains how to integrate admin modules with the finance/accounting system for automatic journal entry creation.

## Overview

The finance module provides automatic journal entry creation when admin module transactions are approved. This ensures all financial activities are properly recorded in the general ledger.

## Integration Methods

### Method 1: Event-Based Integration (Recommended)

Use the event system to trigger journal entry creation:

```typescript
import { triggerFinanceIntegration } from '@/features/finance/utils/financeInit';

// In your approval handler
const handlePaymentRequestApproval = async (paymentRequest: any) => {
  // Your existing approval logic
  await approvePaymentRequest(paymentRequest);

  // Trigger finance integration
  triggerFinanceIntegration.paymentRequestApproval(paymentRequest);
};
```

### Method 2: Direct Service Call

Call the integration service directly:

```typescript
import { financeIntegrationService } from '@/features/finance/services/integrationService';

// In your approval handler
const handleExpenseAuthApproval = async (expenseAuth: any) => {
  // Your existing approval logic
  await approveExpenseAuth(expenseAuth);

  // Create journal entries
  const success = await financeIntegrationService.handleExpenseAuthorizationApproval(expenseAuth);
  if (!success) {
    console.error('Failed to create journal entries for expense authorization');
  }
};
```

## Supported Modules

### 1. Payment Requests
- **Event**: `paymentRequestApproved`
- **Data Required**: `id`, `total_amount`, `payment_date`, `payment_reason`, `payment_type`, `project`, `department`
- **Journal Entry**: Creates payable entry based on payment type

### 2. Expense Authorization
- **Event**: `expenseAuthorizationApproved`
- **Data Required**: Full expense authorization object with `travel_fee` breakdown
- **Journal Entry**: Creates accrual entries for each expense type (lodging, meals, transportation, car hire)

### 3. Fund Requests
- **Event**: `fundRequestApproved`
- **Data Required**: Fund request with `activities` array containing cost categories
- **Journal Entry**: Creates budget commitment entries for each activity

### 4. Travel Expense Reports
- **Event**: `travelExpenseReportApproved`
- **Data Required**: TER object with actual expenses
- **Journal Entry**: Reverses accruals and creates actual expense entries

## Account Mappings

Account mappings are configured in `integrationService.ts`:

```typescript
const ACCOUNT_MAPPINGS = [
  {
    module: "PAYMENT_REQUEST",
    transaction_type: "CONSULTANT",
    debit_account: "professional-fees",
    credit_account: "accounts-payable",
    description_template: "Payment to consultant: {description}"
  },
  // ... more mappings
];
```

## Error Handling

The integration system provides error events:

```typescript
// Listen for integration errors
window.addEventListener('financeIntegrationError', (event) => {
  const { module, sourceId, error } = event.detail;
  console.error(`Finance integration failed for ${module}:${sourceId}`, error);

  // Show user notification
  toast.error(`Failed to create journal entry for ${module}`);
});

// Listen for integration success
window.addEventListener('financeIntegrationSuccess', (event) => {
  const { module, sourceId } = event.detail;
  console.log(`Journal entry created for ${module}:${sourceId}`);

  // Show user notification
  toast.success('Journal entry created successfully');
});
```

## Testing Integration

To test integration without affecting real data:

```typescript
// Test payment request integration
const testPaymentRequest = {
  id: 'test-123',
  total_amount: 50000,
  payment_date: '2024-01-15',
  payment_reason: 'Test consultant payment',
  payment_type: 'CONSULTANT',
  project: 'project-456',
  department: 'dept-789'
};

triggerFinanceIntegration.paymentRequestApproval(testPaymentRequest);
```

## Chart of Accounts Requirements

Ensure these accounts exist in your chart of accounts:

### Assets
- `cash-and-equivalents`
- `accounts-receivable`

### Liabilities
- `accounts-payable`
- `accrued-expenses`
- `employee-reimbursement`

### Expenses
- `professional-fees`
- `training-expenses`
- `temporary-staff-costs`
- `travel-accommodation`
- `travel-meals`
- `travel-transportation`
- `vehicle-rental`
- `office-supplies`
- `miscellaneous-expenses`

### Budget Tracking
- `budget-encumbrance-personnel`
- `budget-encumbrance-travel`
- `budget-encumbrance-supplies`
- `purchase-commitments`
- `fund-balance-reserved`

## Customization

To add new account mappings:

1. Add mapping to `ACCOUNT_MAPPINGS` array
2. Create handler method in `FinanceIntegrationService`
3. Add event listener in `registerIntegrationHooks`
4. Add trigger function in `triggerFinanceIntegration`

## Troubleshooting

### Journal Entry Creation Fails
- Check if required accounts exist in chart of accounts
- Verify account mapping configuration
- Check network connectivity for API calls
- Review error logs in browser console

### Integration Not Triggering
- Ensure finance module is initialized
- Check event names match exactly
- Verify data structure includes required fields
- Test with simplified data first

### Account Mapping Issues
- Review account codes in mapping configuration
- Ensure accounts are active in chart of accounts
- Check transaction types match your data
- Verify cost category mappings for fund requests