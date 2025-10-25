// Project Finance Integration Service
// Handles Budget → Obligations → Modifications → Expenses workflow

import { createJournalEntryAPI } from "../controllers/accountingController";
import { JournalEntryFormData } from "../types/accounting.types";
import {
  ProjectBudget,
  ProjectObligation,
  ProjectModification,
  ProjectExpenditure,
  useCreateProjectObligation,
  useCreateProjectModification,
  useCreateProjectExpenditure,
  useApproveProjectObligation,
  useApproveProjectModification,
  useUpdateProjectBudgetStatus
} from "../controllers/projectFinanceController";

// Re-export interfaces from controller
export type {
  ProjectBudget,
  ProjectObligation,
  ProjectModification,
  ProjectExpenditure
} from "../controllers/projectFinanceController";

export interface ProjectWorkflowActivityDetails {
    id: string;
    work_plan_title: string;
    activity_name: string;
    status: string;
    budget_amount: number;
}

export interface ProjectDetails {
    id: string;
    project_id: string;
    title: string;
    budget: number;
    award_amount: number;
}

export interface FinancialSummary {
  project_id: string;
  budget_amount: number;
  award_amount: number;
  total_obligations: number;
  total_expenditures: number;
  available_balance: number;
  uncommitted_balance: number;
  current_month_obligations: number;
  current_month_expenditures: number;
  utilization_percentage: number;
  obligation_percentage: number;
}

export class ProjectFinanceService {

  /**
   * Handle project budget approval - creates initial budget entries
   */
  async handleProjectBudgetApproval(projectBudget: ProjectBudget): Promise<boolean> {
    try {
      console.log(`Setting up budget for project ${projectBudget.project_id}`);

      // Create budget setup entry
      const result = await this.createJournalEntryFromProject(
        "PROJECT_BUDGET_SETUP",
        projectBudget.id,
        {
          id: `budget-${projectBudget.id}`,
          amount: projectBudget.budget,
          date: projectBudget.start_date,
          description: `Initial budget setup for ${projectBudget.title}`,
          project: projectBudget.project_id,
          transaction_type: "BUDGET_SETUP",
        }
      );

      if (result) {
        console.log(`Budget setup completed for project ${projectBudget.project_id}`);
      }

      return result;
    } catch (error) {
      console.error("Failed to handle project budget approval:", error);
      return false;
    }
  }

  /**
   * Handle obligation creation - creates commitment accounting entries
   */
  async handleObligationCreation(obligation: ProjectObligation): Promise<boolean> {
    try {
      console.log(`Creating obligation ${obligation.id} for ${obligation.amount}`);

      // Validate budget availability
      const budgetValidation = await this.validateObligationAgainstBudget(obligation);
      if (!budgetValidation.isValid) {
        console.error(`Obligation validation failed: ${budgetValidation.message}`);
        return false;
      }

      // Create obligation commitment entry
      const result = await this.createJournalEntryFromProject(
        "PROJECT_OBLIGATION",
        obligation.id,
        {
          id: `obligation-${obligation.id}`,
          amount: parseFloat(obligation.amount),
          date: obligation.created_datetime.split('T')[0],
          description: `Obligation: ${obligation.description}`,
          project: obligation.project,
          transaction_type: "OBLIGATION_COMMITMENT",
          work_plan_activity: obligation.work_plan_activity,
        }
      );

      if (result) {
        console.log(`Obligation commitment created for ${obligation.id}`);
      }

      return result;
    } catch (error) {
      console.error("Failed to handle obligation creation:", error);
      return false;
    }
  }

  /**
   * Handle budget modification - updates budget entries
   */
  async handleBudgetModification(modification: ProjectModification): Promise<boolean> {
    try {
      console.log(`Processing budget modification ${modification.modification_number}`);

      const amount = modification.amount_usd ?
        parseFloat(modification.amount_usd) :
        parseFloat(modification.amount_ngn);

      // Create modification entry
      const result = await this.createJournalEntryFromProject(
        "PROJECT_MODIFICATION",
        modification.id,
        {
          id: `modification-${modification.id}`,
          amount: Math.abs(amount),
          date: modification.effective_date,
          description: `Budget modification ${modification.modification_number}: ${modification.reason}`,
          project: modification.grant_id,
          transaction_type: modification.modification_type.toUpperCase(),
          modification_number: modification.modification_number,
        }
      );

      if (result) {
        console.log(`Budget modification processed for ${modification.modification_number}`);
      }

      return result;
    } catch (error) {
      console.error("Failed to handle budget modification:", error);
      return false;
    }
  }

