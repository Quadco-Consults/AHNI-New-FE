// QuickBooks Validation Rules and Constants

// QuickBooks Data Format Requirements
export const QuickBooksValidation = {
  // General limits
  MAX_STRING_LENGTH: 4000,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 4000,
  MAX_ACCOUNT_NUMBER_LENGTH: 7,

  // Date formats
  DATE_FORMAT: 'YYYY-MM-DD',  // ISO 8601

  // Decimal precision
  DECIMAL_PLACES: 2,
  QUANTITY_DECIMAL_PLACES: 5,

  // Amount limits
  MAX_AMOUNT: 99999999999.99,
  MIN_AMOUNT: -99999999999.99,

  // Special characters - NOT ALLOWED in names
  FORBIDDEN_CHARS: /[<>&"']/g,

  // Account number validation
  ACCOUNT_NUMBER_REGEX: /^\d{1,7}$/,

  // Reference number format
  REFERENCE_NUMBER_MAX_LENGTH: 21,

  // Journal Entry number format
  JOURNAL_ENTRY_PREFIX: 'JE-',
  JOURNAL_ENTRY_NUMBER_REGEX: /^JE-\d{4,}$/,
};

// Validation result interface
export interface ValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

// Validation helper functions
export const validateForQuickBooks = {
  accountNumber: (value: string): ValidationResult => {
    if (!value) return { valid: true }; // Optional field

    if (!QuickBooksValidation.ACCOUNT_NUMBER_REGEX.test(value)) {
      return {
        valid: false,
        error: 'Account number must be 1-7 digits only'
      };
    }
    return { valid: true };
  },

  name: (value: string): ValidationResult => {
    if (!value) return { valid: false, error: 'Name is required' };

    if (value.length > QuickBooksValidation.MAX_NAME_LENGTH) {
      return {
        valid: false,
        error: `Name exceeds ${QuickBooksValidation.MAX_NAME_LENGTH} characters`
      };
    }

    if (QuickBooksValidation.FORBIDDEN_CHARS.test(value)) {
      return {
        valid: false,
        error: 'Name contains forbidden characters: < > & " \''
      };
    }

    return { valid: true };
  },

  description: (value: string): ValidationResult => {
    if (!value) return { valid: true }; // Optional field

    if (value.length > QuickBooksValidation.MAX_DESCRIPTION_LENGTH) {
      return {
        valid: false,
        error: `Description exceeds ${QuickBooksValidation.MAX_DESCRIPTION_LENGTH} characters`
      };
    }

    if (QuickBooksValidation.FORBIDDEN_CHARS.test(value)) {
      return {
        valid: false,
        error: 'Description contains forbidden characters: < > & " \''
      };
    }

    return { valid: true };
  },

  amount: (value: number): ValidationResult => {
    if (value > QuickBooksValidation.MAX_AMOUNT || value < QuickBooksValidation.MIN_AMOUNT) {
      return {
        valid: false,
        error: 'Amount exceeds QuickBooks limits (±99,999,999,999.99)'
      };
    }

    // Check decimal places
    const decimals = (value.toString().split('.')[1] || '').length;
    if (decimals > QuickBooksValidation.DECIMAL_PLACES) {
      return {
        valid: false,
        error: `Amount has more than ${QuickBooksValidation.DECIMAL_PLACES} decimal places`
      };
    }

    return { valid: true };
  },

  date: (value: string): ValidationResult => {
    if (!value) return { valid: false, error: 'Date is required' };

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { valid: false, error: 'Invalid date format' };
    }

    // QB doesn't allow dates before 1970
    if (date.getFullYear() < 1970) {
      return {
        valid: false,
        error: 'QuickBooks does not support dates before 1970'
      };
    }

    // QB doesn't allow future dates beyond reasonable limits
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 10);
    if (date > maxDate) {
      return {
        valid: false,
        error: 'Date cannot be more than 10 years in the future'
      };
    }

    return { valid: true };
  },

  journalEntryNumber: (value: string): ValidationResult => {
    if (!value) return { valid: false, error: 'Journal entry number is required' };

    if (!QuickBooksValidation.JOURNAL_ENTRY_NUMBER_REGEX.test(value)) {
      return {
        valid: false,
        error: 'Journal entry number must follow format: JE-NNNN'
      };
    }

    return { valid: true };
  },

  referenceNumber: (value: string): ValidationResult => {
    if (!value) return { valid: true }; // Optional field

    if (value.length > QuickBooksValidation.REFERENCE_NUMBER_MAX_LENGTH) {
      return {
        valid: false,
        error: `Reference number exceeds ${QuickBooksValidation.REFERENCE_NUMBER_MAX_LENGTH} characters`
      };
    }

    return { valid: true };
  },

  // Validate double-entry balance
  journalEntryBalance: (lines: Array<{debit_amount: number; credit_amount: number}>): ValidationResult => {
    const totalDebits = lines.reduce((sum, line) => sum + (line.debit_amount || 0), 0);
    const totalCredits = lines.reduce((sum, line) => sum + (line.credit_amount || 0), 0);
    const difference = Math.abs(totalDebits - totalCredits);

    // QB allows 0.01 tolerance for rounding
    if (difference > 0.01) {
      return {
        valid: false,
        error: `Entry is out of balance by ${difference.toFixed(2)}. Debits must equal credits (tolerance: ±0.01)`
      };
    }

    // Check for lines with both debit and credit
    const hasInvalidLines = lines.some(line =>
      line.debit_amount > 0 && line.credit_amount > 0
    );

    if (hasInvalidLines) {
      return {
        valid: false,
        error: 'Each line must have either debit or credit amount, not both'
      };
    }

    // Minimum 2 lines required
    if (lines.length < 2) {
      return {
        valid: false,
        error: 'Journal entry must have at least 2 lines'
      };
    }

    return { valid: true };
  },
};

