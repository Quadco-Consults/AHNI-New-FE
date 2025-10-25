// Finance Integration Service
// Connects admin modules (Payment Request, Expense Auth, etc.) to Finance/Accounting

import { JournalEntryFormData } from "../types/accounting.types";
import { useCreateJournalEntry } from "../controllers/accountingController";

export interface TransactionData {
  id: string;
  amount: number;
  date: string;
  description: string;
  project?: string;
  department?: string;
  cost_category?: string;
  payment_type?: string;
  expense_type?: string;
  custom_expense_account?: string; // Override default account mapping
  [key: string]: any;
}

export interface AccountMapping {
  module: string;
  transaction_type: string;
  cost_category?: string;
  debit_account: string;
  credit_account: string;
  description_template: string;
}

// Account mapping configuration
export const ACCOUNT_MAPPINGS: AccountMapping[] = [
  // Payment Request Mappings
  {
    module: "PAYMENT_REQUEST",
    transaction_type: "CONSULTANT",
    debit_account: "professional-fees",
    credit_account: "accounts-payable",
    description_template: "Payment to consultant: {description}"
  },
  {
    module: "PAYMENT_REQUEST",
    transaction_type: "FACILITATOR",
    debit_account: "training-expenses",
    credit_account: "accounts-payable",
    description_template: "Payment to facilitator: {description}"
  },
  {
    module: "PAYMENT_REQUEST",
    transaction_type: "ADHOC_STAFF",
    debit_account: "temporary-staff-costs",
    credit_account: "accounts-payable",
    description_template: "Payment to adhoc staff: {description}"
  },
  {
    module: "PAYMENT_REQUEST",
    transaction_type: "PURCHASE_ORDER",
    debit_account: "office-supplies", // Default, should be mapped per PO
    credit_account: "accounts-payable",
    description_template: "Payment for purchase order: {description}"
  },
  {
    module: "PAYMENT_REQUEST",
    transaction_type: "OTHER",
    debit_account: "miscellaneous-expenses",
    credit_account: "accounts-payable",
    description_template: "Payment: {description}"
  },

  // Expense Authorization Mappings (Accruals)
  {
    module: "EXPENSE_AUTHORIZATION",
    transaction_type: "LODGING",
    debit_account: "travel-accommodation",
    credit_account: "accrued-expenses",
    description_template: "Travel accommodation authorization: {description}"
  },
  {
    module: "EXPENSE_AUTHORIZATION",
    transaction_type: "MEALS",
    debit_account: "travel-meals",
    credit_account: "accrued-expenses",
    description_template: "Travel meals authorization: {description}"
  },
  {
    module: "EXPENSE_AUTHORIZATION",
    transaction_type: "TRANSPORTATION",
    debit_account: "travel-transportation",
    credit_account: "accrued-expenses",
    description_template: "Travel transportation authorization: {description}"
  },
  {
    module: "EXPENSE_AUTHORIZATION",
    transaction_type: "CAR_HIRE",
    debit_account: "vehicle-rental",
    credit_account: "accrued-expenses",
    description_template: "Vehicle rental authorization: {description}"
  },

  // Travel Expense Report Mappings (Actuals)
  {
    module: "TRAVEL_EXPENSE_REPORT",
    transaction_type: "LODGING_ACTUAL",
    debit_account: "travel-accommodation",
    credit_account: "employee-reimbursement",
    description_template: "Actual travel accommodation: {description}"
  },
  {
    module: "TRAVEL_EXPENSE_REPORT",
    transaction_type: "MEALS_ACTUAL",
    debit_account: "travel-meals",
    credit_account: "employee-reimbursement",
    description_template: "Actual travel meals: {description}"
  },

  // TER Accrual Reversal Mappings
  {
    module: "TER_ACCRUAL_REVERSAL",
    transaction_type: "LODGING_REVERSAL",
    debit_account: "accrued-expenses",
    credit_account: "travel-accommodation",
    description_template: "Reversal of lodging accrual: {description}"
  },
  {
    module: "TER_ACCRUAL_REVERSAL",
    transaction_type: "MEALS_REVERSAL",
    debit_account: "accrued-expenses",
    credit_account: "travel-meals",
    description_template: "Reversal of meals accrual: {description}"
  },
  {
    module: "TER_ACCRUAL_REVERSAL",
    transaction_type: "TRANSPORTATION_REVERSAL",
    debit_account: "accrued-expenses",
    credit_account: "travel-transportation",
    description_template: "Reversal of transportation accrual: {description}"
  },
  {
    module: "TER_ACCRUAL_REVERSAL",
    transaction_type: "CAR_HIRE_REVERSAL",
    debit_account: "accrued-expenses",
    credit_account: "vehicle-rental",
    description_template: "Reversal of car hire accrual: {description}"
  },

  // TER Actual Expense Mappings
  {
    module: "TER_ACTUAL_EXPENSE",
    transaction_type: "TAXI_ACTUAL",
    debit_account: "travel-transportation",
    credit_account: "employee-reimbursement",
    description_template: "Actual taxi expense: {description}"
  },
  {
    module: "TER_ACTUAL_EXPENSE",
    transaction_type: "REGISTRATION_ACTUAL",
    debit_account: "conference-fees",
    credit_account: "employee-reimbursement",
    description_template: "Registration fee: {description}"
  },
  {
    module: "TER_ACTUAL_EXPENSE",
    transaction_type: "INTERCITY_TAXI_ACTUAL",
    debit_account: "travel-transportation",
    credit_account: "employee-reimbursement",
    description_template: "Inter-city taxi: {description}"
  },
  {
    module: "TER_ACTUAL_EXPENSE",
    transaction_type: "OTHER_ACTUAL",
    debit_account: "miscellaneous-travel-expenses",
    credit_account: "employee-reimbursement",
    description_template: "Other travel expenses: {description}"
  },

  // TER Reimbursement Mappings
  {
    module: "TER_REIMBURSEMENT",
    transaction_type: "EMPLOYEE_REIMBURSEMENT",
    debit_account: "employee-reimbursement",
    credit_account: "accounts-payable",
    description_template: "Employee reimbursement: {description}"
  },

  // Fund Request Mappings (Budget Commitments)
  {
    module: "FUND_REQUEST",
    transaction_type: "PERSONNEL",
    cost_category: "Personnel",
    debit_account: "budget-encumbrance-personnel",
    credit_account: "fund-balance-reserved",
    description_template: "Budget commitment - Personnel: {description}"
  },
  {
    module: "FUND_REQUEST",
    transaction_type: "TRAVEL",
    cost_category: "Travel",
    debit_account: "budget-encumbrance-travel",
    credit_account: "fund-balance-reserved",
    description_template: "Budget commitment - Travel: {description}"
  },
  {
    module: "FUND_REQUEST",
    transaction_type: "SUPPLIES",
    cost_category: "Supplies",
    debit_account: "budget-encumbrance-supplies",
    credit_account: "fund-balance-reserved",
    description_template: "Budget commitment - Supplies: {description}"
  },

  // Purchase Order Mappings (Commitments)
  {
    module: "PURCHASE_ORDER",
    transaction_type: "COMMITMENT",
    debit_account: "purchase-commitments",
    credit_account: "fund-balance-reserved",
    description_template: "Purchase order commitment: {description}"
  },

  // Budget Encumbrance Mappings
  {
    module: "BUDGET_ENCUMBRANCE",
    transaction_type: "ENCUMBRANCE",
    debit_account: "budget-encumbrance",
    credit_account: "fund-balance-committed",
    description_template: "Budget encumbrance: {description}"
  },
];