  /**
   * Handle project expenditure - creates actual expense entries and reverses obligations
   */
  async handleProjectExpenditure(expenditure: ProjectExpenditure): Promise<boolean> {
    try {
      console.log(`Processing expenditure ${expenditure.id} for ${expenditure.amount}`);

      const results = [];

      // Step 1: Create actual expense entry
      results.push(await this.createJournalEntryFromProject(
        "PROJECT_EXPENDITURE",
        expenditure.id,
        {
          id: `expenditure-${expenditure.id}`,
          amount: parseFloat(expenditure.amount),
          date: expenditure.date,
          description: `Expenditure: ${expenditure.description}`,
          project: expenditure.project,
          transaction_type: "ACTUAL_EXPENDITURE",
          work_plan_activity: expenditure.work_plan_activity,
        }
      ));

      // Step 2: Find and reverse related obligation if exists
      const obligationReversal = await this.reverseRelatedObligation(expenditure);
      if (obligationReversal) {
        results.push(obligationReversal);
      }

      const allSuccessful = results.every(result => result);

      if (allSuccessful) {
        console.log(`Expenditure processed successfully for ${expenditure.id}`);
      }

      return allSuccessful;
    } catch (error) {
      console.error("Failed to handle project expenditure:", error);
      return false;
    }
  }

  /**
   * Validate obligation against available budget
   */
  private async validateObligationAgainstBudget(obligation: ProjectObligation): Promise<{
    isValid: boolean;
    message: string;
    availableBalance?: number;
    requestedAmount?: number;
  }> {
    try {
      // This would typically query the project's current financial status
      // For now, we'll do basic validation
      const requestedAmount = parseFloat(obligation.amount);

      if (requestedAmount <= 0) {
        return {
          isValid: false,
          message: "Obligation amount must be greater than zero"
        };
      }

      // TODO: Implement actual budget balance check
      // const projectFinancials = await this.getProjectFinancialSummary(obligation.project);
      // if (requestedAmount > projectFinancials.uncommitted_balance) {
      //   return {
      //     isValid: false,
      //     message: `Insufficient budget. Requested: ${requestedAmount}, Available: ${projectFinancials.uncommitted_balance}`,
      //     availableBalance: projectFinancials.uncommitted_balance,
      //     requestedAmount
      //   };
      // }

      return {
        isValid: true,
        message: "Obligation validation successful"
      };
    } catch (error) {
      return {
        isValid: false,
        message: `Validation error: ${error}`
      };
    }
  }

  /**
   * Reverse related obligation when expenditure is recorded
   */
  private async reverseRelatedObligation(expenditure: ProjectExpenditure): Promise<boolean> {
    try {
      // In a real implementation, you would:
      // 1. Find the specific obligation that this expenditure is against
      // 2. Create a reversal entry for the obligation
      // 3. Handle partial vs full obligation reversals

      console.log(`Looking for obligation to reverse for expenditure ${expenditure.id}`);

      // For now, create a generic obligation reversal
      const result = await this.createJournalEntryFromProject(
        "OBLIGATION_REVERSAL",
        expenditure.id,
        {
          id: `obligation-reversal-${expenditure.id}`,
          amount: parseFloat(expenditure.amount),
          date: expenditure.date,
          description: `Obligation reversal for expenditure: ${expenditure.description}`,
          project: expenditure.project,
          transaction_type: "OBLIGATION_REVERSAL",
          work_plan_activity: expenditure.work_plan_activity,
        }
      );

      return result;
    } catch (error) {
      console.error("Failed to reverse related obligation:", error);
      return false;
    }
  }

  /**
   * Create journal entry for project financial transaction
   */
  private async createJournalEntryFromProject(
    module: string,
    sourceId: string,
    transactionData: {
      id: string;
      amount: number;
      date: string;
      description: string;
      project: string;
      transaction_type: string;
      work_plan_activity?: string;
      modification_number?: string;
    }
  ): Promise<boolean> {
    try {
      // Get account mapping for the transaction type
      const mapping = this.getProjectAccountMapping(module, transactionData.transaction_type);
      if (!mapping) {
        console.error(`No account mapping found for ${module}:${transactionData.transaction_type}`);
        return false;
      }

      // Create journal entry data
      const journalEntryData: JournalEntryFormData = {
        entry_date: transactionData.date,
        description: transactionData.description,
        reference_number: transactionData.id,
        line_items: [
          {
            account: mapping.debit_account,
            description: transactionData.description,
            debit_amount: transactionData.amount,
            credit_amount: 0,
            project: transactionData.project,
            department: transactionData.work_plan_activity,
          },
          {
            account: mapping.credit_account,
            description: transactionData.description,
            debit_amount: 0,
            credit_amount: transactionData.amount,
            project: transactionData.project,
            department: transactionData.work_plan_activity,
          }
        ]
      };

      // Create the journal entry
      const result = await createJournalEntryAPI(journalEntryData);

      if (result.success) {
        console.log(`Journal entry created for ${module}:${sourceId}`, {
          journalEntryId: result.data?.id,
          entryNumber: result.data?.entry_number
        });
        return true;
      } else {
        console.error(`Failed to create journal entry: ${result.message}`);
        return false;
      }
    } catch (error) {
      console.error("Failed to create project journal entry:", error);
      return false;
    }
  }