// Account type mapping helpers
export const AccountTypeMapping = {
  // Map ERP account types to QuickBooks types
  erpToQuickBooks: {
    'ASSETS': ['Bank', 'Other Current Asset', 'Accounts Receivable', 'Fixed Asset', 'Other Asset'],
    'LIABILITIES': ['Accounts Payable', 'Credit Card', 'Long Term Liability', 'Other Current Liability'],
    'EQUITY': ['Equity'],
    'REVENUE': ['Income', 'Other Income'],
    'EXPENSES': ['Expense', 'Other Expense', 'Cost of Goods Sold'],
  } as const,

  // Get valid QB types for ERP type
  getValidQuickBooksTypes: (erpType: string): string[] => {
    return AccountTypeMapping.erpToQuickBooks[erpType as keyof typeof AccountTypeMapping.erpToQuickBooks] || [];
  },

  // Validate QB type against ERP type
  isValidMapping: (erpType: string, qbType: string): boolean => {
    const validTypes = AccountTypeMapping.getValidQuickBooksTypes(erpType);
    return validTypes.includes(qbType);
  },
};

// Currency validation
export const CurrencyValidation = {
  // ISO 4217 currency codes commonly supported by QuickBooks
  SUPPORTED_CURRENCIES: [
    'USD', 'CAD', 'EUR', 'GBP', 'AUD', 'JPY', 'CHF', 'CNY', 'INR', 'MXN',
    'BRL', 'ZAR', 'NZD', 'SGD', 'HKD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK',
    'HUF', 'RON', 'BGN', 'HRK', 'RUB', 'TRY', 'ILS', 'AED', 'SAR', 'QAR',
    'KWD', 'BHD', 'OMR', 'JOD', 'LBP', 'EGP', 'MAD', 'TND', 'DZD', 'LYD',
    'NGN', 'GHS', 'KES', 'UGX', 'TZS', 'ZMW', 'BWP', 'SZL', 'LSL', 'MWK',
  ],

  isValid: (currencyCode: string): boolean => {
    return CurrencyValidation.SUPPORTED_CURRENCIES.includes(currencyCode);
  },

  getDefault: (): string => 'USD',
};

// Export all validation functions as a single object
export const QuickBooksValidator = {
  ...validateForQuickBooks,
  AccountTypeMapping,
  CurrencyValidation,
  QuickBooksValidation,
};