export class FinanceIntegrationService {

  /**
   * Get account mapping for a specific transaction
   */
  getAccountMapping(
    module: string,
    transactionType: string,
    costCategory?: string
  ): AccountMapping | null {
    return ACCOUNT_MAPPINGS.find(mapping =>
      mapping.module === module &&
      mapping.transaction_type === transactionType &&
      (!mapping.cost_category || mapping.cost_category === costCategory)
    ) || null;
  }

  /**
   * Create journal entry from transaction data
   */
  async createJournalEntryFromTransaction(
    sourceModule: string,
    sourceTransactionId: string,
    transactionData: TransactionData
  ): Promise<boolean> {
    try {
      const mapping = this.getAccountMapping(
        sourceModule,
        transactionData.payment_type || transactionData.expense_type || "OTHER",
        transactionData.cost_category
      );

      if (!mapping) {
        console.error(`No account mapping found for ${sourceModule}:${transactionData.payment_type}`);
        return false;
      }

      // Format description using template
      const description = mapping.description_template.replace(
        /\{(\w+)\}/g,
        (_, key) => transactionData[key] || key
      );

      // Use custom expense account if provided, otherwise use mapping
      const debitAccount = transactionData.custom_expense_account || mapping.debit_account;

      // Create journal entry data
      const journalEntryData: JournalEntryFormData = {
        entry_date: transactionData.date,
        description: description,
        reference_number: transactionData.id,
        line_items: [
          {
            account: debitAccount,
            description: description,
            debit_amount: transactionData.amount,
            credit_amount: 0,
            project: transactionData.project,
            department: transactionData.department,
          },
          {
            account: mapping.credit_account,
            description: description,
            debit_amount: 0,
            credit_amount: transactionData.amount,
            project: transactionData.project,
            department: transactionData.department,
          }
        ]
      };

      // Create the journal entry via the API
      try {
        // Import the API function dynamically to avoid circular dependencies
        const { createJournalEntryAPI } = await import('../controllers/accountingController');

        const result = await createJournalEntryAPI(journalEntryData);

        if (result.success) {
          console.log(`Journal entry created successfully for ${sourceModule}:${sourceTransactionId}`, {
            journalEntryId: result.data?.id,
            entryNumber: result.data?.entry_number
          });
          return true;
        } else {
          console.error(`Failed to create journal entry: ${result.message}`);
          return false;
        }
      } catch (apiError) {
        console.error("API call failed:", apiError);
        return false;
      }
    } catch (error) {
      console.error("Failed to create journal entry from transaction:", error);
      return false;
    }
  }