  /**
   * Get account mapping for project transactions
   */
  private getProjectAccountMapping(module: string, transactionType: string): {
    debit_account: string;
    credit_account: string;
    description_template: string;
  } | null {
    const mappings = {
      // Project Budget Setup
      "PROJECT_BUDGET_SETUP": {
        "BUDGET_SETUP": {
          debit_account: "project-budget-authorized",
          credit_account: "fund-balance-available",
          description_template: "Project budget authorization: {description}"
        }
      },

      // Project Obligations
      "PROJECT_OBLIGATION": {
        "OBLIGATION_COMMITMENT": {
          debit_account: "project-obligations",
          credit_account: "fund-balance-committed",
          description_template: "Project obligation commitment: {description}"
        }
      },

      // Budget Modifications
      "PROJECT_MODIFICATION": {
        "INCREASE": {
          debit_account: "project-budget-authorized",
          credit_account: "fund-balance-available",
          description_template: "Budget increase modification: {description}"
        },
        "DECREASE": {
          debit_account: "fund-balance-available",
          credit_account: "project-budget-authorized",
          description_template: "Budget decrease modification: {description}"
        },
        "REALLOCATION": {
          debit_account: "project-budget-reallocation",
          credit_account: "project-budget-reallocation-offset",
          description_template: "Budget reallocation: {description}"
        }
      },

      // Project Expenditures
      "PROJECT_EXPENDITURE": {
        "ACTUAL_EXPENDITURE": {
          debit_account: "project-expenses",
          credit_account: "accounts-payable",
          description_template: "Project expenditure: {description}"
        }
      },

      // Obligation Reversals
      "OBLIGATION_REVERSAL": {
        "OBLIGATION_REVERSAL": {
          debit_account: "fund-balance-committed",
          credit_account: "project-obligations",
          description_template: "Obligation reversal: {description}"
        }
      }
    };

    return mappings[module]?.[transactionType] || null;
  }

  /**
   * Get project financial summary
   */
  async getProjectFinancialSummary(projectId: string): Promise<FinancialSummary | null> {
    try {
      // This would typically aggregate data from multiple sources
      // For now, return a structure showing what should be calculated

      console.log(`Calculating financial summary for project ${projectId}`);

      // TODO: Implement actual calculation by querying:
      // 1. Project budget from projects API
      // 2. Total obligations from obligations API
      // 3. Total expenditures from expenditures API
      // 4. Current month data

      return {
        project_id: projectId,
        budget_amount: 0,
        award_amount: 0,
        total_obligations: 0,
        total_expenditures: 0,
        available_balance: 0, // budget - expenditures
        uncommitted_balance: 0, // budget - obligations
        current_month_obligations: 0,
        current_month_expenditures: 0,
        utilization_percentage: 0, // (expenditures / budget) * 100
        obligation_percentage: 0, // (obligations / budget) * 100
      };
    } catch (error) {
      console.error("Failed to get project financial summary:", error);
      return null;
    }
  }

  /**
   * Get integration statistics for project finance dashboard
   */
  getProjectFinanceStats() {
    return {
      modules_integrated: [
        "PROJECT_BUDGET",
        "PROJECT_OBLIGATIONS",
        "PROJECT_MODIFICATIONS",
        "PROJECT_EXPENDITURES"
      ],
      workflow_stages: [
        "Budget Setup",
        "Obligation Creation",
        "Budget Modifications",
        "Expenditure Recording"
      ],
      accounting_integration: true,
      real_time_tracking: true,
    };
  }
}

// Export singleton instance
export const projectFinanceService = new ProjectFinanceService();

// Helper functions for triggering project finance events
export const triggerProjectFinanceIntegration = {
  budgetApproval: (projectBudget: ProjectBudget) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('projectBudgetApproved', {
        detail: projectBudget
      }));
    }
  },

  obligationCreation: (obligation: ProjectObligation) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('projectObligationCreated', {
        detail: obligation
      }));
    }
  },

  budgetModification: (modification: ProjectModification) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('projectBudgetModified', {
        detail: modification
      }));
    }
  },

  expenditureRecording: (expenditure: ProjectExpenditure) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('projectExpenditureRecorded', {
        detail: expenditure
      }));
    }
  }
};

export default ProjectFinanceService;