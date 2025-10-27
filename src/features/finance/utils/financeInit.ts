// Finance Module Initialization
// Registers integration hooks and sets up finance module functionality

import { registerIntegrationHooks } from '../services/integrationService';

let initialized = false;

export const initializeFinanceModule = () => {
  if (initialized) {
    console.log('Finance module already initialized');
    return;
  }

  try {
    // Register integration hooks for admin module events
    registerIntegrationHooks();

    // Set up any other finance module initialization
    console.log('Finance module initialized successfully');
    initialized = true;
  } catch (error) {
    console.error('Failed to initialize finance module:', error);
  }
};

// Helper function to trigger finance integration from admin modules
export const triggerFinanceIntegration = {
  paymentRequestApproval: (paymentRequest: any) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('paymentRequestApproved', {
        detail: paymentRequest
      }));
    }
  },

  expenseAuthorizationApproval: (expenseAuth: any) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('expenseAuthorizationApproved', {
        detail: expenseAuth
      }));
    }
  },

  fundRequestApproval: (fundRequest: any) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fundRequestApproved', {
        detail: fundRequest
      }));
    }
  },

  travelExpenseReportApproval: (ter: any) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('travelExpenseReportApproved', {
        detail: ter
      }));
    }
  }
};

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    initializeFinanceModule();
  }, 100);
}

export default initializeFinanceModule;