  /**
   * Handle Payment Request approval
   */
  async handlePaymentRequestApproval(paymentRequest: any): Promise<boolean> {
    try {
      // Create separate journal entries for each payment item
      const results = [];

      for (const item of paymentRequest.payment_items || []) {
        const result = await this.createJournalEntryFromTransaction(
          "PAYMENT_REQUEST",
          paymentRequest.id,
          {
            id: `${paymentRequest.id}-${item.id}`,
            amount: parseFloat(item.amount_in_figures),
            date: paymentRequest.payment_date,
            description: `${paymentRequest.payment_reason} - Payment to ${item.payment_to}`,
            payment_type: paymentRequest.payment_type,
            project: item.project,
            department: item.department,
            cost_category: item.cost_center,
            // Use custom expense account if specified
            custom_expense_account: item.expense_account,
          }
        );
        results.push(result);
      }

      return results.every(result => result);
    } catch (error) {
      console.error("Failed to handle payment request approval:", error);
      return false;
    }
  }

  /**
   * Handle Expense Authorization approval
   */
  async handleExpenseAuthorizationApproval(expenseAuth: any): Promise<boolean> {
    try {
      // Create separate entries for each expense type
      const results = [];

      // Lodging
      if (expenseAuth.travel_fee?.lodging > 0) {
        results.push(await this.createJournalEntryFromTransaction(
          "EXPENSE_AUTHORIZATION",
          expenseAuth.id,
          {
            id: `${expenseAuth.id}-lodging`,
            amount: expenseAuth.travel_fee.lodging,
            date: expenseAuth.created_at.split('T')[0],
            description: `${expenseAuth.ta_number} - Lodging`,
            expense_type: "LODGING",
            project: expenseAuth.project?.id,
            department: expenseAuth.department?.id,
          }
        ));
      }

      // Meals
      if (expenseAuth.travel_fee?.meals > 0) {
        results.push(await this.createJournalEntryFromTransaction(
          "EXPENSE_AUTHORIZATION",
          expenseAuth.id,
          {
            id: `${expenseAuth.id}-meals`,
            amount: expenseAuth.travel_fee.meals,
            date: expenseAuth.created_at.split('T')[0],
            description: `${expenseAuth.ta_number} - Meals`,
            expense_type: "MEALS",
            project: expenseAuth.project?.id,
            department: expenseAuth.department?.id,
          }
        ));
      }

      // Transportation
      const transportTotal = (expenseAuth.travel_fee?.interstate || 0) +
                           (expenseAuth.travel_fee?.airport_taxi || 0);
      if (transportTotal > 0) {
        results.push(await this.createJournalEntryFromTransaction(
          "EXPENSE_AUTHORIZATION",
          expenseAuth.id,
          {
            id: `${expenseAuth.id}-transport`,
            amount: transportTotal,
            date: expenseAuth.created_at.split('T')[0],
            description: `${expenseAuth.ta_number} - Transportation`,
            expense_type: "TRANSPORTATION",
            project: expenseAuth.project?.id,
            department: expenseAuth.department?.id,
          }
        ));
      }

      // Car Hire
      if (expenseAuth.travel_fee?.car_hire > 0) {
        results.push(await this.createJournalEntryFromTransaction(
          "EXPENSE_AUTHORIZATION",
          expenseAuth.id,
          {
            id: `${expenseAuth.id}-car-hire`,
            amount: expenseAuth.travel_fee.car_hire,
            date: expenseAuth.created_at.split('T')[0],
            description: `${expenseAuth.ta_number} - Car Hire`,
            expense_type: "CAR_HIRE",
            project: expenseAuth.project?.id,
            department: expenseAuth.department?.id,
          }
        ));
      }

      return results.every(result => result);
    } catch (error) {
      console.error("Failed to handle expense authorization approval:", error);
      return false;
    }
  }

  /**
   * Handle Travel Expense Report approval
   */
  async handleTravelExpenseReportApproval(ter: any): Promise<boolean> {
    try {
      // Step 1: Find linked Expense Authorization
      const linkedEA = await this.findLinkedExpenseAuthorization(ter);
      if (!linkedEA) {
        console.warn(`No linked Expense Authorization found for TER ${ter.id}`);
        // Create entries for TER without EA reconciliation
        return await this.createTEREntriesWithoutEA(ter);
      }

      console.log(`Processing TER ${ter.id} against EA ${linkedEA.id}`);

      // Step 2: Reverse accrual entries from EA
      const reversalResults = await this.reverseExpenseAuthorizationAccruals(linkedEA);

      // Step 3: Create actual expense entries from TER
      const actualResults = await this.createActualExpenseEntries(ter, linkedEA);

      // Step 4: Handle variances and create reimbursement entries
      const reimbursementResults = await this.createReimbursementEntries(ter, linkedEA);

      // All steps must succeed
      return reversalResults && actualResults && reimbursementResults;

    } catch (error) {
      console.error("Failed to handle TER approval:", error);
      return false;
    }
  }

  /**
   * Find linked Expense Authorization for a TER
   */
  private async findLinkedExpenseAuthorization(ter: any): Promise<any | null> {
    try {
      // TER might have direct reference to EA
      if (ter.expense_authorization) {
        return ter.expense_authorization;
      }

      // Or find by matching criteria (same user, overlapping dates, etc.)
      // This would require an API call to search for EAs
      console.log("Searching for linked EA by criteria...");

      // For now, return null - implement actual search logic here
      return null;
    } catch (error) {
      console.error("Failed to find linked EA:", error);
      return null;
    }
  }

  /**
   * Reverse accrual entries created from Expense Authorization
   */
  private async reverseExpenseAuthorizationAccruals(ea: any): Promise<boolean> {
    try {
      console.log(`Reversing accrual entries for EA ${ea.id}`);

      // Create reversal entries for each expense type that was accrued
      const results = [];

      if (ea.travel_fee?.lodging > 0) {
        results.push(await this.createJournalEntryFromTransaction(
          "TER_ACCRUAL_REVERSAL",
          ea.id,
          {
            id: `${ea.id}-lodging-reversal`,
            amount: parseFloat(ea.travel_fee.lodging),
            date: new Date().toISOString().split('T')[0],
            description: `Reversal of lodging accrual for EA ${ea.ta_number}`,
            expense_type: "LODGING_REVERSAL",
          }
        ));
      }

      if (ea.travel_fee?.meals > 0) {
        results.push(await this.createJournalEntryFromTransaction(
          "TER_ACCRUAL_REVERSAL",
          ea.id,
          {
            id: `${ea.id}-meals-reversal`,
            amount: parseFloat(ea.travel_fee.meals),
            date: new Date().toISOString().split('T')[0],
            description: `Reversal of meals accrual for EA ${ea.ta_number}`,
            expense_type: "MEALS_REVERSAL",
          }
        ));
      }

      const transportTotal = (parseFloat(ea.travel_fee?.interstate || "0") +
                             parseFloat(ea.travel_fee?.airport_taxi || "0"));
      if (transportTotal > 0) {
        results.push(await this.createJournalEntryFromTransaction(
          "TER_ACCRUAL_REVERSAL",
          ea.id,
          {
            id: `${ea.id}-transport-reversal`,
            amount: transportTotal,
            date: new Date().toISOString().split('T')[0],
            description: `Reversal of transportation accrual for EA ${ea.ta_number}`,
            expense_type: "TRANSPORTATION_REVERSAL",
          }
        ));
      }

      if (ea.travel_fee?.car_hire > 0) {
        results.push(await this.createJournalEntryFromTransaction(
          "TER_ACCRUAL_REVERSAL",
          ea.id,
          {
            id: `${ea.id}-car-hire-reversal`,
            amount: parseFloat(ea.travel_fee.car_hire),
            date: new Date().toISOString().split('T')[0],
            description: `Reversal of car hire accrual for EA ${ea.ta_number}`,
            expense_type: "CAR_HIRE_REVERSAL",
          }
        ));
      }

      return results.every(result => result);
    } catch (error) {
      console.error("Failed to reverse accrual entries:", error);
      return false;
    }
  }

  /**
   * Create actual expense entries from TER
   */
  private async createActualExpenseEntries(ter: any, linkedEA?: any): Promise<boolean> {
    try {
      console.log(`Creating actual expense entries for TER ${ter.id}`);

      const results = [];

      // Process activities from TER (can be single traveler or multiple travelers)
      const activities = ter.activities || [];
      const travelers = ter.travelers || [];

      // Handle single traveler activities
      for (const activity of activities) {
        if (activity.airport_taxi_fee && parseFloat(activity.airport_taxi_fee) > 0) {
          results.push(await this.createJournalEntryFromTransaction(
            "TER_ACTUAL_EXPENSE",
            ter.id,
            {
              id: `${ter.id}-${activity.id}-taxi`,
              amount: parseFloat(activity.airport_taxi_fee),
              date: activity.date,
              description: `Actual taxi expense - ${activity.activity}`,
              expense_type: "TAXI_ACTUAL",
              project: linkedEA?.project?.id,
              department: linkedEA?.department?.id,
            }
          ));
        }

        if (activity.registration_fee && parseFloat(activity.registration_fee) > 0) {
          results.push(await this.createJournalEntryFromTransaction(
            "TER_ACTUAL_EXPENSE",
            ter.id,
            {
              id: `${ter.id}-${activity.id}-registration`,
              amount: parseFloat(activity.registration_fee),
              date: activity.date,
              description: `Registration fee - ${activity.activity}`,
              expense_type: "REGISTRATION_ACTUAL",
              project: linkedEA?.project?.id,
              department: linkedEA?.department?.id,
            }
          ));
        }

        if (activity.inter_city_taxi_fee && parseFloat(activity.inter_city_taxi_fee) > 0) {
          results.push(await this.createJournalEntryFromTransaction(
            "TER_ACTUAL_EXPENSE",
            ter.id,
            {
              id: `${ter.id}-${activity.id}-intercity`,
              amount: parseFloat(activity.inter_city_taxi_fee),
              date: activity.date,
              description: `Inter-city taxi - ${activity.activity}`,
              expense_type: "INTERCITY_TAXI_ACTUAL",
              project: linkedEA?.project?.id,
              department: linkedEA?.department?.id,
            }
          ));
        }

        if (activity.others && parseFloat(activity.others) > 0) {
          results.push(await this.createJournalEntryFromTransaction(
            "TER_ACTUAL_EXPENSE",
            ter.id,
            {
              id: `${ter.id}-${activity.id}-others`,
              amount: parseFloat(activity.others),
              date: activity.date,
              description: `Other expenses - ${activity.activity}`,
              expense_type: "OTHER_ACTUAL",
              project: linkedEA?.project?.id,
              department: linkedEA?.department?.id,
            }
          ));
        }
      }

      // Handle multiple travelers (similar logic but iterate through travelers)
      for (const traveler of travelers) {
        for (const activity of traveler.activities || []) {
          // Same processing as above for each traveler's activities
          // Implementation would be similar to single traveler logic
        }
      }

      return results.every(result => result);
    } catch (error) {
      console.error("Failed to create actual expense entries:", error);
      return false;
    }
  }

  /**
   * Create reimbursement entries for employee out-of-pocket expenses
   */
  private async createReimbursementEntries(ter: any, linkedEA?: any): Promise<boolean> {
    try {
      console.log(`Creating reimbursement entries for TER ${ter.id}`);

      // Calculate total reimbursable amount from TER
      let totalReimbursement = 0;

      const activities = ter.activities || [];
      for (const activity of activities) {
        totalReimbursement += parseFloat(activity.airport_taxi_fee || "0");
        totalReimbursement += parseFloat(activity.registration_fee || "0");
        totalReimbursement += parseFloat(activity.inter_city_taxi_fee || "0");
        totalReimbursement += parseFloat(activity.others || "0");
      }

      // Add traveler expenses if multiple travelers
      const travelers = ter.travelers || [];
      for (const traveler of travelers) {
        for (const activity of traveler.activities || []) {
          totalReimbursement += parseFloat(activity.airport_taxi_fee || "0");
          totalReimbursement += parseFloat(activity.registration_fee || "0");
          totalReimbursement += parseFloat(activity.inter_city_taxi_fee || "0");
          totalReimbursement += parseFloat(activity.others || "0");
        }
      }

      if (totalReimbursement > 0) {
        return await this.createJournalEntryFromTransaction(
          "TER_REIMBURSEMENT",
          ter.id,
          {
            id: `${ter.id}-reimbursement`,
            amount: totalReimbursement,
            date: new Date().toISOString().split('T')[0],
            description: `Employee reimbursement for TER ${ter.id}`,
            expense_type: "EMPLOYEE_REIMBURSEMENT",
            project: linkedEA?.project?.id,
            department: linkedEA?.department?.id,
          }
        );
      }

      return true;
    } catch (error) {
      console.error("Failed to create reimbursement entries:", error);
      return false;
    }
  }

  /**
   * Create TER entries when no linked EA exists
   */
  private async createTEREntriesWithoutEA(ter: any): Promise<boolean> {
    try {
      console.log(`Creating TER entries without EA for ${ter.id}`);

      // Simply create expense entries and reimbursement without reversal
      const actualResults = await this.createActualExpenseEntries(ter);
      const reimbursementResults = await this.createReimbursementEntries(ter);

      return actualResults && reimbursementResults;
    } catch (error) {
      console.error("Failed to create TER entries without EA:", error);
      return false;
    }
  }

  /**
   * Handle Fund Request approval with budget tracking
   */
  async handleFundRequestApproval(fundRequest: any): Promise<boolean> {
    try {
      console.log(`Processing Fund Request ${fundRequest.id} with budget tracking`);

      // Step 1: Validate budget availability
      const budgetValidation = await this.validateBudgetAvailability(fundRequest);
      if (!budgetValidation.isValid) {
        console.error(`Budget validation failed: ${budgetValidation.message}`);
        return false;
      }

      // Step 2: Create budget encumbrance entries for each activity
      const encumbranceResults = [];
      for (const activity of fundRequest.activities || []) {
        const result = await this.createBudgetEncumbranceEntry(fundRequest, activity);
        encumbranceResults.push(result);
      }

      // Step 3: Update budget tracking records
      const trackingResult = await this.updateBudgetTracking(fundRequest);

      // Step 4: Create commitment accounting entries
      const commitmentResults = [];
      for (const activity of fundRequest.activities || []) {
        commitmentResults.push(await this.createJournalEntryFromTransaction(
          "FUND_REQUEST",
          fundRequest.id,
          {
            id: `${fundRequest.id}-${activity.id}`,
            amount: parseFloat(activity.amount),
            date: fundRequest.created_datetime?.split('T')[0] || new Date().toISOString().split('T')[0],
            description: activity.activity_description,
            transaction_type: this.getCostCategoryTransactionType(activity.category),
            cost_category: activity.category?.name,
            project: fundRequest.project?.id,
            department: fundRequest.location?.id, // Use location as department
          }
        ));
      }

      // All steps must succeed for budget tracking integrity
      const allSuccessful = encumbranceResults.every(r => r) &&
                          trackingResult &&
                          commitmentResults.every(r => r);

      if (allSuccessful) {
        console.log(`Fund Request ${fundRequest.id} processed successfully with budget tracking`);
      }

      return allSuccessful;
    } catch (error) {
      console.error("Failed to handle fund request approval:", error);
      return false;
    }
  }

  /**
   * Validate budget availability for fund request
   */
  private async validateBudgetAvailability(fundRequest: any): Promise<{
    isValid: boolean;
    message: string;
    availableBalance?: number;
    requestedAmount?: number;
  }> {
    try {
      const requestedAmount = parseFloat(fundRequest.total_amount);
      const availableBalance = parseFloat(fundRequest.available_balance || "0");

      if (requestedAmount > availableBalance) {
        return {
          isValid: false,
          message: `Insufficient budget. Requested: ${requestedAmount}, Available: ${availableBalance}`,
          availableBalance,
          requestedAmount
        };
      }

      return {
        isValid: true,
        message: "Budget validation successful",
        availableBalance,
        requestedAmount
      };
    } catch (error) {
      return {
        isValid: false,
        message: `Budget validation error: ${error}`
      };
    }
  }

  /**
   * Create budget encumbrance entry for activity
   */
  private async createBudgetEncumbranceEntry(fundRequest: any, activity: any): Promise<boolean> {
    try {
      return await this.createJournalEntryFromTransaction(
        "BUDGET_ENCUMBRANCE",
        fundRequest.id,
        {
          id: `${fundRequest.id}-${activity.id}-encumbrance`,
          amount: parseFloat(activity.amount),
          date: fundRequest.created_datetime?.split('T')[0] || new Date().toISOString().split('T')[0],
          description: `Budget encumbrance: ${activity.activity_description}`,
          transaction_type: "ENCUMBRANCE",
          cost_category: activity.category?.name,
          project: fundRequest.project?.id,
          department: fundRequest.location?.id,
        }
      );
    } catch (error) {
      console.error("Failed to create budget encumbrance:", error);
      return false;
    }
  }

  /**
   * Update budget tracking records
   */
  private async updateBudgetTracking(fundRequest: any): Promise<boolean> {
    try {
      // This would typically update a budget tracking table/API
      // For now, we'll log the budget update
      console.log(`Budget tracking updated for project ${fundRequest.project?.id}:`);
      console.log(`- Fund Request: ${fundRequest.id}`);
      console.log(`- Amount Committed: ${fundRequest.total_amount}`);
      console.log(`- Remaining Balance: ${parseFloat(fundRequest.available_balance) - parseFloat(fundRequest.total_amount)}`);

      // TODO: Implement actual budget tracking API call
      // await updateProjectBudgetTracking({
      //   projectId: fundRequest.project?.id,
      //   fundRequestId: fundRequest.id,
      //   committedAmount: fundRequest.total_amount,
      //   activities: fundRequest.activities
      // });

      return true;
    } catch (error) {
      console.error("Failed to update budget tracking:", error);
      return false;
    }
  }

  /**
   * Get transaction type based on cost category
   */
  private getCostCategoryTransactionType(category: any): string {
    if (!category) return "OTHER";

    const categoryName = category.name?.toUpperCase() || category.toUpperCase();

    // Map cost categories to transaction types
    const categoryMapping = {
      "PERSONNEL": "PERSONNEL",
      "TRAVEL": "TRAVEL",
      "SUPPLIES": "SUPPLIES",
      "EQUIPMENT": "EQUIPMENT",
      "CONTRACTUAL": "CONTRACTUAL",
      "OTHER": "OTHER"
    };

    return categoryMapping[categoryName] || "OTHER";
  }

  /**
   * Get integration statistics for dashboard
   */
  getIntegrationStats() {
    return {
      modules_integrated: ["PAYMENT_REQUEST", "EXPENSE_AUTHORIZATION", "FUND_REQUEST"],
      modules_pending: ["TRAVEL_EXPENSE_REPORT", "PURCHASE_ORDER"],
      total_mappings: ACCOUNT_MAPPINGS.length,
      auto_posting_enabled: true,
    };
  }
}

// Export singleton instance
export const financeIntegrationService = new FinanceIntegrationService();

// Import project finance service
import { projectFinanceService } from './projectFinanceService';

// Helper function to register integration hooks
export const registerIntegrationHooks = () => {
  // Register window-level event listeners for admin module integrations
  if (typeof window !== 'undefined') {
    // Payment Request Approval Hook
    window.addEventListener('paymentRequestApproved', async (event: any) => {
      const paymentRequest = event.detail;
      try {
        const success = await financeIntegrationService.handlePaymentRequestApproval(paymentRequest);
        if (success) {
          console.log(`Journal entry created for Payment Request ${paymentRequest.id}`);
          // Optionally dispatch success event
          window.dispatchEvent(new CustomEvent('financeIntegrationSuccess', {
            detail: { module: 'PAYMENT_REQUEST', sourceId: paymentRequest.id }
          }));
        }
      } catch (error) {
        console.error('Payment Request integration failed:', error);
        window.dispatchEvent(new CustomEvent('financeIntegrationError', {
          detail: { module: 'PAYMENT_REQUEST', sourceId: paymentRequest.id, error }
        }));
      }
    });

    // Expense Authorization Approval Hook
    window.addEventListener('expenseAuthorizationApproved', async (event: any) => {
      const expenseAuth = event.detail;
      try {
        const success = await financeIntegrationService.handleExpenseAuthorizationApproval(expenseAuth);
        if (success) {
          console.log(`Journal entries created for Expense Authorization ${expenseAuth.id}`);
          window.dispatchEvent(new CustomEvent('financeIntegrationSuccess', {
            detail: { module: 'EXPENSE_AUTHORIZATION', sourceId: expenseAuth.id }
          }));
        }
      } catch (error) {
        console.error('Expense Authorization integration failed:', error);
        window.dispatchEvent(new CustomEvent('financeIntegrationError', {
          detail: { module: 'EXPENSE_AUTHORIZATION', sourceId: expenseAuth.id, error }
        }));
      }
    });

    // Fund Request Approval Hook
    window.addEventListener('fundRequestApproved', async (event: any) => {
      const fundRequest = event.detail;
      try {
        const success = await financeIntegrationService.handleFundRequestApproval(fundRequest);
        if (success) {
          console.log(`Budget commitment entries created for Fund Request ${fundRequest.id}`);
          window.dispatchEvent(new CustomEvent('financeIntegrationSuccess', {
            detail: { module: 'FUND_REQUEST', sourceId: fundRequest.id }
          }));
        }
      } catch (error) {
        console.error('Fund Request integration failed:', error);
        window.dispatchEvent(new CustomEvent('financeIntegrationError', {
          detail: { module: 'FUND_REQUEST', sourceId: fundRequest.id, error }
        }));
      }
    });

    // Travel Expense Report Approval Hook
    window.addEventListener('travelExpenseReportApproved', async (event: any) => {
      const ter = event.detail;
      try {
        const success = await financeIntegrationService.handleTravelExpenseReportApproval(ter);
        if (success) {
          console.log(`TER reconciliation completed for ${ter.id}`);
          window.dispatchEvent(new CustomEvent('financeIntegrationSuccess', {
            detail: { module: 'TRAVEL_EXPENSE_REPORT', sourceId: ter.id }
          }));
        }
      } catch (error) {
        console.error('TER integration failed:', error);
        window.dispatchEvent(new CustomEvent('financeIntegrationError', {
          detail: { module: 'TRAVEL_EXPENSE_REPORT', sourceId: ter.id, error }
        }));
      }
    });

    // Project Finance Integration Hooks

    // Project Budget Approval Hook
    window.addEventListener('projectBudgetApproved', async (event: any) => {
      const projectBudget = event.detail;
      try {
        const success = await projectFinanceService.handleProjectBudgetApproval(projectBudget);
        if (success) {
          console.log(`Project budget setup completed for ${projectBudget.project_id}`);
          window.dispatchEvent(new CustomEvent('financeIntegrationSuccess', {
            detail: { module: 'PROJECT_BUDGET', sourceId: projectBudget.id }
          }));
        }
      } catch (error) {
        console.error('Project budget integration failed:', error);
        window.dispatchEvent(new CustomEvent('financeIntegrationError', {
          detail: { module: 'PROJECT_BUDGET', sourceId: projectBudget.id, error }
        }));
      }
    });

    // Project Obligation Creation Hook
    window.addEventListener('projectObligationCreated', async (event: any) => {
      const obligation = event.detail;
      try {
        const success = await projectFinanceService.handleObligationCreation(obligation);
        if (success) {
          console.log(`Obligation commitment created for ${obligation.id}`);
          window.dispatchEvent(new CustomEvent('financeIntegrationSuccess', {
            detail: { module: 'PROJECT_OBLIGATION', sourceId: obligation.id }
          }));
        }
      } catch (error) {
        console.error('Project obligation integration failed:', error);
        window.dispatchEvent(new CustomEvent('financeIntegrationError', {
          detail: { module: 'PROJECT_OBLIGATION', sourceId: obligation.id, error }
        }));
      }
    });

    // Project Budget Modification Hook
    window.addEventListener('projectBudgetModified', async (event: any) => {
      const modification = event.detail;
      try {
        const success = await projectFinanceService.handleBudgetModification(modification);
        if (success) {
          console.log(`Budget modification processed for ${modification.modification_number}`);
          window.dispatchEvent(new CustomEvent('financeIntegrationSuccess', {
            detail: { module: 'PROJECT_MODIFICATION', sourceId: modification.id }
          }));
        }
      } catch (error) {
        console.error('Project modification integration failed:', error);
        window.dispatchEvent(new CustomEvent('financeIntegrationError', {
          detail: { module: 'PROJECT_MODIFICATION', sourceId: modification.id, error }
        }));
      }
    });

    // Project Expenditure Recording Hook
    window.addEventListener('projectExpenditureRecorded', async (event: any) => {
      const expenditure = event.detail;
      try {
        const success = await projectFinanceService.handleProjectExpenditure(expenditure);
        if (success) {
          console.log(`Project expenditure processed for ${expenditure.id}`);
          window.dispatchEvent(new CustomEvent('financeIntegrationSuccess', {
            detail: { module: 'PROJECT_EXPENDITURE', sourceId: expenditure.id }
          }));
        }
      } catch (error) {
        console.error('Project expenditure integration failed:', error);
        window.dispatchEvent(new CustomEvent('financeIntegrationError', {
          detail: { module: 'PROJECT_EXPENDITURE', sourceId: expenditure.id, error }
        }));
      }
    });

    console.log("Finance integration hooks registered (including project finance)");
  }
};

export default FinanceIntegrationService;